import JsdocCommand from './jsdoc-command.js'
import streamReadAll from 'stream-read-all'
import toSpawnArgs from 'object-to-spawn-args'
import { spawn } from 'child_process'

/**
 * @module explain
 */

/**
 * @extends module:jsdoc~JsdocCommand
 * @static
 */
class Explain extends JsdocCommand {
  async getOutput () {
    if (this.options.cache && !this.options.source) {
      return this.readCache().catch(this._runJsdoc.bind(this))
    } else {
      return this._runJsdoc()
    }
  }

  async _runJsdoc () {
    return new Promise(async (resolve, reject) => {
      const jsdocOutput = {
        stdout: '',
        stderr: ''
      }

      const jsdocArgs = toSpawnArgs(this.jsdocOptions)
        .concat(['-X'])
        .concat(this.options.source ? this.tempFile.path : this.inputFileSet.files)
      jsdocArgs.unshift(this.jsdocPath)

      /* TODO: replace with exec if you're only collecting the output */
      const handle = spawn('node', jsdocArgs)
      jsdocOutput.stdout = (await streamReadAll(handle.stdout)).toString()
      jsdocOutput.stderr = (await streamReadAll(handle.stderr)).toString()

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

  verifyOutput (code, output) {
    let parseFailed = false
    let parsedOutput
    try {
      parsedOutput = JSON.parse(output.stdout)
    } catch (err) {
      parseFailed = true
    }

    if (code > 0 || parseFailed) {
      const firstLineOfStdout = output.stdout.split(/\r?\n/)[0]
      const err = new Error(output.stderr.trim() || firstLineOfStdout || 'Jsdoc failed.')
      err.name = 'JSDOC_ERROR'
      throw err
    } else {
      return parsedOutput
    }
  }

  /**
   * Returns a cached recordset
   * @returns {Promise}
   * @fulfil {object[]}
   */
  async readCache () {
    if (this.cache) {
      const promises = this.inputFileSet.files.map(file => fs.readFile(file, 'utf8'))
      const contents = await Promise.all(promises)
      this.cacheKey = contents.concat(this.inputFileSet.files)
      return this.cache.read(this.cacheKey)
    } else {
      return Promise.reject()
    }
  }
}

export default Explain
