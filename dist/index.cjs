'use strict';

var Cache = require('cache-point');
var arrayify = require('array-back');
var path = require('path');
var fs = require('node:fs');
var os = require('os');
var crypto = require('crypto');
var FileSet = require('file-set');
var assert = require('assert');
var walkBack = require('walk-back');
var currentModulePaths = require('current-module-paths');
var toSpawnArgs = require('object-to-spawn-args');
var cp = require('child_process');
var util = require('node:util');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
class TempFile {
  constructor (source) {
    this.path = path.join(TempFile.tempFileDir, crypto.randomBytes(6).toString('hex') + '.js');
    fs.writeFileSync(this.path, source);
  }

  delete () {
    try {
      fs.unlinkSync(this.path);
    } catch (err) {
      // already deleted
    }
  }

  static tempFileDir = path.join(os.homedir(), '.jsdoc-api/temp')
  static cacheDir = path.join(os.homedir(), '.jsdoc-api/cache')

  static createTmpDirs () {
    /* No longer using os.tmpdir(). See: https://github.com/jsdoc2md/jsdoc-api/issues/19 */
    fs.mkdirSync(TempFile.tempFileDir, { recursive: true });
    fs.mkdirSync(TempFile.cacheDir, { recursive: true });
  }
}

const { __dirname: __dirname$1 } = currentModulePaths((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('index.cjs', document.baseURI).href)));

class JsdocCommand {
  constructor (options = {}, cache) {
    options.files = arrayify(options.files);
    options.source = arrayify(options.source);
    assert.ok(
      options.files.length || options.source.length || options.configure,
      'Must set at least one of .files, .source or .configure'
    );

    this.cache = cache;
    this.tempFiles = [];

    const jsdocOptions = Object.assign({}, options);
    delete jsdocOptions.files;
    delete jsdocOptions.source;
    delete jsdocOptions.cache;

    /* see: https://github.com/jsdoc2md/jsdoc-api/issues/22 */
    if (!jsdocOptions.pedantic) {
      delete jsdocOptions.pedantic;
    }

    this.options = options;
    this.jsdocOptions = jsdocOptions;

    this.jsdocPath = process.env.JSDOC_PATH || walkBack(
      path.join(__dirname$1, '..'),
      path.join('node_modules', 'jsdoc', 'jsdoc.js')
    );
  }

  async execute () {
    this.inputFileSet = new FileSet();
    await this.inputFileSet.add(this.options.files);
    /* node-glob v9+ (used by file-set) no longer sorts the output by default. We will continue to sort the file list, for now, as it's what the user expected by default. The user's system locale is used. */
    const collator = new Intl.Collator();
    this.inputFileSet.files.sort(collator.compare);

    if (this.options.source.length) {
      this.tempFiles = this.options.source.map(source => new TempFile(source));
      this.tempFileSet = new FileSet();
      await this.tempFileSet.add(this.tempFiles.map(t => t.path));
    }

    let result;
    try {
      result = await this.getOutput();
    } finally {
      /* run even if getOutput fails */
      if (this.tempFiles) {
        for (const tempFile of this.tempFiles) {
          tempFile.delete();
        }
      }
    }
    return result
  }
}

const exec = util.promisify(cp.exec);

class Explain extends JsdocCommand {
  async getOutput () {
    if (this.options.cache && !this.options.source.length) {
      try {
        return await this.readCache()
      } catch (err) {
        if (err.code === 'ENOENT') {
          return this._runJsdoc()
        } else {
          throw err
        }
      }
    } else {
      return this._runJsdoc()
    }
  }

  async _runJsdoc () {
    const cmd = this.options.source.length
      ? `node ${this.jsdocPath} ${toSpawnArgs(this.jsdocOptions).join(' ')} -X ${this.tempFileSet.files.join(' ')}`
      : `node ${this.jsdocPath} ${toSpawnArgs(this.jsdocOptions).join(' ')} -X ${this.inputFileSet.files.join(' ')}`;

    let jsdocOutput = { stdout: '', stderr: '' };
    try {
      jsdocOutput = await exec(cmd, { maxBuffer: 1024 * 1024 * 100 }); /* 100MB */
      const explainOutput = JSON.parse(jsdocOutput.stdout);
      if (this.options.cache) {
        await this.cache.write(this.cacheKey, explainOutput);
      }
      return explainOutput
    } catch (err) {
      const firstLineOfStdout = jsdocOutput.stdout.split(/\r?\n/)[0];
      const jsdocErr = new Error(jsdocOutput.stderr.trim() || firstLineOfStdout || 'Jsdoc failed.');
      jsdocErr.name = 'JSDOC_ERROR';
      jsdocErr.cause = err;
      throw jsdocErr
    }
  }

