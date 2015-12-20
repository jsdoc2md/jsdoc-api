var test = require('tape')
var jsdoc = require('../')
var path = require('path')
var fs = require('fs')
var rimraf = require('rimraf')

try {
  fs.statSync('tmp')
  rimraf.sync('tmp')
} catch (err) {
  fs.mkdirSync('tmp')
}

function getSource (filepath) {
  return fs.readFileSync(
    path.resolve(__dirname, '..', 'node_modules', 'jsdoc2md-testbed', 'src', filepath),
    'utf-8'
  )
}
function getOutput (filepath) {
  return fs.readFileSync(
    path.resolve(__dirname, '..', 'node_modules', 'jsdoc2md-testbed', 'output', '1. jsdoc-api', filepath),
    'utf-8'
  )
}

test('.renderSync.source(source, options)', function(t){
  jsdoc.renderSync.source(getSource('global/class-all.js'), { destination: 'tmp' })
  t.doesNotThrow(function () {
    fs.statSync('./tmp/index.html')
  })
  t.end()
})
