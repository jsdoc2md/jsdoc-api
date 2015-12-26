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
  options = Object.assign({}, options)
  options.files = arrayify(options.files)
  assert.ok(options.files.length || options.source, 'Must set either .files or .source')

  let tempFile = null
  if (options.source) tempFile = new TempFile(options.source)

  const jsdocOptions = Object.assign({}, options)
  delete jsdocOptions.files
  delete jsdocOptions.source

  const jsdocArgs = toSpawnArgs(jsdocOptions)
    .concat([ '-X' ])
    .concat(options.source ? tempFile.path : options.files)

  const result = spawnSync(jsdocPath, jsdocArgs)
  if (tempFile) tempFile.delete()
  return JSON.parse(result.stdout)
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
  options = Object.assign({ files: [] }, options)
  options.files = arrayify(options.files)
  assert.ok(options.files.length || options.source, 'Must set either .files or .source')

  let tempFile = null
  if (options.source) tempFile = new TempFile(options.source)

  const jsdocOptions = Object.assign({}, options)
  delete jsdocOptions.files
  delete jsdocOptions.source

  const jsdocArgs = toSpawnArgs(jsdocOptions)
    .concat([ '-X' ])
    .concat(options.source ? tempFile.path : options.files)

  const jsdocOutput = {
    stdout: '',
    stderr: '',
    collectInto (dest) {
      return collectAll(data => this[dest] = data.toString())
    }
  }

  return new Promise((resolve, reject) => {
    const handle = spawn(jsdocPath, jsdocArgs)
    handle.stderr.pipe(jsdocOutput.collectInto('stderr'))
    handle.stdout.pipe(jsdocOutput.collectInto('stdout'))

    handle
      .on('close', code => {
        // console.error('CLOSE YEAH?', code, jsdocOutput);

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
        if (tempFile) tempFile.delete()
      })
  })
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
