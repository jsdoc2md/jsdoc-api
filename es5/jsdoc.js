'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('promise.prototype.finally');
var path = require('path');
var assert = require('assert');
var walkBack = require('walk-back');
var spawnSync = require('child_process').spawnSync;
var spawn = require('child_process').spawn;
var toSpawnArgs = require('object-to-spawn-args');
var arrayify = require('array-back');
var collectAll = require('collect-all');
var TempFile = require('./temp-file');
var FileSet = require('file-set');

var jsdocPath = walkBack(path.join(__dirname, '..'), path.join('node_modules', 'jsdoc-75lb', 'jsdoc.js'));

var JsdocCommand = (function () {
  function JsdocCommand(options) {
    _classCallCheck(this, JsdocCommand);

    options = options || {};
    options.files = arrayify(options.files);

    assert.ok(options.files.length || options.source, 'Must set either .files or .source');

    this.tempFile = null;
    if (options.source) this.tempFile = new TempFile(options.source);

    var jsdocOptions = Object.assign({}, options);
    delete jsdocOptions.files;
    delete jsdocOptions.source;

    this.options = options;
    this.jsdocOptions = jsdocOptions;
  }

  _createClass(JsdocCommand, [{
    key: 'execute',
    value: function execute() {
      this.expandInputPaths();
      var err = this.validateOptions();
      this.output = this.getOutput(err);
      this.cleanup();
      return this.output;
    }
  }, {
    key: 'expandInputPaths',
    value: function expandInputPaths() {
      this.inputFileSet = new FileSet(this.options.files);
    }
  }, {
    key: 'validateOptions',
    value: function validateOptions() {
      if (this.inputFileSet.notExisting.length) {
        var err = new Error('These files do not exist: ' + this.inputFileSet.notExisting);
        err.name = 'INVALID_FILES';
        return err;
      }
    }
  }, {
    key: 'cleanup',
    value: function cleanup() {
      if (this.tempFile) {
        if (this.output instanceof Promise) {
          this.output.finally(this.tempFile.delete.bind(this.tempFile));
        } else {
          this.tempFile.delete();
        }
      }
    }
  }]);

  return JsdocCommand;
})();

var JsdocExplain = (function (_JsdocCommand) {
  _inherits(JsdocExplain, _JsdocCommand);

  function JsdocExplain() {
    _classCallCheck(this, JsdocExplain);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(JsdocExplain).apply(this, arguments));
  }

  _createClass(JsdocExplain, [{
    key: 'getOutput',
    value: function getOutput(err) {
      var _this3 = this;

      if (err) return Promise.reject(err);

      return new Promise(function (resolve, reject) {
        var jsdocOutput = {
          stdout: '',
          stderr: '',
          collectInto: function collectInto(dest) {
            var _this2 = this;

            return collectAll(function (data) {
              return _this2[dest] = data.toString();
            });
          }
        };

        var jsdocArgs = toSpawnArgs(_this3.jsdocOptions).concat(['-X']).concat(_this3.options.source ? _this3.tempFile.path : _this3.inputFileSet.files);

        var handle = spawn(jsdocPath, jsdocArgs);
        handle.stderr.pipe(jsdocOutput.collectInto('stderr'));
        handle.stdout.pipe(jsdocOutput.collectInto('stdout'));

        handle.on('close', function (code) {
          if (code) {
            var _err = new Error(jsdocOutput.stderr.trim());
            _err.name = 'INVALID_FILES';
            reject(_err);
          } else {
            if (code === 0 && /There are no input files to process/.test(jsdocOutput.stdout)) {
              var _err2 = new Error('There are no input files to process');
              _err2.name = 'INVALID_FILES';
              reject(_err2);
            } else {
              resolve(JSON.parse(jsdocOutput.stdout));
            }
          }
        });
      });
    }
  }]);

  return JsdocExplain;
})(JsdocCommand);

var JsdocSync = (function (_JsdocCommand2) {
  _inherits(JsdocSync, _JsdocCommand2);

  function JsdocSync() {
    _classCallCheck(this, JsdocSync);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(JsdocSync).apply(this, arguments));
  }

  _createClass(JsdocSync, [{
    key: 'getOutput',
    value: function getOutput(err) {
      if (err) throw err;

      var jsdocArgs = toSpawnArgs(this.jsdocOptions).concat(['-X']).concat(this.options.source ? this.tempFile.path : this.inputFileSet.files);
      var result = spawnSync(jsdocPath, jsdocArgs);
      return JSON.parse(result.stdout);
    }
  }]);

  return JsdocSync;
})(JsdocCommand);

var RenderSync = (function (_JsdocCommand3) {
  _inherits(RenderSync, _JsdocCommand3);

  function RenderSync() {
    _classCallCheck(this, RenderSync);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(RenderSync).apply(this, arguments));
  }

  _createClass(RenderSync, [{
    key: 'getOutput',
    value: function getOutput(err) {
      if (err) throw err;
      var jsdocArgs = toSpawnArgs(this.jsdocOptions).concat(this.options.source ? this.tempFile.path : this.options.files);
      spawnSync(jsdocPath, jsdocArgs);
    }
  }]);

  return RenderSync;
})(JsdocCommand);

exports.Explain = JsdocExplain;
exports.ExplainSync = JsdocSync;
exports.RenderSync = RenderSync;