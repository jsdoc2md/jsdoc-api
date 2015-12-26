var test = require('tape')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')
var spawnSync = require('child_process').spawnSync

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
}
