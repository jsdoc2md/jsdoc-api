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
      /* rmdirSync supports v12 but was removed in v25.. rmSync is supported in v15 onward. */
      if (Number(process.versions.node.split('.')[0]) >= 15) {
        fs.rmSync(folder, { recursive: true, force: true })
      } else {
        fs.rmdirSync(folder, { recursive: true })
      }
      fs.mkdirSync(folder)
    } catch (err) {
      if (err.code === 'ENOENT') {
        fs.mkdirSync(folder)
      } else {
        throw err
      }
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
    return JSON.parse(result)
  }
}

export default Fixture
