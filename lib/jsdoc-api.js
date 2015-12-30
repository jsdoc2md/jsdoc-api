'use strict'
const path = require('path')
const assert = require('assert')
const walkBack = require('walk-back')
const spawnSync = require('child_process').spawnSync
const toSpawnArgs = require('object-to-spawn-args')
const arrayify = require('array-back')
const ExplainStream = require('./explain-stream')
const TempFile = require('./temp-file')
const jsdoc = require('./jsdoc')

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
 * @param [options] {object}
 * @param [options.files] {string|string[]}
 * @param [options.source] {string}
 * @returns {object}
 * @static
 * @node Requires version 0.12 and above
 */
function explainSync (options) {
  const jsdocExplainSync = new jsdoc.ExplainSync(options)
  return jsdocExplainSync.execute()
}

/**
 * @param [options] {object}
 * @param [options.files] {string|string[]}
 * @param [options.source] {string}
 * @param [options.configure]
 * @fulfil {object[]} - jsdoc explain output
 * @returns {Promise}
 * @static
 * @throws `INVALID_FILES` - One or more files was not valid source code
 */
function explain (options) {
  const jsdocExplain = new jsdoc.Explain(options)
  return jsdocExplain.execute()
}

/**
 * @param [options] {object}
 * @param [options.files] {string|string[]}
 * @param [options.source] {string}
 * @param [options.configure]
 * @returns {Duplex}
 * @static
 */
function createExplainStream (options) {
  return new ExplainStream(explain, options)
}

/**
 * @param [options.files] {string|string[]}
 * @param [options.source] {string}
 * @param [options.configure]
 * @param [options.destination] - destination path
 * @static
 */
function renderSync (options) {
  options = Object.assign({ files: [] }, options)
  options.files = arrayify(options.files)
  assert.ok(options.files.length || options.source, 'Must set either .files or .source')

  let tempFile = null
  if (options.source) tempFile = new TempFile(options.source)

  const jsdocOptions = Object.assign({}, options)
  delete jsdocOptions.files
  delete jsdocOptions.source

  const jsdocArgs = toSpawnArgs(jsdocOptions)
    .concat(options.source ? tempFile.path : options.files)

  spawnSync(jsdocPath, jsdocArgs)
}
