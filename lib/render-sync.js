import JsdocCommand from './jsdoc-command.js'
import toSpawnArgs from 'object-to-spawn-args'
import { spawnSync } from 'child_process'

/**
 * @static
 */
class RenderSync extends JsdocCommand {
  getOutput (err) {
    if (err) throw err
    const jsdocArgs = toSpawnArgs(this.jsdocOptions)
      .concat(this.options.source ? this.tempFile.path : this.options.files)

    jsdocArgs.unshift(this.jsdocPath)
    spawnSync('node', jsdocArgs)
  }
}

export default RenderSync
