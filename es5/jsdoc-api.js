'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

exports.explainSync = explainSync;
exports.explain = explain;
exports.createExplainStream = createExplainStream;
exports.renderSync = renderSync;

var Cache = require('cache-point');
exports.cache = new Cache();

function explainSync(options) {
  options = new JsdocOptions(options);
  var ExplainSync = require('./explain-sync');
  var command = new ExplainSync(options);
  return command.execute();
}

function explain(options) {
  options = new JsdocOptions(options);
  var Explain = require('./explain');
  var command = new Explain(options, exports.cache);
  return command.execute();
}

function createExplainStream(options) {
  options = new JsdocOptions(options);
  var ExplainStream = require('./explain-stream');
  return new ExplainStream(explain, options);
}

function renderSync(options) {
  options = new JsdocOptions(options);
  var RenderSync = require('./render-sync');
  var command = new RenderSync(options);
  return command.execute();
}

var JsdocOptions = function JsdocOptions(options) {
  _classCallCheck(this, JsdocOptions);

  this.files = [];

  this.source = undefined;

  this.cache = false;

  this.access = undefined;

  this.configure = undefined;

  this.destination = undefined;

  this.encoding = undefined;

  this.private = undefined;

  this.package = undefined;

  this.pedantic = undefined;

  this.query = undefined;

  this.recurse = undefined;

  this.readme = undefined;

  this.template = undefined;

  this.tutorials = undefined;

  this.html = undefined;

  Object.assign(this, options);
  if (this.html) {
    var path = require('path');
    this.configure = path.resolve(__dirname, 'html-conf.json');
    delete this.html;
  }
};