var test = require('tape')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')

test('.explain(files, options)', function (t) {
  t.plan(1)
  var f = new Fixture('global/class-all')
  jsdoc.explain(f.sourcePath)
    .then(function (output) {
      var expectedOutput = f.getExpectedOutput()
      Fixture.removeFileSpecificData(output, expectedOutput)
      t.deepEqual(output, expectedOutput)
    })
})

test('.explain.source(source)', function (t) {
  t.plan(1)
  var f = new Fixture('global/class-all')
  jsdoc.explain.source(f.getSource())
    .then(function (output) {
      var expectedOutput = f.getExpectedOutput()
      Fixture.removeFileSpecificData(output, expectedOutput)
      t.deepEqual(output, expectedOutput)
    })
})
