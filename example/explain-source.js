import jsdoc from 'jsdoc-api'

const data = await jsdoc.explain({ source: '/** example doclet */ \n var example = true' })
console.log(data)
