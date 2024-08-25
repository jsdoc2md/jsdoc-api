import jsdoc from 'jsdoc-api'
import util from 'node:util'
util.inspect.defaultOptions.depth = 6
util.inspect.defaultOptions.breakLength = process.stdout.columns
util.inspect.defaultOptions.maxArrayLength = Infinity

const data = await jsdoc.explain({ source: '/** example doclet */ \n var example = true' })
console.log(data)
