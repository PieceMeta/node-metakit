'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _tinyEmitter = require('tiny-emitter');

var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('mz/fs');

var _fs2 = _interopRequireDefault(_fs);

var _mkdirpPromise = require('mkdirp-promise');

var _mkdirpPromise2 = _interopRequireDefault(_mkdirpPromise);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _writeFileAtomic = require('write-file-atomic');

var _writeFileAtomic2 = _interopRequireDefault(_writeFileAtomic);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BaseFile extends _tinyEmitter2.default {
  constructor(config = {}, data = undefined) {
    super();

    const defaultConfig = {
      meta: {},
      opts: {
        atomic: true,
        ext: undefined
      }
    };

    this._config = Object.assign({}, defaultConfig);
    if (typeof config === 'object') this._config = Object.assign(this._config, config);
    this._data = data;
  }

  load(filepath) {
    const _ctx = this;
    return _fs2.default.readFile(_path2.default.resolve(filepath)).then(data => _ctx._decoder(data)).then(data => Object.assign(_ctx, data)).catch(err => {
      throw err;
    });
  }

  save(filepath, createPath = true) {
    const _ctx = this;
    filepath = _path2.default.resolve(filepath);
    return _bluebird2.default.resolve().then(() => {
      if (createPath === true) {
        return (0, _mkdirpPromise2.default)(_path2.default.dirname(filepath)).catch(err => {
          console.log(err);
        });
      }
    }).then(() => {
      const fp = filepath;
      filepath = _path2.default.join(_path2.default.dirname(fp), `${_path2.default.basename(fp, _ctx._config.opts.ext)}${_ctx._config.opts.ext || ''}`);

      if (_ctx._config.meta) {
        const now = (0, _moment2.default)();
        if (!_ctx._config.meta.created) _ctx._config.meta.created = now;
        _ctx._config.meta.updated = now;
      }

      return _ctx;
    }).then(data => _ctx._encoder(_ctx)).then(data => {
      return _bluebird2.default.promisify(_writeFileAtomic2.default)(filepath, data, {});
    }).catch(err => {
      throw err;
    });
  }

  _decoder(data) {
    return _bluebird2.default.resolve(data);
  }

  _encoder(data) {
    return _bluebird2.default.resolve(data);
  }

  get config() {
    return this._config;
  }
  set config(val) {
    this._config = val;
  }
  get data() {
    return this._data;
  }
  set data(val) {
    this._data = val;
  }
  get meta() {
    return this._config.meta;
  }
  set meta(val) {
    this._config.meta = val;
  }
}

exports.default = BaseFile;
module.exports = exports['default'];