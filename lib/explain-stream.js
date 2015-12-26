'use strict'
const Duplex = require('stream').Duplex
const collectAll = require('collect-all')
const arrayify = require('array-back')

class ExplainStream extends Duplex {
  constructor (explain, options) {
    super()
    this.explain = explain
    this.options = options || {}
    this.options.files = arrayify(this.options.files)

    this.on('pipe', src => {
      if (!(this.inProgress || this.options.files.length || this.options.source)) {
        src.pipe(collectAll(source => {
          this.options.source = source
          this.start()
          this.inProgress = true
        }))
      }
    })
  }

  start () {
    this.explain(this.options)
      .then(output => {
        this.push(JSON.stringify(output, null, '  '))
        this.push(null)
        this.inProgress = false
      })
      .catch(err => this.emit('error', err))
    this.inProgress = true
  }

  _read () {
    if (!this.inProgress && (this.options.files.length || this.options.source)) {
      this.start()
    }
  }

  _write (chunk, encoding, done) {
    done()
  }
}

module.exports = ExplainStream
