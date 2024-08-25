import jsdoc from 'jsdoc-api'

await jsdoc.render({ files: ['.'], destination: 'jsdoc-output' })
