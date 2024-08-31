/**
 * @module jsdoc-api
 * @typicalname jsdoc
 */
import Cache from 'cache-point'
import Explain from './lib/explain.js'
import Render from './lib/render.js'
import arrayify from 'array-back'
import TempFile from './lib/temp-file.js'

TempFile.createTmpDirs()

/**
 * @external cache-point
 * @see https://github.com/75lb/cache-point
 */
/**
  * The [cache-point](https://github.com/75lb/cache-point) instance used when `cache: true` is specified on `.explain()`.
  * @type {external:cache-point}
  */
const cache = new Cache({ dir: TempFile.cacheDir })

/**
 * @alias module:jsdoc-api
 */
const jsdoc = {
  cache,

  /**
   * Returns a promise for the jsdoc explain output.
   *
   * @param [options] {module:jsdoc-api~JsdocOptions}
   * @fulfil {object[]} - jsdoc explain output
   * @returns {Promise}
   */
  async explain (options) {
    options = new JsdocOptions(options)
    const command = new Explain(options, cache)
    return command.execute()
  },

  /**
   * Render jsdoc documentation.
   *
   * @param [options] {module:jsdoc-api~JsdocOptions}
   * @prerequisite Requires node v0.12 or above
   * @example
   * await jsdoc.render({ files: 'lib/*', destination: 'api-docs' })
   */
  async render (options) {
    options = new JsdocOptions(options)
    const command = new Render(options)
    return command.execute()
  }
}

/**
 * The jsdoc options, common for all operations.
 * @typicalname options
 */
class JsdocOptions {
  constructor (options = {}) {
    /**
     * One or more filenames to process. Either `files`, `source` or `configure` must be supplied.
     * @type {string|string[]}
     */
    this.files = arrayify(options.files)

    /**
     * A string or an array of strings containing source code to process. Either `files`, `source` or `configure` must be supplied.
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
     * The path to the configuration file. Default: path/to/jsdoc/conf.json. Either `files`, `source` or `configure` must be supplied.
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

    /* Warning to avoid a common mistake where dmd templates are passed in.. a jsdoc template must be a filename. */
    if (typeof options.template === 'string' && options.template.split(/\r?\n/).length !== 1) {
      console.warn('Suspicious `options.template` value - the jsdoc `template` option must be a file path.')
      console.warn(options.template)
    }

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

export default jsdoc
