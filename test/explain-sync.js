'use strict'
var TestRunner = require('test-runner')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')
var path = require('path')
var a = require('assert')

var runner = new TestRunner()

/* only test on a node version with spawnSync */
if (require('child_process').spawnSync) {
  runner.test('.explainSync({ files })', function () {
    var f = new Fixture('class-all')
    var output = jsdoc.explainSync({ files: f.sourcePath })
    var expectedOutput = f.getExpectedOutput(output)

    a.ok(typeof output === 'object')
    a.deepEqual(output, expectedOutput)
  })

  runner.test('.explainSync({ source })', function () {
    var f = new Fixture('class-all')
    var output = jsdoc.explainSync({ source: f.getSource() })
    var expectedOutput = f.getExpectedOutput(output)

    a.ok(typeof output === 'object')
    a.deepEqual(output, expectedOutput)
  })

  runner.test('.explainSync({ source }), defaults', function () {
    var output = jsdoc.explainSync({ source: '/** example doclet */ \n var example = true' })
    a.strictEqual(output[0].description, 'example doclet')
  })

  runner.test('.explainSync: no valid files', function () {
    a.throws(
      function () {
        jsdoc.explainSync({ files: 'package.json' })
      },
      function (err) {
        return err.name === 'JSDOC_ERROR'
      }
    )
  })

  runner.test('.explainSync: missing files', function () {
    a.throws(
      function () {
        jsdoc.explainSync({ files: 'oyutigbl' })
      },
      function (err) {
        return err.name === 'JSDOC_ERROR'
      }
    )
  })

  runner.test('.explainSync: invalid doclet syntax', function () {
    a.throws(
      function () {
        var input = path.resolve(__dirname, 'fixture', 'buggy', 'bad-doclet-syntax.js')
        jsdoc.explainSync({ files: input })
      },
      function (err) {
        return err.name === 'JSDOC_ERROR'
      }
    )
  })
}
