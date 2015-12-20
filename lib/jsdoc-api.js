'use strict'
const walkBack = require('walk-back')
const spawnSync = require('child_process').spawnSync
const spawn = require('child_process').spawn
const path = require('path')
const fs = require('fs')
const getTempPath = require('temp-path')
const toSpawnArgs = require('object-to-spawn-args')
const defer = require('defer-promise')
const arrayify = require('array-back')
const collectJson = require('collect-json')

/**
 * @module jsdoc-api
 * @example
 * const jsdoc = require('jsdoc-api')
 */
exports.explainSync = explainSync
exports.explain = explain
exports.renderSync = renderSync

const jsdocPath = walkBack(
  path.join(__dirname, '..'),
  path.join('node_modules', 'jsdoc-75lb', 'jsdoc.js')
)

/**
 * @param {string|string[]} - input file names
 * @returns {object} - jsdoc explain output
 * @static
 */
function explainSync (files, options) {
  const args = [ '-X' ].concat(arrayify(files))
  const result = spawnSync(jsdocPath, args)
  return JSON.parse(result.stdout)

}

/**
 * @param {string} - source code
 * @returns {object} - json
 * @static
 */
explainSync.source = function explainSyncSource (source) {
  const tempFile = new TempFile(source)
  const args = [ '-X' ].concat(tempFile.path)
  const result = spawnSync(jsdocPath, args)
  tempFile.delete()
  return JSON.parse(result.stdout)
}

function explain (files) {
  return new Promise(function (resolve, reject) {
    spawn(jsdocPath, [ '-X' ].concat(arrayify(files)))
      .stdout.pipe(collectJson((data) => {
        resolve(data)
      }))
  })
}

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