  async readCache () {
    if (this.cache) {
      /* Create the cache key then check the cache for a match, returning pre-generated output if so.
      The current cache key is a union of the input file names plus their content - this could be expensive when processing a lot of files.
      */
      const promises = this.inputFileSet.files.map(file => {
        return fs.promises.readFile(file, 'utf8')
      });
      const contents = await Promise.all(promises);
      this.cacheKey = contents.concat(this.inputFileSet.files);
      return this.cache.read(this.cacheKey)
    } else {
      return Promise.reject()
    }
  }
}

class Render extends JsdocCommand {
  async getOutput () {
    return new Promise((resolve, reject) => {
      const jsdocArgs = toSpawnArgs(this.jsdocOptions)
        .concat(this.options.source.length ? this.tempFiles.map(t => t.path) : this.options.files);

      jsdocArgs.unshift(this.jsdocPath);
      const handle = cp.spawn('node', jsdocArgs, { stdio: 'inherit' });
      handle.on('close', resolve);
    })
  }
}

/**
 * @module jsdoc-api
 * @typicalname jsdoc
 */

TempFile.createTmpDirs();

/**
 * @external cache-point
 * @see https://github.com/75lb/cache-point
 */
/**
  * The [cache-point](https://github.com/75lb/cache-point) instance used when `cache: true` is specified on `.explain()`.
  * @type {external:cache-point}
  */
const cache = new Cache({ dir: TempFile.cacheDir });

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
    options = new JsdocOptions(options);
    const command = new Explain(options, cache);
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
    options = new JsdocOptions(options);
    const command = new Render(options);
    return command.execute()
  }
};

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
    this.files = arrayify(options.files);

    /**
     * A string or an array of strings containing source code to process. Either `files`, `source` or `configure` must be supplied.
     * @type {string|string[]}
     */
    this.source = options.source;

    /**
     * Set to `true` to cache the output - future invocations with the same input will return immediately.
     * @type {boolean}
     * @default
     */
    this.cache = options.cache;

    /**
     * Only display symbols with the given access: "public", "protected", "private" or "undefined", or "all" for all access levels. Default: all except "private".
     * @type {string}
     */
    this.access = options.access;

    /**
     * The path to the configuration file. Default: path/to/jsdoc/conf.json. Either `files`, `source` or `configure` must be supplied.
     * @type {string}
     */
    this.configure = options.configure;

    /**
     * The path to the output folder. Use "console" to dump data to the console. Default: ./out/.
     * @type {string}
     */
    this.destination = options.destination;

    /**
     * Assume this encoding when reading all source files. Default: utf8.
     * @type {string}
     */
    this.encoding = options.encoding;

    /**
     * Display symbols marked with the @private tag. Equivalent to "--access all". Default: false.
     * @type {boolean}
     */
    this.private = options.private;

    /**
     * The path to the project's package file. Default: path/to/sourcefiles/package.json
     * @type {string}
     */
    this.package = options.package;

    /**
     * Treat errors as fatal errors, and treat warnings as errors. Default: false.
     * @type {boolean}
     */
    this.pedantic = options.pedantic;

    /**
     * A query string to parse and store in jsdoc.env.opts.query. Example: foo=bar&baz=true.
     * @type {string}
     */
    this.query = options.query;

    /**
     * Recurse into subdirectories when scanning for source files and tutorials.
     * @type {boolean}
     */
    this.recurse = options.recurse;

    /**
     * The path to the project's README file. Default: path/to/sourcefiles/README.md.
     * @type {string}
     */
    this.readme = options.readme;

    /* Warning to avoid a common mistake where dmd templates are passed in.. a jsdoc template must be a filename. */
    if (typeof options.template === 'string' && options.template.split(/\r?\n/).length !== 1) {
      console.warn('Suspicious `options.template` value - the jsdoc `template` option must be a file path.');
      console.warn(options.template);
    }

    /**
     * The path to the template to use. Default: path/to/jsdoc/templates/default.
     * @type {string}
     */
    this.template = options.template;

    /**
     * Directory in which JSDoc should search for tutorials.
     * @type {string}
     */
    this.tutorials = options.tutorials;
  }
}

module.exports = jsdoc;
