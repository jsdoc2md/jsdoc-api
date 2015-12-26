var test = require('tape')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')

process.on('unhandledRejection', function (err) {
  console.error(err.stack);
})

test('.explain({ files })', function (t) {
  t.plan(1)
  var f = new Fixture('global/class-all')
  jsdoc.explain({ files: f.sourcePath })
    .then(function (output) {
      t.deepEqual(output, f.getExpectedOutput(output))
    })
})

test('.explain({ source })', function (t) {
  t.plan(1)
  var f = new Fixture('global/class-all')
  jsdoc.explain({ source: f.getSource() })
    .then(function (output) {
      t.deepEqual(output, f.getExpectedOutput(output))
    })
})

test("file doesn't exist", function (t) {
  t.plan(1)
  jsdoc.explain({ files: 'sdfafafirifrj' })
    .then(function () {
      t.fail('should not reach here')
    })
    .catch(function (err) {
      t.strictEqual(err.name, 'INVALID_FILES')
    })
})
