var test = require('tape')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')
var spawnSync = require('child_process').spawnSync
var path = require('path')

/* only test on a node version with spawnSync */
if (spawnSync) {
  test('.explainSync({ files })', function (t) {
    var f = new Fixture('class-all')
    var output = jsdoc.explainSync({ files: f.sourcePath })
    // console.error(output)
    var expectedOutput = f.getExpectedOutput(output)

    t.ok(typeof output === 'object')
    t.deepEqual(output, expectedOutput)
    t.end()
  })

  test('.explainSync({ source })', function (t) {
    var f = new Fixture('class-all')
    var output = jsdoc.explainSync({ source: f.getSource() })
    var expectedOutput = f.getExpectedOutput(output)

    t.ok(typeof output === 'object')
    t.deepEqual(output, expectedOutput)
    t.end()
  })

  test('.explainSync: no valid files', function (t) {
    t.plan(1)
    try {
      jsdoc.explainSync({ files: 'package.json' })
    } catch (err) {
      t.strictEqual(err.name, 'JSDOC_ERROR')
    }
  })

  test('.explainSync: missing files', function (t) {
    t.plan(1)
    try {
      jsdoc.explainSync({ files: 'oyutigbl' })
    } catch (err) {
      t.strictEqual(err.name, 'JSDOC_ERROR')
    }
  })

  test('.explainSync: invalid doclet syntax', function (t) {
    t.plan(1)
    try {
      var input = path.resolve(__dirname, 'fixture', 'buggy', 'bad-doclet-syntax.js')
      jsdoc.explainSync({ files: input })
    } catch (err) {
      t.strictEqual(err.name, 'JSDOC_ERROR')
    }
  })
}
