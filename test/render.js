var test = require('tape')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')
var fs = require('fs')

Fixture.createTmpFolder('tmp')

test('.renderSync.source(source, options)', function(t){
  var f = new Fixture('global/class-all')
  jsdoc.renderSync.source(f.getSource(), { destination: 'tmp' })
  t.doesNotThrow(function () {
    fs.statSync('./tmp/index.html')
  })
  t.end()
})
