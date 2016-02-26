var test = require('tape')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')
var collectJson = require('collect-json')

test('.explain({ files, html: true })', function (t) {
  t.plan(1)
  var f = new Fixture('html', '0-src.html')
  jsdoc.explain({ files: f.sourcePath, html: true })
    .then(function (output) {
      t.deepEqual(output, f.getExpectedOutput(output))
    })
})

test('.createExplainStream({ files, html: true })', function (t) {
  t.plan(1)
  var f = new Fixture('html', '0-src.html')
  jsdoc.createExplainStream({ files: f.sourcePath, html: true })
    .pipe(collectJson(function (output) {
      var expectedOutput = f.getExpectedOutput(output)
      t.deepEqual(output, expectedOutput)
    }))
})
