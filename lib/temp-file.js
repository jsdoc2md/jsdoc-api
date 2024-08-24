import fs from 'fs'
import os from 'os'
import crypto from 'crypto'
import path from 'path'

class TempFile {
  constructor (source) {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jsdoc-api-'))
    this.path = path.join(tempDir, crypto.randomBytes(6).toString('hex') + '.js')
    fs.writeFileSync(this.path, source)
  }

  delete () {
    try {
      fs.unlinkSync(this.path)
    } catch (err) {
      // already deleted
    }
  }
}

export default TempFile
