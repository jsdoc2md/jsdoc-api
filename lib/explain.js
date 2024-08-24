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
  getOutput (err) {
    if (err) return Promise.reject(err)
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
}

export default Explain
