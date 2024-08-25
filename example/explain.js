import jsdoc from 'jsdoc-api'
import util from 'node:util'
util.inspect.defaultOptions.depth = 6
util.inspect.defaultOptions.breakLength = process.stdout.columns
util.inspect.defaultOptions.maxArrayLength = Infinity

const data = await jsdoc.explain({ files: process.argv.slice(2), cache: true, pedantic: true })
console.log(data)
