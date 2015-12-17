'use strict'
const walkBack = require('walk-back')
const spawnSync = require('child_process').spawnSync
const path = require('path')
const fs = require('fs')
const getTempPath = require('temp-path')
const toSpawnArgs = require('object-to-spawn-args')

/**
 * @module jsdoc-api
 * @example
 * const jsdoc = require('jsdoc-api')
 */
exports.explain = explain
exports.render = render

const jsdocPath = walkBack(
  path.join(__dirname, '..'),
  path.join('node_modules', 'jsdoc-75lb', 'jsdoc.js')
)

/**
 * @param {string} - source code
 * @returns {object} - json
 */
function explain (source) {
  const tempFile = new TempFile(source)
  const args = [ '-X' ].concat(tempFile.path)
  const result = spawnSync(jsdocPath, args)
  tempFile.delete()
  return JSON.parse(result.stdout)
}

/**
 * @param {string} - the source code
 * @param [options] {object} - options
 * @param [options.destination] - destination path
 */
function render(source, options) {
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
