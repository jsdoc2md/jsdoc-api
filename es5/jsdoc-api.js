'use strict';

var path = require('path');
var assert = require('assert');
var walkBack = require('walk-back');
var spawnSync = require('child_process').spawnSync;
var spawn = require('child_process').spawn;
var toSpawnArgs = require('object-to-spawn-args');
var arrayify = require('array-back');
var collectJson = require('collect-json');
var collectAll = require('collect-all');
var ExplainStream = require('./explain-stream');
var TempFile = require('./temp-file');

exports.explainSync = explainSync;
exports.explain = explain;
exports.createExplainStream = createExplainStream;
exports.renderSync = renderSync;

var jsdocPath = walkBack(path.join(__dirname, '..'), path.join('node_modules', 'jsdoc-75lb', 'jsdoc.js'));

function explainSync(options) {
  options = Object.assign({}, options);
  options.files = arrayify(options.files);
  assert.ok(options.files.length || options.source, 'Must set either .files or .source');

  var tempFile = null;
  if (options.source) tempFile = new TempFile(options.source);

  var jsdocOptions = Object.assign({}, options);
  delete jsdocOptions.files;
  delete jsdocOptions.source;

  var jsdocArgs = toSpawnArgs(jsdocOptions).concat(['-X']).concat(options.source ? tempFile.path : options.files);

  var result = spawnSync(jsdocPath, jsdocArgs);
  if (tempFile) tempFile.delete();
  return JSON.parse(result.stdout);
}

function explain(options) {
  options = Object.assign({ files: [] }, options);
  options.files = arrayify(options.files);
  assert.ok(options.files.length || options.source, 'Must set either .files or .source');

  var tempFile = null;
  if (options.source) tempFile = new TempFile(options.source);

  var jsdocOptions = Object.assign({}, options);
  delete jsdocOptions.files;
  delete jsdocOptions.source;

  var jsdocArgs = toSpawnArgs(jsdocOptions).concat(['-X']).concat(options.source ? tempFile.path : options.files);

  var jsdocOutput = {
    stdout: '',
    stderr: '',
    collectInto: function collectInto(dest) {
      var _this = this;

      return collectAll(function (data) {
        return _this[dest] = data.toString();
      });
    }
  };

  return new Promise(function (resolve, reject) {
    var handle = spawn(jsdocPath, jsdocArgs);
    handle.stderr.pipe(jsdocOutput.collectInto('stderr'));
    handle.stdout.pipe(jsdocOutput.collectInto('stdout'));

    handle.on('close', function (code) {

      if (code) {
        var err = new Error(jsdocOutput.stderr.trim());
        err.name = 'INVALID_FILES';
        reject(err);
      } else {
        if (code === 0 && /There are no input files to process/.test(jsdocOutput.stdout)) {
          var err = new Error('There are no input files to process');
          err.name = 'INVALID_FILES';
          reject(err);
        } else {
          resolve(JSON.parse(jsdocOutput.stdout));
        }
      }
      if (tempFile) tempFile.delete();
    });
  });
}

function createExplainStream(options) {
  return new ExplainStream(explain, options);
}

function renderSync(files, options) {
  var args = toSpawnArgs(options).concat(arrayify(files));
  spawnSync(jsdocPath, args);
}