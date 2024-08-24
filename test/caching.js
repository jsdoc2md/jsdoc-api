const Tom = require('test-runner').Tom
const jsdoc = require('../')
const Fixture = require('./lib/fixture')
const path = require('path')
const fs = require('fs')
const a = require('assert')

/* tests need to run sequentially as `jsdoc.cache` is shared between tests */
const tom = module.exports = new Tom('caching', { maxConcurrency: 1 })

tom.test('.explainSync({ files, cache: true })', async function () {
  const f = new Fixture('class-all')
  jsdoc.cache.dir = 'tmp/test/cache-sync'
  await jsdoc.cache.clear()
  const output = jsdoc.explainSync({ files: f.sourcePath, cache: true })
  const expectedOutput = f.getExpectedOutput(output)

  a.ok(typeof output === 'object')
  a.deepEqual(output, expectedOutput)
})

tom.test('.explain({ files, cache: true  })', async function () {
  const f = new Fixture('class-all')
  jsdoc.cache.dir = 'tmp/test/cache' + this.index
  await jsdoc.cache.clear()
  const output = await jsdoc.explain({ files: f.sourcePath, cache: true })
  const cachedFiles = fs.readdirSync(jsdoc.cache.dir)
    .map(file => path.resolve(jsdoc.cache.dir, file))
  a.strictEqual(cachedFiles.length, 1)
  a.deepEqual(output, f.getExpectedOutput(output))
  const cachedData = JSON.parse(fs.readFileSync(cachedFiles[0], 'utf8'))
  Fixture.removeFileSpecificData(cachedData)
  a.deepEqual(
    cachedData,
    f.getExpectedOutput(output)
  )
})

tom.test('.explain({ source, cache: true  }) - Ensure correct output (#147)', async function () {
  await jsdoc.cache.clear()
  jsdoc.cache.dir = 'tmp/test/cache' + this.index
  let one = jsdoc.explain({ source: '/**\n * Function one\n */\nfunction one () {}\n', cache: true })
  let two = jsdoc.explain({ source: '/**\n * Function two\n */\nfunction two () {}\n', cache: true })
  let three = jsdoc.explain({ source: '/**\n * Function three\n */\nfunction three () {}\n', cache: true })
  const output = await Promise.all([ one, two, three ])
  a.strictEqual(output[0][0].description, 'Function one')
  a.strictEqual(output[1][0].description, 'Function two')
  a.strictEqual(output[2][0].description, 'Function three')

  /* ensure it works correctly the second time */
  one = jsdoc.explain({ source: '/**\n * Function one\n */\nfunction one () {}\n', cache: true })
  two = jsdoc.explain({ source: '/**\n * Function two\n */\nfunction two () {}\n', cache: true })
  three = jsdoc.explain({ source: '/**\n * Function three\n */\nfunction three () {}\n', cache: true })
  const output2 = await Promise.all([ one, two, three ])
  a.strictEqual(output2[0][0].description, 'Function one')
  a.strictEqual(output2[1][0].description, 'Function two')
  a.strictEqual(output2[2][0].description, 'Function three')
})
