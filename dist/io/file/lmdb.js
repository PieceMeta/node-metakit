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

var _structure = require('../../data/structure');

var _double = require('../../data/types/double');

var _double2 = _interopRequireDefault(_double);

var _data = require('../../data');

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
    let out;
    if (data.buffer) {
      out = Buffer.from(data.buffer, data.byteOffset, data.byteLength - data.byteOffset);
    } else {
      out = data;
    }
    txn.putBinary(this._meta[dbId].dbi, key, out);
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
    let type;
    switch (this._meta[dbId].meta.type) {
      case _data.types.MKT_DOUBLE_ARRAY:
        type = Float64Array;
        break;
      default:
        type = Float64Array;
    }
    if (this._meta[dbId].cursor.key) {
      return {
        key: parseKey ? _double2.default.fromString(this._meta[dbId].cursor.key) : this._meta[dbId].cursor.key,
        data: new _structure.TypedBufferView(res.buffer, type, res.buffer.byteOffset, res.buffer.length)
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
  closeDb(dbId) {
    _assert2.default.equal(typeof dbId, 'string', msgs.bad_arg);
    _assert2.default.notEqual(typeof this._meta[dbId], 'undefined', msgs.no_meta);
    if (this._meta[dbId].dbi) {
      this._meta[dbId].dbi.close();
      this._meta[dbId].dbi = null;
    }
  }
  close() {
    for (let id of this.dbIds) {
      if (this._meta[id].dbi) {
        this._meta[id].dbi.close();
        this._meta[id].dbi = null;
      }
    }
    this._env.close();
    this._env = null;
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
  get cursors() {
    const cursors = {},
          _ctx = this;
    Object.keys(_ctx._meta).forEach(id => {
      cursors[id] = _ctx._meta[id].cursor;
    });
    return cursors;
  }
}

exports.default = LMDB;