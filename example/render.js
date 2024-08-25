import jsdoc from 'jsdoc-api'

await jsdoc.render({ files: ['index.js'], destination: 'jsdoc-output' })
