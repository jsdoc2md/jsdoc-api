var test = require('tape')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')
var collectJson = require('collect-json')
var path = require('path')

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
      t.strictEqual(err.name, 'JSDOC_ERROR')
    })
    .pipe(collectJson(function (output) {
      t.fail('should not reach here')
    }))
})

test('.createExplainStream: missing files', function (t) {
  t.plan(1)
  jsdoc.createExplainStream({ files: 'asljkdhfkljads' })
    .on('error', function (err) {
      t.strictEqual(err.name, 'JSDOC_ERROR')
    })
    .pipe(collectJson(function (output) {
      t.fail('should not reach here')
    }))
})

test('.createExplainStream: invalid doclet syntax', function (t) {
  t.plan(1)
  var input = path.resolve(__dirname, '..', 'node_modules', 'jsdoc2md-testbed', 'build', 'input/buggy/bad-syntax.js')
  jsdoc.createExplainStream({ files: input })
    .on('error', function (err) {
      t.strictEqual(err.name, 'JSDOC_ERROR')
    })
    .pipe(collectJson(function (output) {
      t.fail('should not reach here')
    }))
})
