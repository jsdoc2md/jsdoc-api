'use strict'
const TestRunner = require('test-runner')
const jsdoc = require('../')
const Fixture = require('./lib/fixture')
const path = require('path')
const fs = require('fs-then-native')
const a = require('assert')

const runner = new TestRunner()

runner.test('.explainSync({ files, cache: true })', function () {
  const f = new Fixture('class-all')
  jsdoc.cache.dir = 'tmp/cache-sync'
  jsdoc.cache.clear().catch(err => { /* ignore */ })
  const output = jsdoc.explainSync({ files: f.sourcePath, cache: true })
  const expectedOutput = f.getExpectedOutput(output)

  a.ok(typeof output === 'object')
  a.deepEqual(output, expectedOutput)
})

runner.test('.explain({ files, cache: true  })', function () {
  const f = new Fixture('class-all')
  jsdoc.cache.dir = 'tmp/cache'
  jsdoc.cache.clear().catch(err => { /* ignore */ })
  return jsdoc.explain({ files: f.sourcePath, cache: true })
    .then(function (output) {
      const cachedFiles = fs.readdirSync(jsdoc.cache.dir)
        .map(function (file) {
          return path.resolve(jsdoc.cache.dir, file)
        })
      a.strictEqual(cachedFiles.length, 1)
      a.deepEqual(output, f.getExpectedOutput(output))
      const cachedData = JSON.parse(fs.readFileSync(cachedFiles[0], 'utf8'))
      Fixture.removeFileSpecificData(cachedData)
      a.deepEqual(
        cachedData,
        f.getExpectedOutput(output)
      )
    })
    .catch(function (err) { console.error(err.stack) })
})
