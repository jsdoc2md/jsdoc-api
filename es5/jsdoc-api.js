'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExplainStream = require('./explain-stream');
var jsdoc = require('./jsdoc');

exports.explainSync = explainSync;
exports.explain = explain;
exports.createExplainStream = createExplainStream;
exports.renderSync = renderSync;

function explainSync(options) {
  var jsdocExplainSync = new jsdoc.ExplainSync(options);
  return jsdocExplainSync.execute();
}

function explain(options) {
  var jsdocExplain = new jsdoc.Explain(options);
  return jsdocExplain.execute();
}

function createExplainStream(options) {
  return new ExplainStream(explain, options);
}

function renderSync(options) {
  var render = new jsdoc.RenderSync(options);
  return render.execute();
}

var JsdocOptions = function JsdocOptions(options) {
  _classCallCheck(this, JsdocOptions);

  this.files = [];

  this.source = '';

  this.access = '';

  this.configure = '';

  this.destination = '';

  this.encoding = '';

  this.private = false;

  this.package = '';

  this.pedantic = false;

  this.query = '';

  this.recurse = false;

  this.readme = '';

  this.template = '';

  this.tutorials = '';
};