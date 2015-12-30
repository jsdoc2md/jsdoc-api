'use strict'
const path = require('path')
const assert = require('assert')
const walkBack = require('walk-back')
const spawnSync = require('child_process').spawnSync
const spawn = require('child_process').spawn
const toSpawnArgs = require('object-to-spawn-args')
const arrayify = require('array-back')
const collectJson = require('collect-json')
const collectAll = require('collect-all')
const ExplainStream = require('./explain-stream')
const TempFile = require('./temp-file')

const jsdocPath = walkBack(
  path.join(__dirname, '..'),
  path.join('node_modules', 'jsdoc-75lb', 'jsdoc.js')
)

class Jsdoc {
  constructor (options) {
    options = options || {}
    options.files = arrayify(options.files)

    assert.ok(
      options.files.length || options.source,
      'Must set either .files or .source'
    )

    this.tempFile = null
    if (options.source) this.tempFile = new TempFile(options.source)

    const jsdocOptions = Object.assign({}, options)
    delete jsdocOptions.files
    delete jsdocOptions.source

    this.options = options
    this.jsdocOptions = jsdocOptions
  }

  validate () {

  }
}

class JsdocExplain extends Jsdoc {
  constructor (options) {
    super(options)
  }
  execute () {
    const FileSet = require('file-set')
    this.inputFileSet = new FileSet(this.options.files)

    if (this.inputFileSet.notExisting.length) {
      const err = new Error('These files do not exist: ' + this.inputFileSet.notExisting)
      err.name = 'INVALID_FILES'
      return Promise.reject(err)
    }

    return new Promise((resolve, reject) => {
      const jsdocOutput = {
        stdout: '',
        stderr: '',
        collectInto (dest) {
          return collectAll(data => this[dest] = data.toString())
        }
      }

      const jsdocArgs = toSpawnArgs(this.jsdocOptions)
        .concat([ '-X' ])
        .concat(this.options.source ? this.tempFile.path : this.options.files)

      const handle = spawn(jsdocPath, jsdocArgs)
      handle.stderr.pipe(jsdocOutput.collectInto('stderr'))
      handle.stdout.pipe(jsdocOutput.collectInto('stdout'))

      handle
        .on('close', code => {
          if (code) {
            const err = new Error(jsdocOutput.stderr.trim())
            err.name = 'INVALID_FILES'
            reject(err)
          } else {
            if (code === 0 && /There are no input files to process/.test(jsdocOutput.stdout)) {
              const err = new Error('There are no input files to process')
              err.name = 'INVALID_FILES'
              reject(err)
            } else {
              resolve(JSON.parse(jsdocOutput.stdout))
            }
          }
          if (this.tempFile) this.tempFile.delete()
        })
    })
  }
}

exports.Jsdoc = Jsdoc
exports.JsdocExplain = JsdocExplain
