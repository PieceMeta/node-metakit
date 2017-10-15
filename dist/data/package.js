'use strict';

exports.__esModule = true;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _fs = require('mz/fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _view = require('./view');

var _view2 = _interopRequireDefault(_view);

var _dataError = require('./data-error');

var _dataError2 = _interopRequireDefault(_dataError);

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
    _assert2.default.equal(typeof this._filepath, 'string', _dataError2.default.messages[_dataError2.default.types.BAD_PARAMS]);
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
  get dirty() {
    return this._dirty;
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

  close() {
    return _bluebird2.default.each(this.views, view => view.close());
  }

  static load(filepath) {
    return _fs2.default.readFile(_path2.default.join(filepath, 'index.json')).then(data => JSON.parse(data)).then(config => new Package(filepath, config)).then(pkg => {
      return _bluebird2.default.map(pkg.views, id => _view2.default.load(_path2.default.join(filepath, `${id}.json`))).then(views => {
        pkg._config.views = views;
        return pkg;
      });
    });
  }
  static save(pkgpath, pkginstance) {
    return _bluebird2.default.resolve().then(() => {
      return _fs2.default.mkdir(pkgpath).catch(err => {
        if (err.code !== 'EEXIST') throw err;
      });
    }).then(() => {
      return _bluebird2.default.each(pkginstance.views, view => {
        return _view2.default.save(pkginstance._filepath, view);
      });
    }).then(() => {
      pkginstance.meta.updated = (0, _moment2.default)();
      const configpath = _path2.default.join(_path2.default.resolve(pkgpath), 'index.json');
      return _fs2.default.writeFile(configpath, pkginstance.toJSON()).then(() => {
        pkginstance._dirty = false;
      });
    });
  }
}

exports.default = Package;