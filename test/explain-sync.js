const Tom = require('test-runner').Tom
const jsdoc = require('../')
const Fixture = require('./lib/fixture')
const path = require('path')
const a = require('assert')

const tom = module.exports = new Tom('explain-sync')

tom.test('.explainSync({ files })', function () {
  const f = new Fixture('class-all')
  const output = jsdoc.explainSync({ files: f.sourcePath })
  const expectedOutput = f.getExpectedOutput(output)

  a.ok(typeof output === 'object')
  a.deepStrictEqual(output, expectedOutput)
})

tom.test('.explainSync({ source })', function () {
  const f = new Fixture('class-all')
  const output = jsdoc.explainSync({ source: f.getSource() })
  const expectedOutput = f.getExpectedOutput(output)

  a.ok(typeof output === 'object')
  a.deepStrictEqual(output, expectedOutput)
})

tom.test('.explainSync({ source }), defaults', function () {
  const output = jsdoc.explainSync({ source: '/** example doclet */ \n const example = true' })
  a.strictEqual(output[0].description, 'example doclet')
})

tom.test('.explainSync: no valid files', function () {
  a.throws(
    function () {
      jsdoc.explainSync({ files: 'package.json' })
    },
    function (err) {
      return err.name === 'JSDOC_ERROR'
    }
  )
})

tom.test('.explainSync: missing files', function () {
  a.throws(
    function () {
      jsdoc.explainSync({ files: 'oyutigbl' })
    },
    function (err) {
      return err.name === 'JSDOC_ERROR'
    }
  )
})

tom.test('.explainSync: invalid doclet syntax', function () {
  a.throws(
    function () {
      const input = path.resolve(__dirname, 'fixture', 'buggy', 'bad-doclet-syntax.js')
      jsdoc.explainSync({ files: input })
    },
    function (err) {
      return err.name === 'JSDOC_ERROR'
    }
  )
})
