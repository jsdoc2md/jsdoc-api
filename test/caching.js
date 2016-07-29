var test = require('tape')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')
var path = require('path')
var fs = require('then-fs')

test('.explain({ files } with cache)', function (t) {
  t.plan(3)
  var f = new Fixture('class-all')
  jsdoc.cache.dir = 'tmp/cache'
  jsdoc.explain({ files: f.sourcePath, cache: true })
    .then(function (output) {
      var cachedFiles = fs.readdirSync(jsdoc.cache.dir)
        .map(function (file) {
          return path.resolve(jsdoc.cache.dir, file)
        })
      t.strictEqual(cachedFiles.length, 1)
      t.deepEqual(output, f.getExpectedOutput(output))
      const cachedData = JSON.parse(fs.readFileSync(cachedFiles[0], 'utf8'))
      Fixture.removeFileSpecificData(cachedData)
      t.deepEqual(
        cachedData,
        f.getExpectedOutput(output)
      )
      jsdoc.cache.remove()
    })
    .catch(function (err) { console.error(err.stack) })
})
