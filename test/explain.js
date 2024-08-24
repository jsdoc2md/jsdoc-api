import * as jsdoc from 'jsdoc-api'
import Fixture from './lib/fixture.js'
import { statSync } from 'fs'
import { strict as a } from 'assert'
import path from 'path'

const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('.explain({ files })', async function () {
  const f = new Fixture('class-all')
  const output = await jsdoc.explain({ files: f.sourcePath })
  a.deepEqual(output, f.getExpectedOutput(output))
})

test.set('.explain({ source })', async function () {
  const f = new Fixture('class-all')
  const output = await jsdoc.explain({ source: f.getSource() })
  a.deepEqual(output, f.getExpectedOutput(output))
})

test.set(".explain: file doesn't exist", async function () {
  try {
    await jsdoc.explain({ files: 'sdfafafirifrj' })
    a.fail('should not reach here')
  } catch (err) {
    a.equal(err.name, 'JSDOC_ERROR')
  }
})

test.set('.explain: invalid doclet syntax', async function () {
  const input = path.resolve('test', 'fixture', 'buggy', 'bad-doclet-syntax.js')
  try {
    await jsdoc.explain({ files: input })
    a.fail('should not reach here')
  } catch (err) {
    a.equal(err.name, 'JSDOC_ERROR')
  }
})

test.set('.explain({ files }): generate a warning', async function () {
  return jsdoc.explain({ files: 'test/fixture/buggy/ignore-with-value.js' })
})

export { test, only, skip }
