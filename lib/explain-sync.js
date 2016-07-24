'use strict'
const JsdocCommand = require('./jsdoc-command')

/**
 * @static
 */
class ExplainSync extends JsdocCommand {
  getOutput (err) {
    if (err) throw err

    const toSpawnArgs = require('object-to-spawn-args')
    const jsdocArgs = toSpawnArgs(this.jsdocOptions)
      .concat([ '-X' ])
      .concat(this.options.source ? this.tempFile.path : this.inputFileSet.files)

    jsdocArgs.unshift(this.jsdocPath)

    const spawnSync = require('child_process').spawnSync
    const result = spawnSync('node', jsdocArgs, { encoding: 'utf-8' })
    const explainOutput = this.verifyOutput(result.status, result)
    // fs.writeFileSync(this.cachePath, JSON.stringify(explainOutput))
    return explainOutput
  }
}

module.exports = ExplainSync
