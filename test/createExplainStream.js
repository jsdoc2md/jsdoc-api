var test = require('tape')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')
var collectJson = require('collect-json')

test('.createExplainStream({ files })', function (t) {
  t.plan(1)
  var f = new Fixture('global/class-all')
  jsdoc.createExplainStream({ files: f.sourcePath })
    .pipe(collectJson(function (output) {
      var expectedOutput = f.getExpectedOutput(output)
      t.deepEqual(output, expectedOutput)
    }))
})

test('.createExplainStream({ source })', function (t) {
  t.plan(1)
  var f = new Fixture('global/class-all')
  jsdoc.createExplainStream({ source: f.getSource() })
    .pipe(collectJson(function (output) {
      var expectedOutput = f.getExpectedOutput(output)
      t.deepEqual(output, expectedOutput)
    }))
})

test('.createExplainStream() stream input', function (t) {
  t.plan(1)
  var f = new Fixture('global/class-all')
  f.createReadStream().pipe(jsdoc.createExplainStream())
    .pipe(collectJson(function (output) {
      var expectedOutput = f.getExpectedOutput()
      Fixture.removeFileSpecificData(output, expectedOutput)
      t.deepEqual(output, expectedOutput)
    }))
})

test('.createExplainStream: no valid files', function (t) {
  t.plan(1)
  jsdoc.createExplainStream({ files: 'package.json' })
    .on('error', function (err) {
      t.strictEqual(err.name, 'INVALID_FILES')
    })
    .pipe(collectJson(function (output) {
      t.fail('should not reach here')
    }))
})
