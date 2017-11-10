'use strict'

/**
 * @module jsdoc-api
 * @typicalname jsdoc
 */
exports.explainSync = explainSync
exports.explain = explain
exports.renderSync = renderSync

const path = require('path')
const Cache = require('cache-point')
/**
 * The [cache-point](https://github.com/75lb/cache-point) instance used when `cache: true` is specified on `.explain()` or `.explainSync()`.
 * @type {external:cache-point}
 */
exports.cache = new Cache({ dir: path.join(require('os').tmpdir(), 'jsdoc-api') })

/**
 * Returns jsdoc explain output.
 *
 * @param [options] {module:jsdoc-api~JsdocOptions}
 * @returns {object[]}
 * @static
 * @prerequisite Requires node v0.12 or above
 */
function explainSync (options) {
  options = new JsdocOptions(options)
  const ExplainSync = require('./explain-sync')
  const command = new ExplainSync(options, exports.cache)
  return command.execute()
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
  options = new JsdocOptions(options)
  const Explain = require('./explain')
  const command = new Explain(options, exports.cache)
  return command.execute()
}

/**
 * Render jsdoc documentation.
 *
 * @param [options] {module:jsdoc-api~JsdocOptions}
 * @prerequisite Requires node v0.12 or above
 * @static
 * @example
 * jsdoc.renderSync({ files: 'lib/*', destination: 'api-docs' })
 */
function renderSync (options) {
  options = new JsdocOptions(options)
  const RenderSync = require('./render-sync')
  const command = new RenderSync(options)
  return command.execute()
}

/**
 * The jsdoc options, common for all operations.
 * @typicalname options
 */
class JsdocOptions {
  constructor (options) {
    options = options || {}
    const arrayify = require('array-back')

    /**
     * One or more filenames to process. Either this or `source` must be supplied.
     * @type {string|string[]}
     */
    this.files = arrayify(options.files)

    /**
     * A string or array of strings containing source code to process. Either this or `files` must be supplied.
     * @type {string|string[]}
     */
    this.source = options.source

    /**
     * Set to `true` to cache the output - future invocations with the same input will return immediately.
     * @type {boolean}
     * @default
     */
    this.cache = options.cache

    /**
     * Only display symbols with the given access: "public", "protected", "private" or "undefined", or "all" for all access levels. Default: all except "private".
     * @type {string}
     */
    this.access = options.access

    /**
     * The path to the configuration file. Default: path/to/jsdoc/conf.json.
     * @type {string}
     */
    this.configure = options.configure

    /**
     * The path to the output folder. Use "console" to dump data to the console. Default: ./out/.
     * @type {string}
     */
    this.destination = options.destination

    /**
     * Assume this encoding when reading all source files. Default: utf8.
     * @type {string}
     */
    this.encoding = options.encoding

    /**
     * Display symbols marked with the @private tag. Equivalent to "--access all". Default: false.
     * @type {boolean}
     */
    this.private = options.private

    /**
     * The path to the project's package file. Default: path/to/sourcefiles/package.json
     * @type {string}
     */
    this.package = options.package

    /**
     * Treat errors as fatal errors, and treat warnings as errors. Default: false.
     * @type {boolean}
     */
    this.pedantic = options.pedantic

    /**
     * A query string to parse and store in jsdoc.env.opts.query. Example: foo=bar&baz=true.
     * @type {string}
     */
    this.query = options.query

    /**
     * Recurse into subdirectories when scanning for source files and tutorials.
     * @type {boolean}
     */
    this.recurse = options.recurse

    /**
     * The path to the project's README file. Default: path/to/sourcefiles/README.md.
     * @type {string}
     */
    this.readme = options.readme

    /**
     * The path to the template to use. Default: path/to/jsdoc/templates/default.
     * @type {string}
     */
    this.template = options.template

    /**
     * Directory in which JSDoc should search for tutorials.
     * @type {string}
     */
    this.tutorials = options.tutorials
  }
}

/**
 * @external cache-point
 * @see https://github.com/75lb/cache-point
 */
