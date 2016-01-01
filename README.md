[![view on npm](http://img.shields.io/npm/v/jsdoc-api.svg)](https://www.npmjs.org/package/jsdoc-api)
[![npm module downloads](http://img.shields.io/npm/dt/jsdoc-api.svg)](https://www.npmjs.org/package/jsdoc-api)
[![Build Status](https://travis-ci.org/jsdoc2md/jsdoc-api.svg?branch=master)](https://travis-ci.org/jsdoc2md/jsdoc-api)
[![Coverage Status](https://coveralls.io/repos/jsdoc2md/jsdoc-api/badge.svg?branch=master&service=github)](https://coveralls.io/github/jsdoc2md/jsdoc-api?branch=master)
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
    * [.explainSync([options])](#module_jsdoc-api.explainSync) ⇒ <code>object</code>
    * [.explain([options])](#module_jsdoc-api.explain) ⇒ <code>Promise</code>
    * [.createExplainStream([options])](#module_jsdoc-api.createExplainStream) ⇒ <code>Duplex</code>
    * [.renderSync()](#module_jsdoc-api.renderSync)

<a name="module_jsdoc-api.explainSync"></a>
### jsdoc.explainSync([options]) ⇒ <code>object</code>
Returns jsdoc explain output

**Kind**: static method of <code>[jsdoc-api](#module_jsdoc-api)</code>  
**Prerequisite**: Requires node v0.12 or above  

| Param | Type |
| --- | --- |
| [options] | <code>object</code> | 
| [options.files] | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | 
| [options.source] | <code>string</code> | 

<a name="module_jsdoc-api.explain"></a>
### jsdoc.explain([options]) ⇒ <code>Promise</code>
**Kind**: static method of <code>[jsdoc-api](#module_jsdoc-api)</code>  
**Fulfil**: <code>object[]</code> - jsdoc explain output  

| Param | Type |
| --- | --- |
| [options] | <code>object</code> | 
| [options.files] | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | 
| [options.source] | <code>string</code> | 
| [options.configure] |  | 

<a name="module_jsdoc-api.createExplainStream"></a>
### jsdoc.createExplainStream([options]) ⇒ <code>Duplex</code>
**Kind**: static method of <code>[jsdoc-api](#module_jsdoc-api)</code>  

| Param | Type |
| --- | --- |
| [options] | <code>object</code> | 
| [options.files] | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | 
| [options.source] | <code>string</code> | 
| [options.configure] |  | 

<a name="module_jsdoc-api.renderSync"></a>
### jsdoc.renderSync()
**Kind**: static method of <code>[jsdoc-api](#module_jsdoc-api)</code>  
**Prerequisite**: Requires node v0.12 or above  

| Param | Type | Description |
| --- | --- | --- |
| [options.files] | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> |  |
| [options.source] | <code>string</code> |  |
| [options.configure] |  |  |
| [options.destination] |  | destination path |



* * *

&copy; 2015 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
