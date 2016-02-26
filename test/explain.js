var test = require('tape')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')
var path = require('path')

test('.explain({ files })', function (t) {
  t.plan(1)
  var f = new Fixture('class-all')
  jsdoc.explain({ files: f.sourcePath })
    .then(function (output) {
      t.deepEqual(output, f.getExpectedOutput(output))
    })
})

test('.explain({ source })', function (t) {
  t.plan(1)
  var f = new Fixture('class-all')
  jsdoc.explain({ source: f.getSource() })
    .then(function (output) {
      t.deepEqual(output, f.getExpectedOutput(output))
    })
})

test(".explain: file doesn't exist", function (t) {
  t.plan(1)
  jsdoc.explain({ files: 'sdfafafirifrj' })
    .then(function () {
      t.fail('should not reach here')
    })
    .catch(function (err) {
      t.strictEqual(err.name, 'JSDOC_ERROR')
    })
})

test('.explain: invalid doclet syntax', function (t) {
  t.plan(1)
  var input = path.resolve(__dirname, 'fixture', 'buggy', 'bad-doclet-syntax.js')
  jsdoc.explain({ files: input })
    .then(function () {
      t.fail('should not reach here')
    })
    .catch(function (err) {
      t.strictEqual(err.name, 'JSDOC_ERROR')
    })
})
