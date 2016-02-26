var test = require('tape')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')
var collectJson = require('collect-json')

test('.createExplainStream({ files })', function (t) {
  t.plan(1)
  var f = new Fixture('class-all')
  jsdoc.createExplainStream({ files: f.sourcePath })
    .pipe(collectJson(function (output) {
      var expectedOutput = f.getExpectedOutput(output)
      t.deepEqual(output, expectedOutput)
    }))
})

test('.createExplainStream({ source })', function (t) {
  t.plan(1)
  var f = new Fixture('class-all')
  jsdoc.createExplainStream({ source: f.getSource() })
    .pipe(collectJson(function (output) {
      var expectedOutput = f.getExpectedOutput(output)
      t.deepEqual(output, expectedOutput)
    }))
})

test('.createExplainStream() stream input - pipe', function (t) {
  t.plan(1)
  var f = new Fixture('class-all')
  f.createReadStream().pipe(jsdoc.createExplainStream())
    .pipe(collectJson(function (output) {
      var expectedOutput = f.getExpectedOutput()
      Fixture.removeFileSpecificData(output, expectedOutput)
      t.deepEqual(output, expectedOutput)
    }))
})

test('.createExplainStream() stream input - write', function (t) {
  t.plan(1)
  var f = new Fixture('class-all')
  var explainStream = jsdoc.createExplainStream()
  explainStream.pipe(collectJson(function (output) {
    if (output) {
      var expectedOutput = f.getExpectedOutput(output)
      t.deepEqual(output, expectedOutput)
    }
  }))
  explainStream.end(f.getSource())
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

/* bad-doclet-syntax.js no exist */
test('.createExplainStream: invalid doclet syntax', function (t) {
  t.plan(1)
  var f = new Fixture('buggy', 'bad-doclet-syntax.js')
  jsdoc.createExplainStream({ files: f.sourcePath })
    .on('error', function (err) {
      t.strictEqual(err.name, 'JSDOC_ERROR')
    })
    .pipe(collectJson(function (output) {
      t.fail('should not reach here')
    }))
})

test('.createExplainStream: handles jsdoc crash', function (t) {
  t.plan(1)
  var f = new Fixture('buggy', 'broken-javascript.js')
  jsdoc.createExplainStream({ files: f.sourcePath })
    .on('error', function (err) {
      t.strictEqual(err.name, 'JSDOC_ERROR')
    })
    .pipe(collectJson(function (output) {
      t.fail('should not reach here')
    }))
})
