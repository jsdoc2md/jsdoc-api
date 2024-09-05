import jsdoc from 'jsdoc-api'

const data = await jsdoc.explain({ files: process.argv.slice(2), cache: true })
console.log(data)
