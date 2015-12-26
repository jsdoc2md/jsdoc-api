var test = require('tape')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')
var spawnSync = require('child_process')

/* only test on a node version with spawnSync */
if (spawnSync) {
  test('.explainSync(files, options)', function (t) {
    var f = new Fixture('global/class-all')
    var output = jsdoc.explainSync(f.sourcePath)
    var expectedOutput = f.getExpectedOutput()
    Fixture.removeFileSpecificData(output, expectedOutput)

    t.ok(typeof output === 'object')
    t.deepEqual(output, expectedOutput)
    t.end()
  })

  test('.explainSync.source(files, options)', function (t) {
    var f = new Fixture('global/class-all')
    var output = jsdoc.explainSync.source(f.getSource())
    var expectedOutput = f.getExpectedOutput()
    Fixture.removeFileSpecificData(output, expectedOutput)

    t.ok(typeof output === 'object')
    t.deepEqual(output, expectedOutput)
    t.end()
  })
}
