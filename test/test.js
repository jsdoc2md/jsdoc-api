var test = require('tape')
var jsdoc = require('../')
var path = require('path')
var fs = require('fs')

function getFixture (filepath) {
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
  var result = jsdoc.explain(getFixture('global/class-all.js'))
  var fixtureOutput = JSON.parse(getOutput('global/class-all.json'))
  result.forEach(i => { delete i.meta; delete i.files })
  fixtureOutput.forEach(i => { delete i.meta; delete i.files })

  t.ok(typeof result === 'object')
  t.deepEqual(result, fixtureOutput)
  t.end()
})
