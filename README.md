[![view on npm](http://img.shields.io/npm/v/jsdoc-api.svg)](https://www.npmjs.org/package/jsdoc-api)
[![npm module downloads per month](http://img.shields.io/npm/dm/jsdoc-api.svg)](https://www.npmjs.org/package/jsdoc-api)
[![Build Status](https://travis-ci.org/jsdoc2md/jsdoc-api.svg?branch=master)](https://travis-ci.org/jsdoc2md/jsdoc-api)
[![Dependency Status](https://david-dm.org/jsdoc2md/jsdoc-api.svg)](https://david-dm.org/jsdoc2md/jsdoc-api)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![Join the chat at https://gitter.im/jsdoc2md/jsdoc2md](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jsdoc2md/jsdoc2md?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Coverage Status](https://coveralls.io/repos/jsdoc2md/jsdoc-api/badge.svg?branch=master&service=github)](https://coveralls.io/github/jsdoc2md/jsdoc-api?branch=master)

<a name="module_jsdoc-api"></a>
## jsdoc-api
**Example**  
```js
const jsdoc = require('jsdoc-api')
```

* [jsdoc-api](#module_jsdoc-api)
    * [.explainSync(files)](#module_jsdoc-api.explainSync) ⇒ <code>object</code>
        * [.source(source)](#module_jsdoc-api.explainSync.source) ⇒ <code>Array.&lt;object&gt;</code>
    * [.explain(files, [options])](#module_jsdoc-api.explain) ⇒ <code>Promise</code>
        * [.source(source)](#module_jsdoc-api.explain.source) ⇒ <code>Promise</code>
    * [.createExplainStream(files, [options])](#module_jsdoc-api.createExplainStream) ⇒ <code>Readable</code>
    * [.renderSync(files, [options])](#module_jsdoc-api.renderSync)
        * [.source(source, [options])](#module_jsdoc-api.renderSync.source)

<a name="module_jsdoc-api.explainSync"></a>
### jsdoc.explainSync(files) ⇒ <code>object</code>
Returns jsdoc explain output

**Kind**: static method of <code>[jsdoc-api](#module_jsdoc-api)</code>  
**Node**: Requires version 0.12 and above  

| Param | Type | Description |
| --- | --- | --- |
| files | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | input file names |

<a name="module_jsdoc-api.explainSync.source"></a>
#### explainSync.source(source) ⇒ <code>Array.&lt;object&gt;</code>
Returns jsdoc explain output, taking source code as input.

**Kind**: static method of <code>[explainSync](#module_jsdoc-api.explainSync)</code>  
**Node**: Requires version 0.12 and above  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | source code |

<a name="module_jsdoc-api.explain"></a>
### jsdoc.explain(files, [options]) ⇒ <code>Promise</code>
**Kind**: static method of <code>[jsdoc-api](#module_jsdoc-api)</code>  
**Throws**:

- `INVALID_FILES` - One or more files was not valid source code

**Fulfil**: <code>object[]</code> - jsdoc explain output  

| Param | Type | Description |
| --- | --- | --- |
| files | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | input source files |
| [options] | <code>object</code> |  |
| [options.configure] |  |  |

<a name="module_jsdoc-api.explain.source"></a>
#### explain.source(source) ⇒ <code>Promise</code>
**Kind**: static method of <code>[explain](#module_jsdoc-api.explain)</code>  
**Fulfil**: <code>object[]</code> - jsdoc explain output  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | input source code |

<a name="module_jsdoc-api.createExplainStream"></a>
### jsdoc.createExplainStream(files, [options]) ⇒ <code>Readable</code>
**Kind**: static method of <code>[jsdoc-api](#module_jsdoc-api)</code>  

| Param | Type | Description |
| --- | --- | --- |
| files | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | input source files |
| [options] | <code>object</code> |  |
| [options.configure] |  |  |

<a name="module_jsdoc-api.renderSync"></a>
### jsdoc.renderSync(files, [options])
**Kind**: static method of <code>[jsdoc-api](#module_jsdoc-api)</code>  

| Param | Type | Description |
| --- | --- | --- |
| files | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | input source files |
| [options] | <code>object</code> | options |
| [options.destination] |  | destination path |

<a name="module_jsdoc-api.renderSync.source"></a>
#### renderSync.source(source, [options])
**Kind**: static method of <code>[renderSync](#module_jsdoc-api.renderSync)</code>  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | the source code |
| [options] | <code>object</code> | options |
| [options.destination] |  | destination path |


* * *

&copy; 2015 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
