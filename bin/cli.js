#!/usr/bin/env node
'use strict'
const commandLineArgs = require('command-line-args')
const jsdoc = require('../')

const cli = commandLineArgs([
  { name: 'src', type: String, multiple: true },
  { name: 'explain', type: Boolean }
])

const options = cli.parse()

console.log(jsdoc(options))
