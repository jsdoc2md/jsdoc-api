import jsdoc from 'jsdoc-api'

const data = await jsdoc.explain({ cache: true, configure: './example/using-config.json' })
console.log(data)

/*
The `using-config.json` file looks like this:

{
  "source": {
    "include": [ "example/using-config-input.js" ]
  },
  "opts": {
    "destination": "./config-out/"
  }
}
 */
