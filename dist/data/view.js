'use strict';

exports.__esModule = true;

var _fragment = require('./fragment');

var _fragment2 = _interopRequireDefault(_fragment);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _slug = require('slug');

var _slug2 = _interopRequireDefault(_slug);

var _fs = require('mz/fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _lmdb = require('../output/lmdb');

var _lmdb2 = _interopRequireDefault(_lmdb);

var _dataError = require('./data-error');

var _dataError2 = _interopRequireDefault(_dataError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class View {
  constructor(config = {}, basepath = undefined) {
    this._dirty = false;
    this._db = undefined;
    this._basepath = basepath;
    this._config = Object.assign({
      id: undefined,
      meta: {},
      layout: [],
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

  init() {
    const _view = this;
    let data = {},
        paths = {};
    return this._configureLayoutChildren(data, this._config.layout, paths).then(res => {
      _view._data = res.data;
      _view._paths = res.paths;
      if (!this.meta.created) {
        _view._dirty = true;
        _view.meta.created = (0, _moment2.default)();
        _view._config.id = (0, _v2.default)();
      }
      return _view;
    });
  }

  open() {
    if (this._hasStorage()) {
      this._db = new _lmdb2.default();
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

  _hasStorage() {
    return this._basepath && this._config.storage;
  }
  _configureLayoutChildren(data, children, paths, parentPath = '') {
    return _bluebird2.default.each(children, entry => {
      if (!this.meta.created) {
        if (this._hasStorage()) entry.id = this._db.createDb(entry.id, false);else entry.id = (0, _v2.default)();
      } else {
        if (this._hasStorage) this._db.openDb(entry.id);
      }
      entry.slug = (0, _slug2.default)(entry.title || entry.id);
      let currentPath = `${parentPath}/${entry.slug}`;
      paths[currentPath] = entry.id;
      return _bluebird2.default.resolve().then(() => {
        if (Array.isArray(entry.children) && entry.children.length) {
          return this._configureLayoutChildren(data, entry.children, paths, `${currentPath}`);
        }
        return { data, paths };
      }).then(res => {
        res.data[entry.id] = new _fragment2.default(entry);
        return res;
      });
    }).then(() => {
      return { data, paths };
    });
  }

  static load(filepath) {
    _assert2.default.equal(typeof filepath, 'string', _dataError2.default.messages[_dataError2.default.types.BAD_PARAMS]);
    return _fs2.default.readFile(_path2.default.resolve(filepath)).then(data => {
      const view = new View(JSON.parse(data), _path2.default.dirname(filepath));
      return view;
    });
  }

  static save(filepath, view) {
    _assert2.default.equal(typeof filepath, 'string', _dataError2.default.messages[_dataError2.default.types.BAD_PARAMS]);
    const file = _path2.default.join(filepath, `${view._config.id}.json`);
    return _fs2.default.writeFile(file, view.toJSON()).then(() => {
      view._dirty = false;
      return view;
    });
  }
}

exports.default = View;