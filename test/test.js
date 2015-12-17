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

test('explain', function(t){
  var result = jsdoc.explain(getSource('global/class-all.js'))
  var fixtureOutput = JSON.parse(getOutput('global/class-all.json'))
  result.forEach(function (i) {
    delete i.meta;
    delete i.files
  })
  fixtureOutput.forEach(function (i) {
    delete i.meta;
    delete i.files
  })

  t.ok(typeof result === 'object')
  t.deepEqual(result, fixtureOutput)
  t.end()
})

test('render', function(t){
  jsdoc.render(getSource('global/class-all.js'), { destination: 'tmp' })
  t.doesNotThrow(function () {
    fs.statSync('./tmp/index.html')
  })
  t.end()
})
