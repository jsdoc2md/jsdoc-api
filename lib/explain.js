import JsdocCommand from './jsdoc-command.js'
import toSpawnArgs from 'object-to-spawn-args'
import cp from 'child_process'
import util from 'node:util'
import { promises as fs } from 'node:fs'
const exec = util.promisify(cp.exec)

class Explain extends JsdocCommand {
  async getOutput () {
    if (this.options.cache && !this.options.source.length) {
      try {
        return await this.readCache()
      } catch (err) {
        if (err.code === 'ENOENT') {
          return this._runJsdoc()
        } else {
          throw err
        }
      }
    } else {
      return this._runJsdoc()
    }
  }

  async _runJsdoc () {
    const jsdocArgs = [
      this.jsdocPath,
      ...toSpawnArgs(this.jsdocOptions),
      '-X',
      ...(this.options.source.length ? this.tempFileSet.files : this.inputFileSet.files)
    ]
    let jsdocOutput = { stdout: '', stderr: '' }

    const code = await new Promise((resolve, reject) => {
      const handle = cp.spawn('node', jsdocArgs)
      handle.stdout.setEncoding('utf8')
      handle.stderr.setEncoding('utf8')
      handle.stdout.on('data', chunk => {
        jsdocOutput.stdout += chunk
      })
      handle.stderr.on('data', chunk => {
        jsdocOutput.stderr += chunk
      })
      handle.on('exit', (code) => {
        resolve(code)
      })
      handle.on('error', reject)
    })
    try {
      if (code > 0) {
        throw new Error('jsdoc exited with non-zero code: ' + code)
      } else {
        const explainOutput = JSON.parse(jsdocOutput.stdout)
        if (this.options.cache) {
          await this.cache.write(this.cacheKey, explainOutput)
        }
        return explainOutput
      }
    } catch (err) {
      const firstLineOfStdout = jsdocOutput.stdout.split(/\r?\n/)[0]
      const jsdocErr = new Error(jsdocOutput.stderr.trim() || firstLineOfStdout || 'Jsdoc failed.')
      jsdocErr.name = 'JSDOC_ERROR'
      jsdocErr.cause = err
      throw jsdocErr
    }
  }

  async readCache () {
    if (this.cache) {
      /* Create the cache key then check the cache for a match, returning pre-generated output if so.
      The current cache key is a union of the input file names plus their content - this could be expensive when processing a lot of files.
      */
      const promises = this.inputFileSet.files.map(file => {
        return fs.readFile(file, 'utf8')
      })
      const contents = await Promise.all(promises)
      this.cacheKey = contents.concat(this.inputFileSet.files)
      return this.cache.read(this.cacheKey)
    } else {
      return Promise.reject()
    }
  }
}

export default Explain
