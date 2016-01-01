var test = require('tape')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')
var spawnSync = require('child_process').spawnSync
var path = require('path')

/* only test on a node version with spawnSync */
if (spawnSync) {
  test('.explainSync({ files })', function (t) {
    var f = new Fixture('global/class-all')
    var output = jsdoc.explainSync({ files: f.sourcePath })
    var expectedOutput = f.getExpectedOutput(output)

    t.ok(typeof output === 'object')
    t.deepEqual(output, expectedOutput)
    t.end()
  })

  test('.explainSync({ source })', function (t) {
    var f = new Fixture('global/class-all')
    var output = jsdoc.explainSync({ source: f.getSource() })
    var expectedOutput = f.getExpectedOutput(output)

    t.ok(typeof output === 'object')
    t.deepEqual(output, expectedOutput)
    t.end()
  })

  test('.explainSync: no valid files', function (t) {
    t.plan(1)
    var output
    try {
      output = jsdoc.explainSync({ files: 'package.json' })
    } catch (err) {
      t.strictEqual(err.name, 'JSDOC_ERROR')
    }
  })

  test('.explainSync: missing files', function (t) {
    t.plan(1)
    var output
    try {
      output = jsdoc.explainSync({ files: 'oyutigbl' })
    } catch (err) {
      t.strictEqual(err.name, 'JSDOC_ERROR')
    }
  })

  test('.explainSync: invalid doclet syntax', function (t) {
    t.plan(1)
    var output
    try {
      var input = path.resolve(__dirname, '..', 'node_modules', 'jsdoc2md-testbed', 'build', 'input/buggy/bad-syntax.js')
      output = jsdoc.explainSync({ files: input })
    } catch (err) {
      t.strictEqual(err.name, 'JSDOC_ERROR')
    }
  })
}
