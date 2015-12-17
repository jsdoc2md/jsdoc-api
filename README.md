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
        * [.explain(source)](#module_jsdoc-api.explain) ⇒ <code>object</code>
        * [.render(source, [options])](#module_jsdoc-api.render)
    * _inner_
        * [~TempFile](#module_jsdoc-api..TempFile)

<a name="module_jsdoc-api.explain"></a>
### jsdoc-api.explain(source) ⇒ <code>object</code>
**Kind**: static method of <code>[jsdoc-api](#module_jsdoc-api)</code>  
**Returns**: <code>object</code> - - json  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | source code |

<a name="module_jsdoc-api.render"></a>
### jsdoc-api.render(source, [options])
**Kind**: static method of <code>[jsdoc-api](#module_jsdoc-api)</code>  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>string</code> | the source code |
| [options] | <code>object</code> | options |
| [options.destination] |  | destination path |

<a name="module_jsdoc-api..TempFile"></a>
### jsdoc-api~TempFile
**Kind**: inner class of <code>[jsdoc-api](#module_jsdoc-api)</code>  

* * *

&copy; 2015 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
