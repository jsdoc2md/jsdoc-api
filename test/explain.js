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

function Fixture (name) {
  this.folder = path.resolve(__dirname, '..', 'node_modules', 'jsdoc2md-testbed', name)
  this.sourcePath = path.resolve(this.folder, '0-src.js')

  this.getSource = function () {
    return fs.readFileSync(this.sourcePath, 'utf-8')
  }

  this.getExpectedOutput = function () {
    return fs.readFileSync(path.resolve(this.folder, '1-jsdoc.json'), 'utf-8')
  }

}

function removeFileSpecificData () {
  arrayify(arguments).forEach(function (input) {
    if (input) {
      input.forEach(function (i) {
        delete i.meta;
        delete i.files
      })
    }
  })
}

test('.explainSync(files, options)', function (t) {
  var f = new Fixture('global/class-all')
  var output = jsdoc.explainSync(f.sourcePath)
  var expectedOutput = JSON.parse(f.getExpectedOutput())
  removeFileSpecificData(output, expectedOutput)

  t.ok(typeof output === 'object')
  t.deepEqual(output, expectedOutput)
  t.end()
})

test('.explainSync.source(files, options)', function(t){
  var f = new Fixture('global/class-all')
  var output = jsdoc.explainSync.source(f.getSource())
  var expectedOutput = JSON.parse(f.getExpectedOutput())
  removeFileSpecificData(output, expectedOutput)

  t.ok(typeof output === 'object')
  t.deepEqual(output, expectedOutput)
  t.end()
})

test('.explain(files, options)')
test('.explain.source(source, options)')

test('.createExplainStream(files, options)')
test('.createExplainStream.source(source, options)')
