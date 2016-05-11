'use strict'
const path = require('path')
const assert = require('assert')
const walkBack = require('walk-back')
const spawnSync = require('child_process').spawnSync
const spawn = require('child_process').spawn
const toSpawnArgs = require('object-to-spawn-args')
const arrayify = require('array-back')
const collectAll = require('collect-all')
const TempFile = require('./temp-file')
const FileSet = require('file-set')
const homePath = require('home-path')
const fs = require('then-fs')

const CACHE_DIR = path.resolve(homePath(), '.jsdoc-api')

/**
 * @module jsdoc
 */

const jsdocPath = walkBack(
  path.join(__dirname, '..'),
  path.join('node_modules', 'jsdoc-75lb', 'jsdoc.js')
)

/**
 * Command base class. The command `receiver` being the `child_process` module.
 * @abstract
 */
class JsdocCommand {
  constructor (options) {
    require('promise.prototype.finally')

    options = options || {}
    options.files = arrayify(options.files)

    this.tempFile = null
    if (options.source) this.tempFile = new TempFile(options.source)

    const jsdocOptions = Object.assign({}, options)
    delete jsdocOptions.files
    delete jsdocOptions.source
    delete jsdocOptions.cache

    this.options = options
    this.jsdocOptions = jsdocOptions
  }

  /**
   * Template method returning the jsdoc output. Invoke later (for example via a command-queuing system) or immediately as required.
   *
   * 1. preExecute
   * 2. validate
   * 3. getOutput
   * 4. postExecute
   *
   */
  execute () {
    this.preExecute()
    const err = this.validate()
    this.output = this.getOutput(err)
    if (this.output instanceof Promise) {
      this.output.finally(() => {
        this.postExecute()
      })
    } else {
      this.postExecute()
    }
    return this.output
  }

  /**
   * Perform pre-execution processing here, e.g. expand input glob patterns.
   */
  preExecute () {
    this.inputFileSet = new FileSet(this.options.files)
  }

  /**
   * Return an Error instance if execution should not proceed.
   * @returns {null|Error}
   */
  validate () {
    assert.ok(
      this.options.files.length || this.options.source,
      'Must set either .files or .source'
    )

    if (this.inputFileSet.notExisting.length) {
      const err = new Error('These files do not exist: ' + this.inputFileSet.notExisting)
      err.name = 'JSDOC_ERROR'
      return err
    }
  }

  /**
   * perform post-execution cleanup
   */
  postExecute () {
    if (this.tempFile) {
      this.tempFile.delete()
    }
  }

  verifyOutput (code, output) {
    let parseFailed = false
    let parsedOutput
    try {
      parsedOutput = JSON.parse(output.stdout)
    } catch (err) {
      parseFailed = true
    }

    if (code > 0 || parseFailed) {
      const firstLineOfStdout = output.stdout.split(/\r?\n/)[0]
      const err = new Error(output.stderr.trim() || firstLineOfStdout || 'Jsdoc failed.')
      err.name = 'JSDOC_ERROR'
      throw err
    } else {
      return parsedOutput
    }
  }
}

/**
 * @extends module:jsdoc~JsdocCommand
 * @static
 */
class Explain extends JsdocCommand {

  getOutput (err) {
    if (err) return Promise.reject(err)

    return this.checkCache()
      .then(cachedOutput => {
        if (cachedOutput) {
          return cachedOutput
        } else {
          return new Promise((resolve, reject) => {
            const jsdocOutput = {
              stdout: '',
              stderr: '',
              collectInto (dest) {
                return collectAll(data => { this[dest] = data.toString() })
              }
            }

            const jsdocArgs = toSpawnArgs(this.jsdocOptions)
              .concat([ '-X' ])
              .concat(this.options.source ? this.tempFile.path : this.inputFileSet.files)
            jsdocArgs.unshift(jsdocPath)

            const handle = spawn('node', jsdocArgs)
            handle.stderr.pipe(jsdocOutput.collectInto('stderr'))
            handle.stdout.pipe(jsdocOutput.collectInto('stdout'))

            handle
              .on('close', code => {
                try {
                  const explainOutput = this.verifyOutput(code, jsdocOutput)
                  fs.writeFileSync(this.cachePath, JSON.stringify(explainOutput))
                  resolve(explainOutput)
                } catch (err) {
                  reject(err)
                }
              })
          })
        }
      })
  }

  /**
   * Returns a cached recordset or null
   * @returns {Promise}
   * @fulfil {object[]}
   */
  checkCache () {
    const crypto = require('crypto')
    const hash = crypto.createHash('sha1')

    const promises = this.inputFileSet.files.map(file => fs.readFile(file))

    return Promise.all(promises)
      .then(contents => {
        contents.forEach(content => hash.update(content))
        hash.update(this.inputFileSet.files.join())
        this.checksum = hash.digest('hex')
        this.cachePath = path.resolve(CACHE_DIR, this.checksum)

        try {
          return JSON.parse(fs.readFileSync(this.cachePath, 'utf8'))
        } catch (err) {
          return null
        }
      })
      .catch(err => console.error(err.stack))
  }
}

/**
 * @static
 */
class ExplainSync extends JsdocCommand {
  getOutput (err) {
    if (err) throw err

    const jsdocArgs = toSpawnArgs(this.jsdocOptions)
      .concat([ '-X' ])
      .concat(this.options.source ? this.tempFile.path : this.inputFileSet.files)
    jsdocArgs.unshift(jsdocPath)
    const result = spawnSync('node', jsdocArgs, { encoding: 'utf-8' })
    const explainOutput = this.verifyOutput(result.status, result)
    // fs.writeFileSync(this.cachePath, JSON.stringify(explainOutput))
    return explainOutput
  }
}

/**
 * @static
 */
class RenderSync extends JsdocCommand {
  getOutput (err) {
    if (err) throw err
    const jsdocArgs = toSpawnArgs(this.jsdocOptions)
      .concat(this.options.source ? this.tempFile.path : this.options.files)
    jsdocArgs.unshift(jsdocPath)
    spawnSync('node', jsdocArgs)
  }
}

exports.Explain = Explain
exports.ExplainSync = ExplainSync
exports.RenderSync = RenderSync
