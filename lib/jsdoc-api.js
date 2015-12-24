'use strict'
const Duplex = require('stream').Duplex
const path = require('path')
const fs = require('fs')
const walkBack = require('walk-back')
const spawnSync = require('child_process').spawnSync
const spawn = require('child_process').spawn
const getTempPath = require('temp-path')
const toSpawnArgs = require('object-to-spawn-args')
const arrayify = require('array-back')
const collectJson = require('collect-json')
const collectAll = require('collect-all')

/**
 * @module jsdoc-api
 * @typicalname jsdoc
 * @example
 * const jsdoc = require('jsdoc-api')
 */
exports.explainSync = explainSync
exports.explain = explain
exports.createExplainStream = createExplainStream
exports.renderSync = renderSync

const jsdocPath = walkBack(
  path.join(__dirname, '..'),
  path.join('node_modules', 'jsdoc-75lb', 'jsdoc.js')
)

/**
 * Returns jsdoc explain output
 * @param {string|string[]} - input file names
 * @returns {object}
 * @static
 * @node Requires version 0.12 and above
 */
function explainSync (files, options) {
  const args = [ '-X' ].concat(arrayify(files))
  const result = spawnSync(jsdocPath, args)
  return JSON.parse(result.stdout)
}

/**
 * Returns jsdoc explain output, taking source code as input.
 * @param {string} - source code
 * @returns {object[]}
 * @static
 * @node Requires version 0.12 and above
 */
explainSync.source = function explainSyncSource (source) {
  const tempFile = new TempFile(source)
  const args = [ '-X' ].concat(tempFile.path)
  const result = spawnSync(jsdocPath, args)
  tempFile.delete()
  return JSON.parse(result.stdout)
}

/**
 * @param {string|string[]} - input source files
 * @param [options] {object}
 * @param [options.configure]
 * @fulfil {object[]} - jsdoc explain output
 * @returns {Promise}
 * @static
 * @throws `INVALID_FILES` - One or more files was not valid source code
 */
function explain (files, options) {
  return new Promise(function (resolve, reject) {
    const jsdocArgs = toSpawnArgs(options)
      .concat([ '-X' ])
      .concat(arrayify(files))
    const output = {
      stdout: '',
      stderr: ''
    }
    // console.log(jsdocArgs)
    const handle = spawn(jsdocPath, jsdocArgs)
    handle
      .on('error', err => reject(err))
      .stdout.pipe(collectJson(data => {
        output.stdout = data
      }))
      .on('error', err => {
        if (/no input files/.test(err.message)) {
          const invalidErr = new Error(`Invalid input files [${files}]`)
          invalidErr.name = 'INVALID_FILES'
          reject(invalidErr)
        } else {
          reject(err)
        }
      })
    handle
      .stderr.pipe(collectAll(text => {
        output.stderr = text
      }))
      .on('error', err => reject(err))
    handle
      .on('close', code => {
        if (code) {
          reject(output.stderr)
        } else {
          resolve(output.stdout)
        }
      })
  })
}

/**
 * @param {string} - input source code
 * @fulfil {object[]} - jsdoc explain output
 * @returns {Promise}
 * @static
 */
explain.source = function explainSource (source) {
  const tempFile = new TempFile(source)
  return new Promise(function (resolve, reject) {
    spawn(jsdocPath, [ '-X' ].concat(tempFile.path))
      .stdout.pipe(collectJson((data) => {
        resolve(data)
        tempFile.delete()
      }))
  })
}

/**
 * @param {string|string[]} - input source files
 * @param [options] {object}
 * @param [options.configure]
 * @returns {Readable}
 * @static
 */
function createExplainStream (files, options) {
  return new ExplainStream(files, options)
}

/**
 * @param {string|string[]} - input source files
 * @param [options] {object} - options
 * @param [options.destination] - destination path
 * @static
 */
function renderSync (files, options) {
  const args = toSpawnArgs(options).concat(arrayify(files))
  spawnSync(jsdocPath, args)
}

/**
 * @param {string} - the source code
 * @param [options] {object} - options
 * @param [options.destination] - destination path
 * @static
 */
renderSync.source = function renderSyncSource (source, options) {
  const tempFile = new TempFile(source)
  const args = toSpawnArgs(options).concat(tempFile.path)
  spawnSync(jsdocPath, args)
  tempFile.delete()
}

class TempFile {
  constructor (source) {
    this.path = getTempPath() + '.js'
    fs.writeFileSync(this.path, source)
  }
  delete () {
    fs.unlinkSync(this.path)
  }
}

class ExplainStream extends Duplex {
  constructor (options) {
    super()
    options = options || {}
    this.files = arrayify(options.files)
    delete options.files
    this.options = options

    this.on('pipe', src => {
      if (!this.inProgress) {
        src.pipe(collectAll(source => {
          // console.log('source', source)
          explain.source(source, this.options)
            .then(output => {
              this.push(JSON.stringify(output, null, '  '))
              this.push(null)
              this.inProgress = false
            })
            .catch(err => this.emit('error', err))
          this.inProgress = true
        }))
      }
    })
  }

  start () {
    explain(this.files, this.options)
      .then(output => {
        this.push(JSON.stringify(output, null, '  '))
        this.push(null)
        this.inProgress = false
      })
      .catch(err => this.emit('error', err))
    this.inProgress = true
  }

  _read () {
    // console.log('_READ CALLED')
    if (!this.inProgress && this.files.length) {
      this.start()
    }
  }

  _write (chunk, encoding, done) {
    // console.log('_WRITE CALLED')
    // console.dir(chunk)
    done()
  }

}
