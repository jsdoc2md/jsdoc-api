import fs from 'node:fs'
import os from 'os'
import crypto from 'crypto'
import path from 'path'

class TempFile {
  constructor (source) {
    this.path = path.join(TempFile.tempFileDir, crypto.randomBytes(6).toString('hex') + '.js')
    fs.writeFileSync(this.path, source)
  }

  delete () {
    try {
      fs.unlinkSync(this.path)
    } catch (err) {
      // already deleted
    }
  }

  static tempFileDir = path.join(os.homedir(), '.jsdoc-api/temp')
  static cacheDir = path.join(os.homedir(), '.jsdoc-api/cache')

  static createTmpDirs () {
    /* No longer using os.tmpdir(). See: https://github.com/jsdoc2md/jsdoc-api/issues/19 */
    fs.mkdirSync(TempFile.tempFileDir, { recursive: true })
    fs.mkdirSync(TempFile.cacheDir, { recursive: true })
  }
}

export default TempFile
