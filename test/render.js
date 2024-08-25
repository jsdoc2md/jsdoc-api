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

test.set('.render({ source[], destination })', async function () {
  Fixture.createTmpFolder('tmp/renderSource')
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
  await jsdoc.render({ source: sources, destination: 'tmp/renderSource/out' })
  a.doesNotThrow(function () {
    statSync('./tmp/renderSource/out/FooPrime.html')
    statSync('./tmp/renderSource/out/FooSecond.html')
  })
})

export { test, only, skip }
