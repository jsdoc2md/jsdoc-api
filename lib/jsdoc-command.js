import arrayify from 'array-back'
import path from 'path'
import TempFile from './temp-file.js'
import FileSet from 'file-set'
import assert from 'assert'
import walkBack from 'walk-back'
import { promises as fs } from 'node:fs'
import currentModulePaths from 'current-module-paths'

const { __dirname } = currentModulePaths(import.meta.url)

class JsdocCommand {
  constructor (options = {}, cache) {
    assert.ok(
      options.files?.length || options.source || options.configure,
      'Must set at least one of .files, .source or .configure'
    )
    options.files = arrayify(options.files)

    this.cache = cache
    this.tempFile = null
    if (options.source) this.tempFile = new TempFile(options.source)

    const jsdocOptions = Object.assign({}, options)
    delete jsdocOptions.files
    delete jsdocOptions.source
    delete jsdocOptions.cache

    /* see: https://github.com/jsdoc2md/jsdoc-api/issues/22 */
    if (!jsdocOptions.pedantic) {
      delete jsdocOptions.pedantic
    }

    this.options = options
    this.jsdocOptions = jsdocOptions

    this.jsdocPath = walkBack(
      path.join(__dirname, '..'),
      path.join('node_modules', 'jsdoc', 'jsdoc.js')
    )
  }

  async execute () {
    this.inputFileSet = new FileSet()
    await this.inputFileSet.add(this.options.files)
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
