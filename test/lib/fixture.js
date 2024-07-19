const path = require('path')
const fs = require('fs')
const arrayify = require('array-back')

class Fixture {
  constructor (name, filePath) {
    this.folder = path.resolve(__dirname, '..', 'fixture', name)
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
}

module.exports = Fixture
