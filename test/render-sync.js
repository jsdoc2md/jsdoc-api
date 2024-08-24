import * as jsdoc from 'jsdoc-api'
import Fixture from './lib/fixture.js'
import { statSync } from 'fs'
import { strict as a } from 'assert'

const [test, only, skip] = [new Map(), new Map(), new Map()]

test.set('.renderSync({ files })', function () {
  Fixture.createTmpFolder('tmp')
  Fixture.createTmpFolder('tmp/renderSync')
  const f = new Fixture('class-all')
  jsdoc.renderSync({ files: f.sourcePath, destination: 'tmp/renderSync/out' })
  a.doesNotThrow(function () {
    statSync('./tmp/renderSync/out/index.html')
  })
})

test.set('.renderSync({ source, destination })', function () {
  Fixture.createTmpFolder('tmp')
  Fixture.createTmpFolder('tmp/renderSync')
  const f = new Fixture('class-all')
  jsdoc.renderSync({ source: f.getSource(), destination: 'tmp/renderSync/out' })
  a.doesNotThrow(function () {
    statSync('./tmp/renderSync/out/index.html')
  })
})

export { test, only, skip }
