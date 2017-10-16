'use strict';

exports.__esModule = true;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _index = require('../index');

var _file = require('../../io/file');

var _view = require('./view');

var _view2 = _interopRequireDefault(_view);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Package extends _file.JSONFile {
  constructor(filepath = undefined, config = {}) {
    super(filepath);
    this._dirty = false;
    this._filepath = filepath;
    this._config = Object.assign(this._config, {
      views: []
    });
    this._config = Object.assign(this._config, config);
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
    return _bluebird2.default.resolve().then(() => {
      return mkdirp(filepath).catch(err => {
        if (err.code !== 'EEXIST') throw err;
      });
    }).then(() => {
      return _file.JSONFile.save(_path2.default.join(filepath, 'index.json'), this.toJSON()).then(() => {
        return _bluebird2.default.each(_ctx.views, view => {
          return view.store(_ctx._filepath);
        });
      });
    });
  }
  close() {
    return _bluebird2.default.each(this.views, view => view.close());
  }

  static fromFile(filepath) {
    return Package.load(filepath).then(config => new Package(filepath, config)).then(pkg => {
      return _bluebird2.default.map(pkg.views, id => _view2.default.fromFile(_path2.default.join(filepath, `${id}.json`))).then(views => {
        pkg._config.views = views;
        return pkg;
      });
    });
  }
}

exports.default = Package;