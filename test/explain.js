import jsdoc from 'jsdoc-api'
import Fixture from './lib/fixture.js'
import { strict as a } from 'assert'
import path from 'path'

const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('.explain({ files })', async function () {
  const f = new Fixture('class-all')
  let output = await jsdoc.explain({ files: f.sourcePath })
  output = Fixture.normaliseNewLines(output)
  a.deepEqual(output, f.getExpectedOutput(output))
})

test.set('.explain({ source })', async function () {
  const f = new Fixture('class-all')
  let output = await jsdoc.explain({ source: f.getSource() })
  output = Fixture.normaliseNewLines(output)
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

test.set('.explain({ files }): files is empty', async function () {
  a.rejects(
    () => jsdoc.explain({ files: [] }),
    /Must set at least one of .files, .source or .configure/
  )
})

test.set('Spaces in jsdoc command path', async function () {
  process.env.JSDOC_PATH = 'test/fixture/folder with spaces/fake-jsdoc.js'
  const f = new Fixture('class-all')
  let output = await jsdoc.explain({ files: f.sourcePath })
  a.equal(output.length, 4)
  process.env.JSDOC_PATH = ''
})

export { test, only, skip }
