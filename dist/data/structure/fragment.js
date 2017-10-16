'use strict';

exports.__esModule = true;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _index = require('../index');

var _messaging = require('../../messaging');

var _types = require('../types');

var types = _interopRequireWildcard(_types);

var _util = require('../util');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Fragment extends _messaging.Emitter {
  constructor(config = {}) {
    super();

    this._time = undefined;
    this._value = undefined;
    this._config = undefined;

    this.init(Object.assign({}, config));
  }

  update(value, time = undefined, copy = false) {
    this.time = time || types.make(types.MKT_TIMESTAMP);
    this._key = util.keyFromDouble(time);

    switch (this._config.type) {
      case types.MKT_DOUBLE_MATRIX:
        if (value instanceof ArrayBuffer) {
          _assert2.default.equal(value.length, this._value.data.length);
          this._value.data = copy ? util.copyBuffer(value) : value;
        } else {
          _assert2.default.equal(value.constructor.name, 'Matrix');
          _assert2.default.equal(value.type, this._value.type);
          this._value.data = copy ? util.copyBuffer(value.data) : value.data;
        }
        break;
      case types.MKT_DOUBLE_VECTOR:
        if (value instanceof ArrayBuffer) {
          _assert2.default.equal(value.length, this._value.data.length);
          this._value.data = copy ? util.copyBuffer(value) : value;
        } else {
          _assert2.default.equal(value.constructor.name, 'Vector');
          _assert2.default.equal(value.type, this._value.type);
          _assert2.default.equal(value.data.length, this._value.data.length);
          this._value.data = copy ? util.copyBuffer(value.data) : value.data;
        }
        break;
      case types.MKT_DOUBLE_ARRAY:
        if (value instanceof Float64Array) {
          _assert2.default.equal(value.length, this._value.length);
          this._value = copy ? util.copyBuffer(value) : value;
        }
        break;
      default:
        throw new _index.DataError(_index.DataError.types.INVALID_TYPE);
    }
    this.emit('update');
  }

  get time() {
    return this._time;
  }
  set time(val) {
    this._time = val ? types.make(types.MKT_TIMESTAMP, val) : undefined;
  }
  get key() {
    return this._key;
  }
  get value() {
    return this._value;
  }
  get bytes() {
    return this._value ? this._value.data.byteLength : 0;
  }

  toJSON() {
    return JSON.stringify(this._config, null, '\t');
  }
  toString() {
    return this.toJSON();
  }

  init(config) {
    this._value = types.make(config.type, config);
    this._config = config;
  }
}

exports.default = Fragment;