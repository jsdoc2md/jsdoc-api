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

    return this.checkCache()
      .then(cachedOutput => {
        if (cachedOutput) {
          return cachedOutput
        } else {
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
                this.cache.write(this.cacheKey, explainOutput)
                resolve(explainOutput)
              } catch (err) {
                reject(err)
              }
            })
          })
        }
      })
  }

  /**
   * Returns a cached recordset or null
   * @returns {Promise}
   * @fulfil {object[]}
   */
  checkCache () {
    const fs = require('then-fs')
    const promises = this.inputFileSet.files.map(file => fs.readFile(file))

    return Promise.all(promises)
      .then(contents => {
        this.cacheKey = contents
        return this.cache.read(contents)
      })
      .catch(() => null)
  }
}

module.exports = Explain
