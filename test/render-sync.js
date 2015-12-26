var test = require('tape')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')
var fs = require('fs')
var spawnSync = require('child_process').spawnSync

/* only test on a node version with spawnSync */
if (spawnSync) {
  test('.renderSync({ files })', function (t) {
    Fixture.createTmpFolder('tmp')
    var f = new Fixture('global/class-all')
    jsdoc.renderSync({ files: f.sourcePath, destination: 'tmp' })
    t.doesNotThrow(function () {
      fs.statSync('./tmp/index.html')
    })
    t.end()
  })

  test('.renderSync.source(source, options)', function (t) {
    Fixture.createTmpFolder('tmp')
    var f = new Fixture('global/class-all')
    jsdoc.renderSync({ source: f.getSource(), destination: 'tmp' })
    t.doesNotThrow(function () {
      fs.statSync('./tmp/index.html')
    })
    t.end()
  })
}
