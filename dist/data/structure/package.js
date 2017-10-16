'use strict';

exports.__esModule = true;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _index = require('../index');

var _view = require('./view');

var _view2 = _interopRequireDefault(_view);

var _file = require('../../io/file');

var _file2 = _interopRequireDefault(_file);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Package {
  constructor(filepath = undefined, config = {}) {
    this._dirty = false;
    this._filepath = filepath;
    this._config = Object.assign({
      id: (0, _v2.default)(),
      meta: {
        created: (0, _moment2.default)(),
        updated: undefined
      },
      views: []
    }, config);
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

  store(filepath) {
    const _ctx = this;
    return _file2.default.save(_path2.default.join(_path2.default.resolve(filepath), 'index.json'), this.toJSON()).then(() => {
      return _bluebird2.default.each(_ctx.views, view => {
        return _view2.default.save(_ctx._filepath, view);
      });
    });
  }
  close() {
    return _bluebird2.default.each(this.views, view => view.close());
  }

  static fromJSONFile(filepath) {
    return _file2.default.load(filepath).then(res => {
      return new Package(res.data);
    });
  }
}

exports.default = Package;