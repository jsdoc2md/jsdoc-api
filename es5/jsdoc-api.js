'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Duplex = require('stream').Duplex;
var path = require('path');
var fs = require('fs');
var walkBack = require('walk-back');
var spawnSync = require('child_process').spawnSync;
var spawn = require('child_process').spawn;
var getTempPath = require('temp-path');
var toSpawnArgs = require('object-to-spawn-args');
var arrayify = require('array-back');
var collectJson = require('collect-json');
var collectAll = require('collect-all');

exports.explainSync = explainSync;
exports.explain = explain;
exports.createExplainStream = createExplainStream;
exports.renderSync = renderSync;

var jsdocPath = walkBack(path.join(__dirname, '..'), path.join('node_modules', 'jsdoc-75lb', 'jsdoc.js'));

function explainSync(files, options) {
  var args = ['-X'].concat(arrayify(files));
  var result = spawnSync(jsdocPath, args);
  return JSON.parse(result.stdout);
}

explainSync.source = function explainSyncSource(source) {
  var tempFile = new TempFile(source);
  var args = ['-X'].concat(tempFile.path);
  var result = spawnSync(jsdocPath, args);
  tempFile.delete();
  return JSON.parse(result.stdout);
};

function explain(files, options) {
  return new Promise(function (resolve, reject) {
    var jsdocArgs = toSpawnArgs(options).concat(['-X']).concat(arrayify(files));
    var output = {
      stdout: '',
      stderr: ''
    };

    var handle = spawn(jsdocPath, jsdocArgs);
    handle.on('error', function (err) {
      return reject(err);
    }).stdout.pipe(collectJson(function (data) {
      output.stdout = data;
    })).on('error', function (err) {
      if (/no input files/.test(err.message)) {
        var invalidErr = new Error('Invalid input files [' + files + ']');
        invalidErr.name = 'INVALID_FILES';
        reject(invalidErr);
      } else {
        reject(err);
      }
    });
    handle.stderr.pipe(collectAll(function (text) {
      output.stderr = text;
    })).on('error', function (err) {
      return reject(err);
    });
    handle.on('close', function (code) {
      if (code) {
        reject(output.stderr);
      } else {
        resolve(output.stdout);
      }
    });
  });
}

explain.source = function explainSource(source) {
  var tempFile = new TempFile(source);
  return new Promise(function (resolve, reject) {
    spawn(jsdocPath, ['-X'].concat(tempFile.path)).on('error', function (err) {
      return reject(err);
    }).stdout.pipe(collectJson(function (data) {
      resolve(data);
      tempFile.delete();
    }));
  });
};

function createExplainStream(files, options) {
  return new ExplainStream(files, options);
}

function renderSync(files, options) {
  var args = toSpawnArgs(options).concat(arrayify(files));
  spawnSync(jsdocPath, args);
}

renderSync.source = function renderSyncSource(source, options) {
  var tempFile = new TempFile(source);
  var args = toSpawnArgs(options).concat(tempFile.path);
  spawnSync(jsdocPath, args);
  tempFile.delete();
};

var TempFile = (function () {
  function TempFile(source) {
    _classCallCheck(this, TempFile);

    this.path = getTempPath() + '.js';
    fs.writeFileSync(this.path, source);
  }

  _createClass(TempFile, [{
    key: 'delete',
    value: function _delete() {
      fs.unlinkSync(this.path);
    }
  }]);

  return TempFile;
})();

var ExplainStream = (function (_Duplex) {
  _inherits(ExplainStream, _Duplex);

  function ExplainStream(options) {
    _classCallCheck(this, ExplainStream);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ExplainStream).call(this));

    options = options || {};
    _this.files = arrayify(options.files);
    delete options.files;
    _this.options = options;

    _this.on('pipe', function (src) {
      if (!(_this.inProgress || options.files || options.source)) {
        src.pipe(collectAll(function (source) {
          explain.source(source, _this.options).then(function (output) {
            _this.push(JSON.stringify(output, null, '  '));
            _this.push(null);
            _this.inProgress = false;
          }).catch(function (err) {
            return _this.emit('error', err);
          });
          _this.inProgress = true;
        }));
      }
    });
    return _this;
  }

  _createClass(ExplainStream, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      explain(this.files, this.options).then(function (output) {
        _this2.push(JSON.stringify(output, null, '  '));
        _this2.push(null);
        _this2.inProgress = false;
      }).catch(function (err) {
        return _this2.emit('error', err);
      });
      this.inProgress = true;
    }
  }, {
    key: '_read',
    value: function _read() {
      if (!this.inProgress && this.files.length) {
        this.start();
      }
    }
  }, {
    key: '_write',
    value: function _write(chunk, encoding, done) {
      done();
    }
  }]);

  return ExplainStream;
})(Duplex);