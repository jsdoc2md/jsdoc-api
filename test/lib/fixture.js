import path from 'path'
import fs from 'fs'
import arrayify from 'array-back'

class Fixture {
  constructor (name, filePath) {
    this.folder = path.resolve('test', 'fixture', name)
    this.sourcePath = path.resolve(this.folder, filePath || '0-src.js')

    this.getSource = function () {
      return fs.readFileSync(this.sourcePath, 'utf-8')
    }

    this.getExpectedOutput = function (output) {
      const expectedOutput = JSON.parse(fs.readFileSync(path.resolve(this.folder, '1-jsdoc.json'), 'utf-8'))
      Fixture.removeFileSpecificData(expectedOutput)
      if (output) Fixture.removeFileSpecificData(output)
      return expectedOutput
    }

    this.createReadStream = function () {
      return fs.createReadStream(this.sourcePath)
    }
  }

  static createTmpFolder (folder) {
    try {
      fs.statSync(folder)
      /* rmdirSync is node v12 friendly */
      fs.rmdirSync(folder, { recursive: true })
      fs.mkdirSync(folder)
    } catch (err) {
      fs.mkdirSync(folder)
    }
  }

  static removeFileSpecificData () {
    arrayify(arguments).forEach(function (input) {
      if (input) {
        input.forEach(function (i) {
          delete i.meta
          delete i.files
        })
      }
    })
  }

  static normaliseNewLines (doclets) {
    const input = JSON.stringify(doclets, null, '  ')
    /* Normalise all newlines to posix style to avoid differences while testing on Windows */
    let result = input.replace(/\\r?\\n/gm, '\\n')
    /* Additional check for naked \r characters created by jsdoc */
    /* See: https://github.com/jsdoc2md/dmd/issues/102 */
    result = result.replace(/\\r(?!\\n)/g, '\\n')
    console.log(result)
    return JSON.parse(result)
  }
}

export default Fixture

// const a = [
//   {
//     comment: '/**\r\n' +
//       'the constructor description\r\n' +
//       '@class\r\n' +
//       '@classdesc a class with all of the things\r\n' +
//       '@param {object} - an input\r\n' +
//       '@param [options] {object} - optional shit\r\n' +
//       '@author 75lb <75pound@gmail.com>\r\n' +
//       '@deprecated\r\n' +
//       '@since v0.10.28\r\n' +
//       '@extends {Number}\r\n' +
//       '@example\r\n' +
//       '```js\r\n' +
//       'var yeah = new Everything(true)\r\n' +
//       '```\r\n' +
//       '*/',
//     meta: {
//       filename: '0-src.js',
//       lineno: 16,
//       columnno: 0,
//       path: 'D:\\a\\jsdoc-api\\jsdoc-api\\test\\fixture\\class-all',
//     },
//     description: 'the constructor description',
//     kind: 'class',
//     classdesc: 'a class with all of the things',
//     author: [ '75lb <75pound@gmail.com>' ],
//     deprecated: true,
//     since: 'v0.10.28',
//     augments: [ 'Number' ],
//     examples: [ '```js\r\nvar yeah = new Everything(true)\r\n```' ],
//     name: 'All',
//     longname: 'All',
//     scope: 'global'
//   },
//   {
//     comment: '/**\r\n' +
//       '  the ingredients on top\r\n' +
//       '  @default\r\n' +
//       '  @type {string}\r\n' +
//       '  @since v1.0.0\r\n' +
//       '  */',
//     meta: {
//       filename: '0-src.js',
//       lineno: 44,
//       columnno: 0,
//       path: 'D:\\a\\jsdoc-api\\jsdoc-api\\test\\fixture\\class-all',
//     },
//     description: 'This function has all tags set',
//     deprecated: true,
//     author: [ 'Lloyd <75pound@gmail.com>' ],
//     since: 'v0.10.28',
//     examples: [ '```js\r\nall.allTogether(true)\r\n```' ],
//     name: 'allThings',
//     longname: 'All#allThings',
//     kind: 'function',
//     memberof: 'All',
//     scope: 'instance'
//   },
//   {
//     comment: '/**\r\n  a rarseclart inner\r\n  */',
//     meta: {
//       filename: '0-src.js',
//       lineno: 48,
//       columnno: 6,
//       path: 'D:\\a\\jsdoc-api\\jsdoc-api\\test\\fixture\\class-all',
//     },
//     description: 'a rarseclart inner',
//     name: 'some',
//     longname: 'All#allThings~some',
//     kind: 'member',
//     memberof: 'All#allThings',
//     scope: 'inner',
//     params: []
//   },
//   {
//     kind: 'package',
//     longname: 'package:undefined',
//     files: [
//       'D:\\a\\jsdoc-api\\jsdoc-api\\test\\fixture\\class-all\\0-src.js'
//     ]
//   }
// ]

// const result = Fixture.normaliseNewLines(a)
// // console.log(result)
