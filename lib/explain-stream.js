'use strict'
const Duplex = require('stream').Duplex
const collectAll = require('collect-all')

class ExplainStream extends Duplex {
  constructor (explain, options) {
    super()
    this.explain = explain
    this.options = Object.assign({ files: [] }, options)
    // options = options || {}
    // this.files = arrayify(options.files)
    // delete options.files
    // this.options = options

    this.on('pipe', src => {
      if (!(this.inProgress || options.files || options.source)) {
        src.pipe(collectAll(source => {
          this.options.source = source
          this.start()
          this.inProgress = true
        }))
      }
    })
  }

  start () {
    this.explain(this.files, this.options)
      .then(output => {
        this.push(JSON.stringify(output, null, '  '))
        this.push(null)
        this.inProgress = false
      })
      .catch(err => this.emit('error', err))
    this.inProgress = true
  }

  _read () {
    if (!this.inProgress && this.files.length) {
      this.start()
    }
  }

  _write (chunk, encoding, done) {
    done()
  }
}

module.exports = ExplainStream
