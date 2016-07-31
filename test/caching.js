'use strict'
var test = require('test-runner')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')
var path = require('path')
var fs = require('then-fs')
var a = require('core-assert')

test('.explain({ files } with cache)', function () {
  var f = new Fixture('class-all')
  jsdoc.cache.dir = 'tmp/cache'
  return jsdoc.explain({ files: f.sourcePath, cache: true })
    .then(function (output) {
      var cachedFiles = fs.readdirSync(jsdoc.cache.dir)
        .map(function (file) {
          return path.resolve(jsdoc.cache.dir, file)
        })
      a.strictEqual(cachedFiles.length, 1)
      a.deepEqual(output, f.getExpectedOutput(output))
      const cachedData = JSON.parse(fs.readFileSync(cachedFiles[0], 'utf8'))
      Fixture.removeFileSpecificData(cachedData)
      a.deepEqual(
        cachedData,
        f.getExpectedOutput(output)
      )
      jsdoc.cache.remove()
    })
    .catch(function (err) { console.error(err.stack) })
})
