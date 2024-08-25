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
    options.source = arrayify(options.source)

    this.cache = cache
    this.tempFiles = []

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

    if (this.options.source.length) {
      this.tempFiles = this.options.source.map(source => new TempFile(source))
      this.tempFileSet = new FileSet()
      await this.tempFileSet.add(this.tempFiles.map(t => t.path))
    }

    let result
    try {
      result = await this.getOutput()
    } finally {
      if (this.tempFiles) {
        for (const tempFile of this.tempFiles) {
          tempFile.delete()
        }
      }
    }
    return result
  }
}

export default JsdocCommand
