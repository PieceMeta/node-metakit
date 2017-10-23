'use strict';

exports.__esModule = true;

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('mz/fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _messaging = require('../../messaging');

var _index = require('../index');

var _index2 = require('./index');

var _file = require('../../io/file');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class View extends _messaging.Emitter {
  constructor(config = {}, basepath = undefined) {
    super();
    this._dirty = false;
    this._db = undefined;
    this._basepath = basepath;
    this._config = Object.assign({
      id: undefined,
      meta: {},
      layout: null,
      storage: {
        type: 'lmdb',
        mapsize: 4096
      },
      key: {
        length: 16,
        precision: 6,
        signed: true
      }
    }, config);
  }

  init(layoutPath = undefined, create = false) {
    const _view = this;
    return _bluebird2.default.resolve().then(() => {
      if (typeof layoutPath !== 'string' || create === true) return new _index2.Layout();
      return _index2.Layout.fromFile(layoutPath);
    }).then(layout => {
      return layout.configureLayoutChildren();
    }).then(layout => {
      if (layout.dirty === true) return layout.store(layoutPath);
      return layout;
    }).then(layout => {
      _view._config.layout = layout;
      if (!_view.meta.created) {
        _view._dirty = true;
        _view.meta.created = (0, _moment2.default)();
        _view._config.id = (0, _v2.default)();
      }
      return _view;
    });
  }

  open() {
    if (this._hasStorage()) {
      this._db = new _file.LMDB();
      this._db.openEnv(this._basepath, this._config.storage.mapsize / 1024, this._config.layout.length);
    }
    return _bluebird2.default.resolve();
  }

  close() {
    if (this._hasStorage()) {
      this._db.close();
    }
  }

  get id() {
    return this._config.id;
  }
  get layout() {
    return this._config.layout || {};
  }
  get meta() {
    return this._config.meta || {};
  }
  get bytes() {
    const config = this._config;
    return this._data ? Object.keys(this._data).reduce((sum, val) => {
      return sum + this._data[val].bytes;
    }, 0) + config.key.length : 0;
  }
  get hasStorage() {
    return this._basepath && this._config.storage;
  }

  fragmentById(id) {
    return this._data[id];
  }
  fragmentsByPath(path, exact = false) {
    if (exact) return this._data[this._paths[path]];
    return Object.keys(this._paths).filter(p => {
      return p.indexOf(path) > -1;
    }).map(p => {
      return this._data[this._paths[p]];
    });
  }

  toJSON() {
    return JSON.stringify(this._config, null, '\t');
  }
  toString() {
    return this.toJSON();
  }

  store(filepath) {
    _assert2.default.equal(typeof filepath, 'string', _index.DataError.messages[_index.DataError.types.BAD_PARAMS]);
    const _ctx = this,
          file = _path2.default.join(filepath, `${this._config.id}.json`);
    return _file.JSONFile.save(file, this.toJSON()).then(() => {
      _ctx._dirty = false;
      return _ctx;
    });
  }

  static fromFile(filepath) {
    _assert2.default.equal(typeof filepath, 'string', _index.DataError.messages[_index.DataError.types.BAD_PARAMS]);
    return _fs2.default.readFile(_path2.default.resolve(filepath)).then(data => {
      return new View(JSON.parse(data), _path2.default.dirname(filepath));
    });
  }
}

exports.default = View;