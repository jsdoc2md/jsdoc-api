var test = require('tape')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')
var fs = require('fs')

test('.renderSync(files, options)', function(t){
  Fixture.createTmpFolder('tmp')
  var f = new Fixture('global/class-all')
  jsdoc.renderSync(f.sourcePath, { destination: 'tmp' })
  t.doesNotThrow(function () {
    fs.statSync('./tmp/index.html')
  })
  t.end()
})

test('.renderSync.source(source, options)', function(t){
  Fixture.createTmpFolder('tmp')
  var f = new Fixture('global/class-all')
  jsdoc.renderSync.source(f.getSource(), { destination: 'tmp' })
  t.doesNotThrow(function () {
    fs.statSync('./tmp/index.html')
  })
  t.end()
})
