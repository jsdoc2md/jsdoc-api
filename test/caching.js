import jsdoc from 'jsdoc-api'
import Fixture from './lib/fixture.js'
import { readdirSync, readFileSync } from 'fs'
import { strict as a } from 'assert'
import path from 'path'

/* tests need to run with a maxConcurrency of 1 as `jsdoc.cache` is shared between tests */
const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('.explain({ files, cache: true  })', async function () {
  const f = new Fixture('class-all')
  jsdoc.cache.dir = 'tmp/test/cache1'
  await jsdoc.cache.clear()
  const output = await jsdoc.explain({ files: f.sourcePath, cache: true })
  const cachedFiles = readdirSync(jsdoc.cache.dir)
    .map(file => path.resolve(jsdoc.cache.dir, file))
  a.equal(cachedFiles.length, 1)
  a.deepEqual(output, f.getExpectedOutput(output))
  const cachedData = JSON.parse(readFileSync(cachedFiles[0], 'utf8'))
  Fixture.removeFileSpecificData(cachedData)
  a.deepEqual(
    cachedData,
    f.getExpectedOutput(output)
  )
})

test.set('.explain({ source, cache: true  }) - Ensure correct output (#147)', async function () {
  await jsdoc.cache.clear()
  jsdoc.cache.dir = 'tmp/test/cache2'
  let one = jsdoc.explain({ source: '/**\n * Function one\n */\nfunction one () {}\n', cache: true })
  let two = jsdoc.explain({ source: '/**\n * Function two\n */\nfunction two () {}\n', cache: true })
  let three = jsdoc.explain({ source: '/**\n * Function three\n */\nfunction three () {}\n', cache: true })
  const output = await Promise.all([one, two, three])
  a.equal(output[0][0].description, 'Function one')
  a.equal(output[1][0].description, 'Function two')
  a.equal(output[2][0].description, 'Function three')

  /* ensure it works correctly the second time */
  one = jsdoc.explain({ source: '/**\n * Function one\n */\nfunction one () {}\n', cache: true })
  two = jsdoc.explain({ source: '/**\n * Function two\n */\nfunction two () {}\n', cache: true })
  three = jsdoc.explain({ source: '/**\n * Function three\n */\nfunction three () {}\n', cache: true })
  const output2 = await Promise.all([one, two, three])
  a.equal(output2[0][0].description, 'Function one')
  a.equal(output2[1][0].description, 'Function two')
  a.equal(output2[2][0].description, 'Function three')
})

export { test, only, skip }
