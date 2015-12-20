[![view on npm](http://img.shields.io/npm/v/jsdoc-api.svg)](https://www.npmjs.org/package/jsdoc-api)
[![npm module downloads per month](http://img.shields.io/npm/dm/jsdoc-api.svg)](https://www.npmjs.org/package/jsdoc-api)
[![Build Status](https://travis-ci.org/jsdoc2md/jsdoc-api.svg?branch=master)](https://travis-ci.org/jsdoc2md/jsdoc-api)
[![Dependency Status](https://david-dm.org/jsdoc2md/jsdoc-api.svg)](https://david-dm.org/jsdoc2md/jsdoc-api)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![Join the chat at https://gitter.im/jsdoc2md/jsdoc2md](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jsdoc2md/jsdoc2md?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

<a name="module_jsdoc-api"></a>
## jsdoc-api
**Example**  
```js
const jsdoc = require('jsdoc-api')
```

* [jsdoc-api](#module_jsdoc-api)
    * _static_
        * [.explainSync(files)](#module_jsdoc-api.explainSync) ⇒ <code>object</code>
            * [.source(source)](#module_jsdoc-api.explainSync.source) ⇒ <code>Array.&lt;object&gt;</code>
    * _inner_
        * [~explain(files)](#module_jsdoc-api..explain) ⇒ <code>Promise</code>
            * [.source(source)](#module_jsdoc-api..explain.source) ⇒ <code>Promise</code>

<a name="module_jsdoc-api.explainSync"></a>
### jsdoc-api.explainSync(files) ⇒ <code>object</code>
**Kind**: static method of <code>[jsdoc-api](#module_jsdoc-api)</code>  
**Returns**: <code>object</code> - - jsdoc explain output  

| Param | Type | Description |
| --- | --- | --- |
| files | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | input file names |

<a name="module_jsdoc-api.explainSync.source"></a>
#### explainSync.source(source) ⇒ <code>Array.&lt;object&gt;</code>
**Kind**: static method of <code>[explainSync](#module_jsdoc-api.explainSync)</code>  
**Returns**: <code>Array.&lt;object&gt;</code> - - jsdoc explain output  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | source code |

<a name="module_jsdoc-api..explain"></a>
### jsdoc-api~explain(files) ⇒ <code>Promise</code>
**Kind**: inner method of <code>[jsdoc-api](#module_jsdoc-api)</code>  
**Fulfil**: <code>object[]</code> - jsdoc explain output  

| Param | Type | Description |
| --- | --- | --- |
| files | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | input source files |

<a name="module_jsdoc-api..explain.source"></a>
#### explain.source(source) ⇒ <code>Promise</code>
**Kind**: static method of <code>[explain](#module_jsdoc-api..explain)</code>  
**Fulfil**: <code>object[]</code> - jsdoc explain output  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | input source code |


* * *

&copy; 2015 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
