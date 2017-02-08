'use strict'
var TestRunner = require('test-runner')
var jsdoc = require('../')
var Fixture = require('./lib/fixture')
var collectJson = require('collect-json')
var a = require('assert')

var runner = new TestRunner()

runner.test('.explain({ files, html: true })', function () {
  var f = new Fixture('html', '0-src.html')
  return jsdoc.explain({ files: f.sourcePath, html: true })
    .then(function (output) {
      a.deepEqual(output, f.getExpectedOutput(output))
    })
})
