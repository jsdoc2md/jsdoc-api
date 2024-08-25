import JsdocCommand from './jsdoc-command.js'
import arrayify from 'array-back'
import toSpawnArgs from 'object-to-spawn-args'
import cp from 'child_process'
import util from 'node:util'
const exec = util.promisify(cp.exec)

class Explain extends JsdocCommand {
  async getOutput () {
    if (this.options.cache && !this.options.source) {
      return this.readCache().catch(this._runJsdoc.bind(this))
    } else {
      return this._runJsdoc()
    }
  }

  async _runJsdoc () {
    // console.log('SKDJKLAHS', this.options, this.tempFileSet?.files, this.inputFileSet.files)
    const cmd = this.options.source.length
      ? `node ${this.jsdocPath} ${toSpawnArgs(this.jsdocOptions).join(' ')} -X ${this.tempFileSet.files.join(' ')}`
      : `node ${this.jsdocPath} ${toSpawnArgs(this.jsdocOptions).join(' ')} -X ${this.inputFileSet.files.join(' ')}`

    let jsdocOutput = { stdout: '', stderr: '' }
    try {
      jsdocOutput = await exec(cmd)
      const explainOutput = JSON.parse(jsdocOutput.stdout)
      if (this.options.cache) {
        await this.cache.write(this.cacheKey, explainOutput)
      }
      return explainOutput
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
