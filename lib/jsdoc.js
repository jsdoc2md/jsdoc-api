'use strict'
require('promise.prototype.finally')
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
    options = options || {}
    options.files = arrayify(options.files)



    this.tempFile = null
    if (options.source) this.tempFile = new TempFile(options.source)

    const jsdocOptions = Object.assign({}, options)
    delete jsdocOptions.files
    delete jsdocOptions.source

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
    this.postExecute()
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
      err.name = 'INVALID_FILES'
      return err
    }
  }

  /**
   * perform post-execution cleanup
   */
  postExecute () {
    if (this.tempFile) {
      if (this.output instanceof Promise) {
        this.output.finally(this.tempFile.delete.bind(this.tempFile))
      } else {
        this.tempFile.delete()
      }
    }
  }
}

/**
 * @extends module:jsdoc~JsdocCommand
 * @static
 */
class JsdocExplain extends JsdocCommand {

  getOutput (err) {
    if (err) return Promise.reject(err)

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
        .concat(this.options.source ? this.tempFile.path : this.inputFileSet.files)

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
        })
    })
  }
}

/**
 * @static
 */
class JsdocSync extends JsdocCommand {
  getOutput (err) {
    if (err) throw err

    const jsdocArgs = toSpawnArgs(this.jsdocOptions)
      .concat([ '-X' ])
      .concat(this.options.source ? this.tempFile.path : this.inputFileSet.files)
    const result = spawnSync(jsdocPath, jsdocArgs)
    return JSON.parse(result.stdout)
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
    spawnSync(jsdocPath, jsdocArgs)
  }
}

/**
 * @module jsdoc
 */
exports.Explain = JsdocExplain
exports.ExplainSync = JsdocSync
exports.RenderSync = RenderSync
