[![view on npm](http://img.shields.io/npm/v/jsdoc-api.svg)](https://www.npmjs.org/package/jsdoc-api)
[![npm module downloads](http://img.shields.io/npm/dt/jsdoc-api.svg)](https://www.npmjs.org/package/jsdoc-api)
[![Build Status](https://travis-ci.org/jsdoc2md/jsdoc-api.svg?branch=master)](https://travis-ci.org/jsdoc2md/jsdoc-api)
[![Coverage Status](https://coveralls.io/repos/jsdoc2md/jsdoc-api/badge.svg?branch=master&service=github)](https://coveralls.io/github/jsdoc2md/jsdoc-api?branch=master)
[![Dependency Status](https://david-dm.org/jsdoc2md/jsdoc-api.svg)](https://david-dm.org/jsdoc2md/jsdoc-api)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![Join the chat at https://gitter.im/jsdoc2md/jsdoc2md](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jsdoc2md/jsdoc2md?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Modules

<dl>
<dt><a href="#module_jsdoc-api">jsdoc-api</a></dt>
<dd></dd>
<dt><a href="#module_jsdoc">jsdoc</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#JsdocCommand">JsdocCommand</a></dt>
<dd><p>Command base class. The command <code>receiver</code> being the <code>child_process</code> module.</p>
</dd>
<dt><a href="#JsdocExplain">JsdocExplain</a> ⇐ <code>module:jsdoc~JsdocCommand</code></dt>
<dd></dd>
<dt><a href="#JsdocSync">JsdocSync</a></dt>
<dd></dd>
<dt><a href="#RenderSync">RenderSync</a></dt>
<dd></dd>
</dl>

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
**Throws**:

- `INVALID_FILES` - One or more files was not valid source code

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

<a name="module_jsdoc"></a>
## jsdoc
<a name="JsdocCommand"></a>
## *JsdocCommand*
Command base class. The command `receiver` being the `child_process` module.

**Kind**: global abstract class  

* *[JsdocCommand](#JsdocCommand)*
    * *[.execute()](#JsdocCommand+execute)*
    * *[.preExecute()](#JsdocCommand+preExecute)*
    * *[.validate()](#JsdocCommand+validate) ⇒ <code>null</code> &#124; <code>Error</code>*
    * *[.postExecute()](#JsdocCommand+postExecute)*

<a name="JsdocCommand+execute"></a>
### *jsdocCommand.execute()*
Template method returning the jsdoc output. Invoke later (for example via a command-queuing system) or immediately as required.

1. preExecute
2. validate
3. getOutput
4. postExecute

**Kind**: instance method of <code>[JsdocCommand](#JsdocCommand)</code>  
<a name="JsdocCommand+preExecute"></a>
### *jsdocCommand.preExecute()*
Perform pre-execution processing here, e.g. expand input glob patterns.

**Kind**: instance method of <code>[JsdocCommand](#JsdocCommand)</code>  
<a name="JsdocCommand+validate"></a>
### *jsdocCommand.validate() ⇒ <code>null</code> &#124; <code>Error</code>*
Return an Error instance if execution should not proceed.

**Kind**: instance method of <code>[JsdocCommand](#JsdocCommand)</code>  
<a name="JsdocCommand+postExecute"></a>
### *jsdocCommand.postExecute()*
perform post-execution cleanup

**Kind**: instance method of <code>[JsdocCommand](#JsdocCommand)</code>  
<a name="JsdocExplain"></a>
## JsdocExplain ⇐ <code>module:jsdoc~JsdocCommand</code>
**Kind**: global class  
**Extends:** <code>module:jsdoc~JsdocCommand</code>  
<a name="JsdocSync"></a>
## JsdocSync
**Kind**: global class  
<a name="RenderSync"></a>
## RenderSync
**Kind**: global class  

* * *

&copy; 2015 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown).
