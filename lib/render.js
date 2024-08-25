import JsdocCommand from './jsdoc-command.js'
import toSpawnArgs from 'object-to-spawn-args'
import { spawn } from 'child_process'

class Render extends JsdocCommand {
  async getOutput () {
    return new Promise((resolve, reject) => {
      const jsdocArgs = toSpawnArgs(this.jsdocOptions)
        .concat(this.options.source.length ? this.tempFiles.map(t => t.path) : this.options.files)

      jsdocArgs.unshift(this.jsdocPath)
      const handle = spawn('node', jsdocArgs, { stdio: 'inherit' })
      handle.on('close', resolve)
    })
  }
}

export default Render
