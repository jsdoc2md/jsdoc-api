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

  async execute () {
    this.inputFileSet = new FileSet(this.options.files)
    assert.ok(
      this.options.files.length || this.options.source,
      'Must set either .files or .source'
    )
    let result
    try {
      result = await this.getOutput()
    } finally {
      if (this.tempFile) {
        this.tempFile.delete()
      }
    }
    return result
  }
}

export default JsdocCommand
