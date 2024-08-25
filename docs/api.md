<a name="module_jsdoc-api"></a>

## jsdoc-api

* [jsdoc-api](#module_jsdoc-api)
    * [jsdoc](#exp_module_jsdoc-api--jsdoc) ⏏
        * _static_
            * [.explain([options])](#module_jsdoc-api--jsdoc.explain) ⇒ <code>Promise</code>
            * [.render([options])](#module_jsdoc-api--jsdoc.render)
        * _inner_
            * [~JsdocOptions](#module_jsdoc-api--jsdoc..JsdocOptions)
                * [.files](#module_jsdoc-api--jsdoc..JsdocOptions+files) : <code>string</code> \| <code>Array.&lt;string&gt;</code>
                * [.source](#module_jsdoc-api--jsdoc..JsdocOptions+source) : <code>string</code>
                * [.cache](#module_jsdoc-api--jsdoc..JsdocOptions+cache) : <code>boolean</code>
                * [.access](#module_jsdoc-api--jsdoc..JsdocOptions+access) : <code>string</code>
                * [.configure](#module_jsdoc-api--jsdoc..JsdocOptions+configure) : <code>string</code>
                * [.destination](#module_jsdoc-api--jsdoc..JsdocOptions+destination) : <code>string</code>
                * [.encoding](#module_jsdoc-api--jsdoc..JsdocOptions+encoding) : <code>string</code>
                * [.private](#module_jsdoc-api--jsdoc..JsdocOptions+private) : <code>boolean</code>
                * [.package](#module_jsdoc-api--jsdoc..JsdocOptions+package) : <code>string</code>
                * [.pedantic](#module_jsdoc-api--jsdoc..JsdocOptions+pedantic) : <code>boolean</code>
                * [.query](#module_jsdoc-api--jsdoc..JsdocOptions+query) : <code>string</code>
                * [.recurse](#module_jsdoc-api--jsdoc..JsdocOptions+recurse) : <code>boolean</code>
                * [.readme](#module_jsdoc-api--jsdoc..JsdocOptions+readme) : <code>string</code>
                * [.template](#module_jsdoc-api--jsdoc..JsdocOptions+template) : <code>string</code>
                * [.tutorials](#module_jsdoc-api--jsdoc..JsdocOptions+tutorials) : <code>string</code>
            * [~cache](#module_jsdoc-api--jsdoc..cache) : [<code>cache-point</code>](https://github.com/75lb/cache-point)

<a name="exp_module_jsdoc-api--jsdoc"></a>

### jsdoc ⏏
**Kind**: Exported constant  
<a name="module_jsdoc-api--jsdoc.explain"></a>

#### jsdoc.explain([options]) ⇒ <code>Promise</code>
Returns a promise for the jsdoc explain output.

**Kind**: static method of [<code>jsdoc</code>](#exp_module_jsdoc-api--jsdoc)  
**Fulfil**: <code>object[]</code> - jsdoc explain output  

| Param | Type |
| --- | --- |
| [options] | [<code>JsdocOptions</code>](#module_jsdoc-api--jsdoc..JsdocOptions) | 

<a name="module_jsdoc-api--jsdoc.render"></a>

#### jsdoc.render([options])
Render jsdoc documentation.

**Kind**: static method of [<code>jsdoc</code>](#exp_module_jsdoc-api--jsdoc)  
**Prerequisite**: Requires node v0.12 or above  

| Param | Type |
| --- | --- |
| [options] | [<code>JsdocOptions</code>](#module_jsdoc-api--jsdoc..JsdocOptions) | 

**Example**  
```js
await jsdoc.render({ files: 'lib/*', destination: 'api-docs' })
```
<a name="module_jsdoc-api--jsdoc..JsdocOptions"></a>

#### jsdoc~JsdocOptions
The jsdoc options, common for all operations.

**Kind**: inner class of [<code>jsdoc</code>](#exp_module_jsdoc-api--jsdoc)  

* [~JsdocOptions](#module_jsdoc-api--jsdoc..JsdocOptions)
    * [.files](#module_jsdoc-api--jsdoc..JsdocOptions+files) : <code>string</code> \| <code>Array.&lt;string&gt;</code>
    * [.source](#module_jsdoc-api--jsdoc..JsdocOptions+source) : <code>string</code>
    * [.cache](#module_jsdoc-api--jsdoc..JsdocOptions+cache) : <code>boolean</code>
    * [.access](#module_jsdoc-api--jsdoc..JsdocOptions+access) : <code>string</code>
    * [.configure](#module_jsdoc-api--jsdoc..JsdocOptions+configure) : <code>string</code>
    * [.destination](#module_jsdoc-api--jsdoc..JsdocOptions+destination) : <code>string</code>
    * [.encoding](#module_jsdoc-api--jsdoc..JsdocOptions+encoding) : <code>string</code>
    * [.private](#module_jsdoc-api--jsdoc..JsdocOptions+private) : <code>boolean</code>
    * [.package](#module_jsdoc-api--jsdoc..JsdocOptions+package) : <code>string</code>
    * [.pedantic](#module_jsdoc-api--jsdoc..JsdocOptions+pedantic) : <code>boolean</code>
    * [.query](#module_jsdoc-api--jsdoc..JsdocOptions+query) : <code>string</code>
    * [.recurse](#module_jsdoc-api--jsdoc..JsdocOptions+recurse) : <code>boolean</code>
    * [.readme](#module_jsdoc-api--jsdoc..JsdocOptions+readme) : <code>string</code>
    * [.template](#module_jsdoc-api--jsdoc..JsdocOptions+template) : <code>string</code>
    * [.tutorials](#module_jsdoc-api--jsdoc..JsdocOptions+tutorials) : <code>string</code>

<a name="module_jsdoc-api--jsdoc..JsdocOptions+files"></a>

##### options.files : <code>string</code> \| <code>Array.&lt;string&gt;</code>
One or more filenames to process. Either this or `source` must be supplied.

**Kind**: instance property of [<code>JsdocOptions</code>](#module_jsdoc-api--jsdoc..JsdocOptions)  
<a name="module_jsdoc-api--jsdoc..JsdocOptions+source"></a>

##### options.source : <code>string</code>
A string containing source code to process. Either this or `files` must be supplied.

**Kind**: instance property of [<code>JsdocOptions</code>](#module_jsdoc-api--jsdoc..JsdocOptions)  
<a name="module_jsdoc-api--jsdoc..JsdocOptions+cache"></a>

##### options.cache : <code>boolean</code>
Set to `true` to cache the output - future invocations with the same input will return immediately.

**Kind**: instance property of [<code>JsdocOptions</code>](#module_jsdoc-api--jsdoc..JsdocOptions)  
<a name="module_jsdoc-api--jsdoc..JsdocOptions+access"></a>

##### options.access : <code>string</code>
Only display symbols with the given access: "public", "protected", "private" or "undefined", or "all" for all access levels. Default: all except "private".

**Kind**: instance property of [<code>JsdocOptions</code>](#module_jsdoc-api--jsdoc..JsdocOptions)  
<a name="module_jsdoc-api--jsdoc..JsdocOptions+configure"></a>

##### options.configure : <code>string</code>
The path to the configuration file. Default: path/to/jsdoc/conf.json.

**Kind**: instance property of [<code>JsdocOptions</code>](#module_jsdoc-api--jsdoc..JsdocOptions)  
<a name="module_jsdoc-api--jsdoc..JsdocOptions+destination"></a>

##### options.destination : <code>string</code>
The path to the output folder. Use "console" to dump data to the console. Default: ./out/.

**Kind**: instance property of [<code>JsdocOptions</code>](#module_jsdoc-api--jsdoc..JsdocOptions)  
<a name="module_jsdoc-api--jsdoc..JsdocOptions+encoding"></a>

##### options.encoding : <code>string</code>
Assume this encoding when reading all source files. Default: utf8.

**Kind**: instance property of [<code>JsdocOptions</code>](#module_jsdoc-api--jsdoc..JsdocOptions)  
<a name="module_jsdoc-api--jsdoc..JsdocOptions+private"></a>

##### options.private : <code>boolean</code>
Display symbols marked with the @private tag. Equivalent to "--access all". Default: false.

**Kind**: instance property of [<code>JsdocOptions</code>](#module_jsdoc-api--jsdoc..JsdocOptions)  
<a name="module_jsdoc-api--jsdoc..JsdocOptions+package"></a>

##### options.package : <code>string</code>
The path to the project's package file. Default: path/to/sourcefiles/package.json

**Kind**: instance property of [<code>JsdocOptions</code>](#module_jsdoc-api--jsdoc..JsdocOptions)  
<a name="module_jsdoc-api--jsdoc..JsdocOptions+pedantic"></a>

##### options.pedantic : <code>boolean</code>
Treat errors as fatal errors, and treat warnings as errors. Default: false.

**Kind**: instance property of [<code>JsdocOptions</code>](#module_jsdoc-api--jsdoc..JsdocOptions)  
<a name="module_jsdoc-api--jsdoc..JsdocOptions+query"></a>

##### options.query : <code>string</code>
A query string to parse and store in jsdoc.env.opts.query. Example: foo=bar&baz=true.

**Kind**: instance property of [<code>JsdocOptions</code>](#module_jsdoc-api--jsdoc..JsdocOptions)  
<a name="module_jsdoc-api--jsdoc..JsdocOptions+recurse"></a>

##### options.recurse : <code>boolean</code>
Recurse into subdirectories when scanning for source files and tutorials.

**Kind**: instance property of [<code>JsdocOptions</code>](#module_jsdoc-api--jsdoc..JsdocOptions)  
<a name="module_jsdoc-api--jsdoc..JsdocOptions+readme"></a>

##### options.readme : <code>string</code>
The path to the project's README file. Default: path/to/sourcefiles/README.md.

**Kind**: instance property of [<code>JsdocOptions</code>](#module_jsdoc-api--jsdoc..JsdocOptions)  
<a name="module_jsdoc-api--jsdoc..JsdocOptions+template"></a>

##### options.template : <code>string</code>
The path to the template to use. Default: path/to/jsdoc/templates/default.

**Kind**: instance property of [<code>JsdocOptions</code>](#module_jsdoc-api--jsdoc..JsdocOptions)  
<a name="module_jsdoc-api--jsdoc..JsdocOptions+tutorials"></a>

##### options.tutorials : <code>string</code>
Directory in which JSDoc should search for tutorials.

**Kind**: instance property of [<code>JsdocOptions</code>](#module_jsdoc-api--jsdoc..JsdocOptions)  
<a name="module_jsdoc-api--jsdoc..cache"></a>

#### jsdoc~cache : [<code>cache-point</code>](https://github.com/75lb/cache-point)
The [cache-point](https://github.com/75lb/cache-point) instance used when `cache: true` is specified on `.explain()`.

**Kind**: inner constant of [<code>jsdoc</code>](#exp_module_jsdoc-api--jsdoc)  
