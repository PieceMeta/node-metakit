'use strict';

exports.__esModule = true;

var _slug = require('slug');

var _slug2 = _interopRequireDefault(_slug);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _messaging = require('../../messaging');

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Layout extends _messaging.Emitter {
  constructor(config = {}, data = undefined) {
    super();
    const defaultConfig = {
      dbs: {},
      meta: {},
      paths: {},
      fragments: [],
      basepath: null
    };
    let dbId;
    this._config = Object.assign({}, defaultConfig);
    this._config = Object.assign(this._config, config);
    if (!this._config.meta.created) {
      this._id = (0, _v2.default)();
      this._config.id = this.id;
      if (this.hasStorage === true) dbId = this._db.createDb(this.id, false);else dbId = (0, _v2.default)();
      this._config.dbs[dbId] = {
        type: 'LMDB',
        id: dbId,
        config: {}
      };
    } else {
      if (this.hasStorage === true) this._db.openDb(this.id);
    }
    if (typeof data === 'object') {
      return this.configureLayoutChildren(data);
    }
  }

  configureLayoutChildren(data, parentPath = '') {
    const _ctx = this;
    return _bluebird2.default.each(_ctx._config.fragments, fragment => {
      fragment.slug = (0, _slug2.default)(fragment.title || fragment.id);
      let currentPath = `${parentPath}/${fragment.slug}`;
      _ctx.config.paths[currentPath] = fragment.id;
      return _bluebird2.default.resolve().then(() => {
        if (Array.isArray(fragment.children) && fragment.children.length) {
          return this.configureLayoutChildren(data, `${currentPath}`);
        }
        return this;
      }).then(layout => {
        const fragment = new _index.Fragment(layout);
        _ctx.fragments[fragment.id] = fragment;
        return this;
      });
    });
  }

  get id() {
    return this._id;
  }
  get dbs() {
    return this._config.dbs;
  }
  get fragments() {
    return this._config.fragments;
  }
  get hasStorage() {
    return this._config.basepath;
  }
}

exports.default = Layout;