import arrayify from 'array-back'
import path from 'path'
import TempFile from './temp-file.js'
import FileSet from 'file-set'
import assert from 'assert'
import walkBack from 'walk-back'
import { promises as fs } from 'node:fs'
import currentModulePaths from 'current-module-paths'

const { __dirname } = currentModulePaths(import.meta.url)

/**
 * @module jsdoc-command
 */

/**
 * Command base class. The command `receiver` being the `child_process` module.
 * @abstract
 */
class JsdocCommand {
  constructor (options, cache) {
    options = options || {}
    options.files = arrayify(options.files)

    this.cache = cache
    this.tempFile = null
    if (options.source) this.tempFile = new TempFile(options.source)

    const jsdocOptions = Object.assign({}, options)
    delete jsdocOptions.files
    delete jsdocOptions.source
    delete jsdocOptions.cache

    this.options = options
    this.jsdocOptions = jsdocOptions

    this.jsdocPath = walkBack(
      path.join(__dirname, '..'),
      path.join('node_modules', 'jsdoc', 'jsdoc.js')
    )
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
      return this.output
        .then(result => {
          this.postExecute()
          return result
        })
        .catch(err => {
          this.postExecute()
          throw err
        })
    } else {
      this.postExecute()
      return this.output
    }
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

  /**
   * Returns a cached recordset
   * @returns {Promise}
   * @fulfil {object[]}
   */
  async readCache () {
    if (this.cache) {
      const promises = this.inputFileSet.files.map(file => fs.readFile(file, 'utf8'))
      const contents = await Promise.all(promises)
      this.cacheKey = contents.concat(this.inputFileSet.files)
      return this.cache.read(this.cacheKey)
    } else {
      return Promise.reject()
    }
  }
}

export default JsdocCommand
