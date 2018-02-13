'use strict'
const TestRunner = require('test-runner')
const jsdoc = require('../')
const Fixture = require('./lib/fixture')
const fs = require('fs')
const spawnSync = require('child_process').spawnSync
const a = require('assert')

const runner = new TestRunner()

runner.test('.renderSync({ files })', function () {
  Fixture.createTmpFolder('tmp/renderSync')
  const f = new Fixture('class-all')
  jsdoc.renderSync({ files: f.sourcePath, destination: 'tmp/renderSync/out' })
  a.doesNotThrow(function () {
    fs.statSync('./tmp/renderSync/out/index.html')
  })
})

runner.test('.renderSync({ source, destination })', function () {
  Fixture.createTmpFolder('tmp/renderSync')
  const f = new Fixture('class-all')
  jsdoc.renderSync({ source: f.getSource(), destination: 'tmp/renderSync/out' })
  a.doesNotThrow(function () {
    fs.statSync('./tmp/renderSync/out/index.html')
  })
})

runner.test('.renderSync({ source[], destination })', function () {
  Fixture.createTmpFolder('tmp')
  const sources = [
    `import Foo from "foo"
     /**
      * FooPrime is some child class
      * @class
      * @param {Object} - an input
      * @extends Foo
      */
     function FooPrime() {}
     export default FooPrime
  `,
    `import Foo from "foo"
    /**
     * FooSecond is some other child class
     * @class
     * @param {Object} - an input
     * @extends Foo
     */
    function FooSecond() {}
    export default FooSecond
  `]
  jsdoc.renderSync({ source: sources, destination: 'tmp/renderSync/out' })
  a.doesNotThrow(function () {
    fs.statSync('./tmp/renderSync/out/FooPrime.html')
    fs.statSync('./tmp/renderSync/out/FooSecond.html')
  })
})
