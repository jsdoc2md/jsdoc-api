var test = require('tape')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')
var collectJson = require('collect-json')

test('.createExplainStream: no valid files', function (t) {
  t.plan(1)
  jsdoc.createExplainStream('package.json')
    .on('error', function (err) {
      t.strictEqual(err.name, 'INVALID_FILES')
    })
    .pipe(collectJson(function (output) {
      t.fail('should not reach here')
    }))
})

test('.createExplainStream.source(source, options)')
