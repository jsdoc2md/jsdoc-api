var test = require('tape')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')

Fixture.createTmpFolder('tmp')

test('.explainSync(files, options)', function (t) {
  var f = new Fixture('global/class-all')
  var output = jsdoc.explainSync(f.sourcePath)
  var expectedOutput = JSON.parse(f.getExpectedOutput())
  Fixture.removeFileSpecificData(output, expectedOutput)

  t.ok(typeof output === 'object')
  t.deepEqual(output, expectedOutput)
  t.end()
})

test('.explainSync.source(files, options)', function(t){
  var f = new Fixture('global/class-all')
  var output = jsdoc.explainSync.source(f.getSource())
  var expectedOutput = JSON.parse(f.getExpectedOutput())
  Fixture.removeFileSpecificData(output, expectedOutput)

  t.ok(typeof output === 'object')
  t.deepEqual(output, expectedOutput)
  t.end()
})

test('.explain(files, options)')
test('.explain.source(source, options)')

test('.createExplainStream(files, options)')
test('.createExplainStream.source(source, options)')
