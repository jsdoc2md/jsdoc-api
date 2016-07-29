'use strict'
const JsdocCommand = require('./jsdoc-command')

/**
 * @module explain
 */

/**
 * @extends module:jsdoc~JsdocCommand
 * @static
 */
class Explain extends JsdocCommand {

  getOutput (err) {
    if (err) return Promise.reject(err)

    if (this.options.cache) {
      return this.readCache().catch(this._runJsdoc.bind(this))
    } else {
      return this._runJsdoc()
    }
  }

  _runJsdoc () {
    return new Promise((resolve, reject) => {
      const collectAll = require('collect-all')
      const jsdocOutput = {
        stdout: '',
        stderr: '',
        collectInto (dest) {
          return collectAll(data => { this[dest] = data.toString() })
        }
      }

      const toSpawnArgs = require('object-to-spawn-args')
      const jsdocArgs = toSpawnArgs(this.jsdocOptions)
        .concat([ '-X' ])
        .concat(this.options.source ? this.tempFile.path : this.inputFileSet.files)
      jsdocArgs.unshift(this.jsdocPath)

      const spawn = require('child_process').spawn
      const handle = spawn('node', jsdocArgs)
      handle.stderr.pipe(jsdocOutput.collectInto('stderr'))
      handle.stdout.pipe(jsdocOutput.collectInto('stdout'))

      handle.on('close', code => {
        try {
          const explainOutput = this.verifyOutput(code, jsdocOutput)
          if (this.options.cache) {
            this.cache.write(this.cacheKey, explainOutput).then(() => resolve(explainOutput))
          } else {
            resolve(explainOutput)
          }

        } catch (err) {
          reject(err)
        }
      })
    })
  }

  /**
   * Returns a cached recordset
   * @returns {Promise}
   * @fulfil {object[]}
   */
  readCache () {
    if (this.cache) {
      const fs = require('then-fs')
      const promises = this.inputFileSet.files.map(file => fs.readFile(file, 'utf8'))
      return Promise.all(promises)
        .then(contents => {
          this.cacheKey = contents.concat(this.inputFileSet.files)
          return this.cache.read(this.cacheKey)
        })
    } else {
      return Promise.reject()
    }
  }
}

module.exports = Explain
