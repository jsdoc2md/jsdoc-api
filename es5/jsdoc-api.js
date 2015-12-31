'use strict';

var path = require('path');
var assert = require('assert');
var walkBack = require('walk-back');
var spawnSync = require('child_process').spawnSync;
var toSpawnArgs = require('object-to-spawn-args');
var arrayify = require('array-back');
var ExplainStream = require('./explain-stream');
var TempFile = require('./temp-file');
var jsdoc = require('./jsdoc');

exports.explainSync = explainSync;
exports.explain = explain;
exports.createExplainStream = createExplainStream;
exports.renderSync = renderSync;

var jsdocPath = walkBack(path.join(__dirname, '..'), path.join('node_modules', 'jsdoc-75lb', 'jsdoc.js'));

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