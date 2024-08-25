import jsdoc from 'jsdoc-api'
import Fixture from './lib/fixture.js'
import { statSync } from 'fs'
import { strict as a } from 'assert'

const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('.render({ files })', async function () {
  Fixture.createTmpFolder('tmp')
  Fixture.createTmpFolder('tmp/render')
  const f = new Fixture('class-all')
  await jsdoc.render({ files: f.sourcePath, destination: 'tmp/render/out' })
  a.doesNotThrow(function () {
    statSync('./tmp/render/out/index.html')
  })
})

test.set('.render({ source, destination })', async function () {
  Fixture.createTmpFolder('tmp')
  Fixture.createTmpFolder('tmp/render')
  const f = new Fixture('class-all')
  await jsdoc.render({ source: f.getSource(), destination: 'tmp/render/out' })
  a.doesNotThrow(function () {
    statSync('./tmp/render/out/index.html')
  })
})

export { test, only, skip }
