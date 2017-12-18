'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _index = require('../index');

var _file = require('../../io/file');

var _view = require('./view');

var _view2 = _interopRequireDefault(_view);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultConfig = {
  id: undefined,
  views: []
};

class Package extends _file.JSONFile {
  constructor(filepath = null, config = {}) {
    super(filepath);
    this._dirty = false;
    this._config = Object.assign(super.config || {}, defaultConfig);
    this._config = Object.assign(this._config, config);
    if (!this._config.id) this._config.id = (0, _v2.default)();
  }

  addView(layout) {
    _assert2.default.equal(typeof this._filepath, 'string', _index.DataError.messages[_index.DataError.types.BAD_PARAMS]);
    const views = this._config.views;
    return new _view2.default(layout).init().then(v => {
      views.push(v);
      this._dirty = true;
      return v.id;
    });
  }
  getViewById(id) {
    const view = this.views.find(view => {
      return view.id === id;
    });
    return new _bluebird2.default(resolve => {
      resolve(view);
    });
  }

  get id() {
    return this._config.id;
  }
  set id(val) {
    this._config.id = val;
  }
  get meta() {
    return this._config.meta;
  }
  set meta(val) {
    _assert2.default.equal(typeof val, 'object');
    this._config.meta = Object.assign(this._config.meta, val);
    this._dirty = true;
  }
  get views() {
    return this._config.views;
  }
  set views(val) {
    this._config.views = val;
  }
  get isDirty() {
    return this._dirty === true;
  }
  set isDirty(val) {
    this._dirty = val;
  }

  toJSON() {
    const conf = Object.assign({}, this._config);
    conf.views = conf.views.map(view => {
      return view._config.id;
    });
    return JSON.stringify(conf, null, '\t');
  }
  toString() {
    return this.toJSON();
  }

  load(filepath) {
    _assert2.default.equal(typeof filepath, 'string');
    return super.load(_path2.default.join(filepath, 'index.json')).then(config => {
      return new Package(filepath, config);
    });
  }
  save(filepath) {
    const _ctx = this;
    return super.save(_path2.default.join(filepath, 'index.json'), true).then(() => {
      return _bluebird2.default.each(_ctx.views, view => view.store(filepath));
    });
  }
  close() {
    return _bluebird2.default.each(this.views, view => view.close());
  }
}

exports.default = Package;
module.exports = exports['default'];