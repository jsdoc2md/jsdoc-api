'use strict'
const walkBack = require('walk-back')
const spawnSync = require('child_process').spawnSync
const path = require('path')
const fs = require('fs')
const getTempPath = require('temp-path')

/**
 * @module jsdoc-api
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
  const tempPath = getTempPath() + '.js'
  fs.writeFileSync(tempPath, source)
  const args = [ '-X' ].concat(tempPath)
  const result = spawnSync(jsdocPath, args)
  fs.unlinkSync(tempPath)
  return JSON.parse(result.stdout)
}

function render() {}
