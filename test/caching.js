var test = require('tape')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')
var path = require('path')
var fs = require('then-fs')

test.skip('.clean()', function (t) {
  t.plan(1)
  jsdoc.clean()
    .then(function () {
      var cachedFiles = fs.readdirSync(jsdoc.CACHE_DIR)
      t.strictEqual(cachedFiles.length, 0)
    })
    .catch(function (err) { console.error(err.stack) })
})

test.skip('.explain({ files })', function (t) {
  t.plan(3)
  var f = new Fixture('class-all')
  jsdoc.explain({ files: f.sourcePath, cache: true })
    .then(function (output) {
      var cachedFiles = fs.readdirSync(jsdoc.CACHE_DIR)
        .map(function (file) {
          return path.resolve(jsdoc.CACHE_DIR, file)
        })
      t.strictEqual(cachedFiles.length, 1)
      t.deepEqual(output, f.getExpectedOutput(output))
      const cachedData = JSON.parse(fs.readFileSync(cachedFiles[0], 'utf8'))
      Fixture.removeFileSpecificData(cachedData)
      t.deepEqual(
        cachedData,
        f.getExpectedOutput(output)
      )
    })
    .catch(function (err) { console.error(err.stack) })
})
