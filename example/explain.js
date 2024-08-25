import jsdoc from 'jsdoc-api'

const result = await jsdoc.explain({ files: process.argv[2], cache: true })
console.log(JSON.stringify(result, null, '  '))
