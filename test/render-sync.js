const Tom = require('test-runner').Tom
const jsdoc = require('../')
const Fixture = require('./lib/fixture')
const fs = require('fs')
const a = require('assert')

const tom = module.exports = new Tom('render-sync')

tom.test('.renderSync({ files })', function () {
  Fixture.createTmpFolder('tmp')
  Fixture.createTmpFolder('tmp/renderSync')
  const f = new Fixture('class-all')
  jsdoc.renderSync({ files: f.sourcePath, destination: 'tmp/renderSync/out' })
  a.doesNotThrow(function () {
    fs.statSync('./tmp/renderSync/out/index.html')
  })
})

tom.test('.renderSync({ source, destination })', function () {
  Fixture.createTmpFolder('tmp')
  Fixture.createTmpFolder('tmp/renderSync')
  const f = new Fixture('class-all')
  jsdoc.renderSync({ source: f.getSource(), destination: 'tmp/renderSync/out' })
  a.doesNotThrow(function () {
    fs.statSync('./tmp/renderSync/out/index.html')
  })
})
