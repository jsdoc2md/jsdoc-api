'use strict'
const ExplainStream = require('./explain-stream')
const jsdoc = require('./jsdoc')

/**
 * A programmatic interface for [jsdoc3](https://github.com/jsdoc3/jsdoc). It provides sync, async (Promise) and streaming interfaces for the two main jsdoc operations ('explain' and 'render documentation'). You can input source code via a string, a set of file names or a stream.
 *
 * @module jsdoc-api
 * @typicalname jsdoc
 * @example
 * > const jsdoc = require('jsdoc-api')
 *
 * > jsdoc.explainSync({ source: '/** example doclet *∕ \n var example = true' })
 *
 * [ { comment: '/** example doclet *∕',
 *     meta:
 *      { range: [ 28, 42 ],
 *        filename: 'nkrf18zlymohia4i29a0zkyt84obt9.js',
 *        lineno: 2,
 *        path: '/var/folders/74/tqh7thm11tq72d7sjty9qvdh0000gn/T',
 *        code:
 *         { id: 'astnode100000002',
 *           name: 'example',
 *           type: 'Literal',
 *           value: true } },
 *     description: 'example doclet',
 *     name: 'example',
 *     longname: 'example',
 *     kind: 'member',
 *     scope: 'global' },
 *   { kind: 'package',
 *     longname: 'package:undefined',
 *     files: [ '/var/folders/74/tqh7thm11tq72d7sjty9qvdh0000gn/T/nkrf18zlymohia4i29a0zkyt84obt9.js' ] } ]
 */
exports.explainSync = explainSync
exports.explain = explain
exports.createExplainStream = createExplainStream
exports.renderSync = renderSync

/**
 * Returns jsdoc explain output.
 *
 * @param [options] {module:jsdoc-api~JsdocOptions}
 * @returns {object[]}
 * @static
 * @prerequisite Requires node v0.12 or above
 */
function explainSync (options) {
  const jsdocExplainSync = new jsdoc.ExplainSync(options)
  return jsdocExplainSync.execute()
}

/**
 * Returns a promise for the jsdoc explain output.
 *
 * @param [options] {module:jsdoc-api~JsdocOptions}
 * @fulfil {object[]} - jsdoc explain output
 * @returns {Promise}
 * @static
 */
function explain (options) {
  const jsdocExplain = new jsdoc.Explain(options)
  return jsdocExplain.execute()
}

/**
 * Returns a duplex stream, into which you can pipe source code and receive explain output at the other end.
 *
 * @param [options] {module:jsdoc-api~JsdocOptions}
 * @returns {Duplex}
 * @static
 * @example
 * fs.createReadStream('source-code.js')
 *   .pipe(jsdoc.createExplainStream())
 *   .pipe(process.stdout)
 */
function createExplainStream (options) {
  return new ExplainStream(explain, options)
}

/**
 * Render jsdoc documentation.
 *
 * @param [options] {module:jsdoc-api~JsdocOptions}
 * @prerequisite Requires node v0.12 or above
 * @static
 */
function renderSync (options) {
  const render = new jsdoc.RenderSync(options)
  return render.execute()
}

/**
 * The jsdoc options, common for all operations.
 * @typicalname options
 */
class JsdocOptions {
  constructor (options) {
    /**
     * One or more filenames to process. Either this or `source` must be supplied.
     * @type {string|string[]}
     */
    this.files = []

    /**
     * A string containing source code to process. Either this or `source` must be supplied.
     * @type {string}
     */
    this.source = ''

    /**
     * Only display symbols with the given access: "public", "protected", "private" or "undefined", or "all" for all access levels. Default: all except "private".
     * @type {string}
     */
    this.access = ''

    /**
     * The path to the configuration file. Default: path/to/jsdoc/conf.json.
     * @type {string}
     */
    this.configure = ''

    /**
     * The path to the output folder. Use "console" to dump data to the console. Default: ./out/.
     * @type {string}
     */
    this.destination = ''

    /**
     * Assume this encoding when reading all source files. Default: utf8.
     * @type {string}
     */
    this.encoding = ''

    /**
     * Display symbols marked with the @private tag. Equivalent to "--access all". Default: false.
     * @type {boolean}
     */
    this.private = false

    /**
     * The path to the project's package file. Default: path/to/sourcefiles/package.json
     * @type {string}
     */
    this.package = ''

    /**
     * Treat errors as fatal errors, and treat warnings as errors. Default: false.
     * @type {boolean}
     */
    this.pedantic = false

    /**
     * A query string to parse and store in jsdoc.env.opts.query. Example: foo=bar&baz=true.
     * @type {string}
     */
    this.query = ''

    /**
     * Recurse into subdirectories when scanning for source files and tutorials.
     * @type {boolean}
     */
    this.recurse = false

    /**
     * The path to the project's README file. Default: path/to/sourcefiles/README.md.
     * @type {string}
     */
    this.readme = ''

    /**
     * The path to the template to use. Default: path/to/jsdoc/templates/default.
     * @type {string}
     */
    this.template = ''

    /**
     * Directory in which JSDoc should search for tutorials.
     * @type {string}
     */
    this.tutorials = ''
  }
}
