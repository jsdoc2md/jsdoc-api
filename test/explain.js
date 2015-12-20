var test = require('tape')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')
var collectJson = require('collect-json')

test('.explainSync(files, options)', function (t) {
  var f = new Fixture('global/class-all')
  var output = jsdoc.explainSync(f.sourcePath)
  var expectedOutput = f.getExpectedOutput()
  Fixture.removeFileSpecificData(output, expectedOutput)

  t.ok(typeof output === 'object')
  t.deepEqual(output, expectedOutput)
  t.end()
})

test('.explainSync.source(files, options)', function(t){
  var f = new Fixture('global/class-all')
  var output = jsdoc.explainSync.source(f.getSource())
  var expectedOutput = f.getExpectedOutput()
  Fixture.removeFileSpecificData(output, expectedOutput)

  t.ok(typeof output === 'object')
  t.deepEqual(output, expectedOutput)
  t.end()
})

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
      console.log(output)
      var expectedOutput = f.getExpectedOutput()
      Fixture.removeFileSpecificData(output, expectedOutput)
      t.deepEqual(output, expectedOutput)
    })
})

test('.createExplainStream(files, options)', function (t) {
  t.plan(1)
  var f = new Fixture('global/class-all')
  jsdoc.createExplainStream(f.sourcePath)
    .pipe(collectJson(output => {
      var expectedOutput = f.getExpectedOutput()
      Fixture.removeFileSpecificData(output, expectedOutput)
      t.deepEqual(output, expectedOutput)
    }))
})

test('.createExplainStream.source(source, options)')
