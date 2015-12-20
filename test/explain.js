var test = require('tape')
var jsdoc = require('../')
var path = require('path')
var fs = require('fs')
var rimraf = require('rimraf')
var arrayify = require('array-back')

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
function getExpectedOutput (filepath) {
  return fs.readFileSync(
    path.resolve(__dirname, '..', 'node_modules', 'jsdoc2md-testbed', 'output', '1. jsdoc-api', filepath),
    'utf-8'
  )
}
function removeFileSpecificData () {
  arrayify(arguments).forEach(function (input) {
    input.forEach(function (i) {
      delete i.meta;
      delete i.files
    })
  })
}

test('.explainSync(files, options)', function (t) {
  t.end()
})

test('.explainSync.source(files, options)', function(t){
  var output = jsdoc.explainSync.source(getSource('global/class-all.js'))
  var expectedOutput = JSON.parse(getExpectedOutput('global/class-all.json'))
  removeFileSpecificData(output, expectedOutput)

  t.ok(typeof output === 'object')
  t.deepEqual(output, expectedOutput)
  t.end()
})

test('.explain(files, options)')
test('.explain.source(source, options)')

test('.createExplainStream(files, options)')
test('.createExplainStream.source(source, options)')
