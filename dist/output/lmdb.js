'use strict';

exports.__esModule = true;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _nodeLmdb = require('node-lmdb');

var _nodeLmdb2 = _interopRequireDefault(_nodeLmdb);

var _util = require('../util');

var _big = require('big.js');

var _big2 = _interopRequireDefault(_big);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const msgs = {
  env_exists: 'Environment already initialized',
  bad_arg: 'Bad argument type',
  no_dbi: 'Database not opened',
  no_cursor: 'Cursor not initialized',
  no_meta: 'No metadata',
  no_txn: 'Must pass transaction'
};

class LMDB {
  constructor() {
    this._env = undefined;
    this._meta = {};
  }
  openEnv(filename, maxSizeGb = 4, maxDbs = 1) {
    _assert2.default.equal(typeof this._env, 'undefined', msgs.env_exists);
    _assert2.default.equal(typeof filename, 'string', msgs.bad_arg);
    _assert2.default.equal(typeof maxSizeGb, 'number', msgs.bad_arg);
    _assert2.default.equal(typeof maxDbs, 'number', msgs.bad_arg);
    _assert2.default.ok(Number.isInteger(maxDbs), msgs.bad_arg);

    this._filename = filename;
    if (!_fs2.default.existsSync(this._filename)) {
      _fs2.default.mkdirSync(this._filename);
    } else {
      this.loadMeta();
    }

    this._env = new _nodeLmdb2.default.Env();
    this._env.open({
      path: filename,
      mapSize: Math.round(maxSizeGb * Math.pow(1024, 3)),
      maxDbs: maxDbs
    });
  }
  createDb(meta = {}, store = true) {
    _assert2.default.notEqual(typeof meta, 'undefined', msgs.bad_arg);
    const dbId = (0, _v2.default)();
    this._meta[dbId] = { meta };
    this._meta[dbId].dbi = this._env.openDbi({
      name: dbId,
      create: true
    });
    if (store) this.storeMeta();
    return dbId;
  }
  openDb(dbId) {
    _assert2.default.equal(typeof dbId, 'string', msgs.bad_arg);
    if (!this._meta[dbId].dbi) {
      this._meta[dbId].dbi = this._env.openDbi({
        name: dbId
      });
    }
  }
  beginTxn(readOnly = false) {
    return this._env.beginTxn({ readOnly });
  }
  endTxn(txn, commit = true) {
    if (commit) {
      return txn.commit();
    }
    txn.abort();
  }
  put(txn, dbId, key, data) {
    _assert2.default.notEqual(typeof txn, 'undefined', msgs.no_txn);
    _assert2.default.notEqual(typeof this._meta[dbId].dbi, 'undefined', msgs.no_dbi);
    _assert2.default.equal(typeof key, 'string', msgs.bad_arg);
    txn.putBinary(this._meta[dbId].dbi, key, data);
  }
  initCursor(txn, dbId, positionKey = undefined) {
    _assert2.default.notEqual(typeof txn, 'undefined', msgs.no_txn);
    _assert2.default.notEqual(typeof this._meta[dbId].dbi, 'undefined');
    if (!this._meta[dbId].cursor) {
      const obj = new _nodeLmdb2.default.Cursor(txn, this._meta[dbId].dbi);
      this._meta[dbId].cursor = {
        obj,
        key: null,
        nextKey: null
      };
    }
    if (positionKey) {
      // TODO: implement alternate start position
    }
    this._meta[dbId].cursor.key = this._meta[dbId].cursor.obj.goToFirst();
    this._meta[dbId].cursor.nextKey = this._meta[dbId].cursor.obj.goToNext();
  }
  advanceCursor(dbId, loop = true) {
    _assert2.default.notEqual(typeof this._meta[dbId].cursor, 'undefined', msgs.no_cursor);
    if (!this._meta[dbId].cursor.nextKey && loop) {
      this._meta[dbId].cursor.nextKey = this._meta[dbId].cursor.obj.goToFirst();
    }
    this._meta[dbId].cursor.key = this._meta[dbId].cursor.nextKey;
    this._meta[dbId].cursor.nextKey = this._meta[dbId].cursor.obj.goToNext();
  }
  getCursorRaw(txn, dbId) {
    _assert2.default.notEqual(typeof txn, 'undefined', msgs.no_txn);
    _assert2.default.notEqual(typeof this._meta[dbId].cursor, 'undefined', msgs.no_cursor);
    if (!this._meta[dbId].cursor.key) {
      return null;
    }
    return {
      key: this._meta[dbId].cursor.key,
      buffer: txn.getBinary(this._meta[dbId].dbi, this._meta[dbId].cursor.key)
    };
  }
  getCursorData(txn, dbId, parseKey = false) {
    _assert2.default.notEqual(typeof txn, 'undefined', msgs.no_txn);
    _assert2.default.notEqual(typeof this._meta[dbId].cursor, 'undefined', msgs.no_cursor);
    const res = this.getCursorRaw(txn, dbId);
    if (!res) {
      return null;
    }
    let data = res.buffer.slice(res.buffer.byteOffset, res.buffer.byteOffset + res.buffer.byteLength);
    switch (this._meta[dbId].meta.type) {
      case LMDB.TYPES.FLOAT32:
        data = new Float32Array(data, data.byteOffset, data.byteLength / Float32Array.BYTES_PER_ELEMENT);
        break;
      default:
        data = new Float64Array(data, data.byteOffset, data.byteLength / Float64Array.BYTES_PER_ELEMENT);
    }
    if (this._meta[dbId].cursor.key) {
      return {
        key: parseKey ? LMDB.parseKey(this._meta[dbId].cursor.key) : this._meta[dbId].cursor.key,
        data
      };
    }
  }
  loadMeta() {
    if (_fs2.default.existsSync(_path2.default.join(this._filename, 'meta.json'))) {
      this.meta = JSON.parse(_fs2.default.readFileSync(_path2.default.join(this._filename, 'meta.json')));
    }
  }
  storeMeta() {
    _assert2.default.notEqual(typeof this._meta, 'undefined', msgs.no_meta);
    _assert2.default.ok(this.dbIds.length > 0, msgs.no_meta);
    _fs2.default.writeFileSync(_path2.default.join(this._filename, 'meta.json'), JSON.stringify(this.meta, null, 2));
  }
  close() {
    for (let id of this.dbIds) {
      if (this._meta[id].dbi) {
        this._meta[id].dbi.close();
      }
    }
    this._env.close();
  }
  get env() {
    return this._env;
  }
  set env(filename) {
    _assert2.default.equal(typeof filename, 'string', msgs.bad_arg);
    this.openEnv(filename);
  }
  get meta() {
    const ctx = this,
          meta = {};
    Object.keys(this._meta).forEach(key => {
      if (ctx._meta[key].meta) {
        meta[key] = Object.assign({}, ctx._meta[key].meta);
      }
    });
    return meta;
  }
  set meta(meta) {
    const ctx = this;
    for (let id of this.dbIds) {
      if (this._meta[id].cursor) {
        this._meta[id].cursor.close();
      }
      if (this._meta[id].dbi) {
        this._meta[id].dbi.close();
      }
    }
    this._meta = {};
    Object.keys(meta).forEach(key => {
      if (meta[key] instanceof Object) ctx._meta[key] = { meta: Object.assign({}, meta[key]) };
    });
  }
  get dbIds() {
    return Object.keys(this._meta);
  }
  set dbIds(val) {
    /* ignored */
  }
  static stringKeyFromFloat(value, length = 16, precision = 6, signed = true) {
    const fixed = (0, _big2.default)(Math.abs(value)).toFixed(precision);
    let prefix = '';
    if (signed) {
      prefix = Math.sign(value) > 0 ? '+' : '-';
    }
    return prefix + (0, _util.padString)(fixed, length - prefix.length, '0', true);
  }
  static parseKey(key) {
    if (key && key[0] === '+') key = key.substr(1);
    return (0, _big2.default)(key);
  }
  static get TYPES() {
    return {
      FLOAT64: 0,
      FLOAT32: 1
    };
  }
}

exports.default = LMDB;