'use strict';

exports.__esModule = true;

var _tinyEmitter = require('tiny-emitter');

var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _vectorious = require('vectorious');

var _vectorious2 = _interopRequireDefault(_vectorious);

var _big = require('big.js');

var _big2 = _interopRequireDefault(_big);

var _microtime = require('microtime');

var _microtime2 = _interopRequireDefault(_microtime);

var _util = require('../util');

var _dataTypes = require('./data-types');

var _dataTypes2 = _interopRequireDefault(_dataTypes);

var _dataError = require('./data-error');

var _dataError2 = _interopRequireDefault(_dataError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Fragment extends _tinyEmitter2.default {
  constructor(config = {}) {
    super();

    this._time = undefined;
    this._value = undefined;
    this._config = undefined;

    this.init(Object.assign({}, config));
  }

  update(value, time = undefined, copy = false) {
    this.time = time || _microtime2.default.nowDouble();
    this._key = Fragment.getKeyFromDouble(_microtime2.default.nowDouble());

    switch (this._config.type) {
      case _dataTypes2.default.TYPE_FLOAT64_MATRIX:
        if (value instanceof ArrayBuffer) {
          _assert2.default.equal(value.length, this._value.data.length);
          this._value.data = copy ? Fragment.copyBuffer(value) : value;
        } else {
          (0, _assert2.default)(value instanceof _vectorious2.default.Matrix);
          _assert2.default.equal(value.type, this._value.type);
          this._value.data = copy ? Fragment.copyBuffer(value.data) : value.data;
        }
        break;
      case _dataTypes2.default.TYPE_FLOAT64_VECTOR:
        if (value instanceof ArrayBuffer) {
          _assert2.default.equal(value.length, this._value.data.length);
          this._value.data = copy ? Fragment.copyBuffer(value) : value;
        } else {
          (0, _assert2.default)(value instanceof _vectorious2.default.Vector);
          _assert2.default.equal(value.type, this._value.type);
          _assert2.default.equal(value.data.length, this._value.data.length);
          this._value.data = copy ? Fragment.copyBuffer(value.data) : value.data;
        }
        break;
      case _dataTypes2.default.TYPE_FLOAT64_ARRAY:
        if (value instanceof Float64Array) {
          _assert2.default.equal(value.length, this._value.length);
          this._value = copy ? Fragment.copyBuffer(value) : value;
        }
        break;
      default:
        throw new _dataError2.default(_dataError2.default.types.INVALID_TYPE);
    }
    this.emit('update');
  }

  get time() {
    return this._time;
  }
  set time(val) {
    this._time = val ? new _big2.default(val) : undefined;
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
    (0, _assert2.default)(config.type >= 0, _dataError2.default.messages[_dataError2.default.types.INVALID_TYPE]);
    switch (config.type) {
      case _dataTypes2.default.TYPE_FLOAT64_MATRIX:
        (0, _assert2.default)(Array.isArray(config.shape), _dataError2.default.messages[_dataError2.default.types.BAD_PARAMS]);
        this._value = new _vectorious2.default.Matrix(config.shape);
        break;
      case _dataTypes2.default.TYPE_FLOAT64_VECTOR:
        this._value = new _vectorious2.default.Vector();
        break;
      case _dataTypes2.default.TYPE_FLOAT64_ARRAY:
        (0, _assert2.default)(typeof config.shape === 'number', _dataError2.default.messages[_dataError2.default.types.BAD_PARAMS]);
        this._value = new Float64Array(config.shape);
        break;
      default:
        throw new _dataError2.default(_dataError2.default.types.INVALID_TYPE);
    }
    this._config = config;
  }

  static copyBuffer(source) {
    let buffer = new ArrayBuffer(source.byteLength);
    new Uint8Array(buffer).set(new Uint8Array(source));
    return buffer;
  }
  static getKeyFromDouble(value, length = 16, precision = 6, signed = true) {
    const fixed = (0, _big2.default)(Math.abs(value)).toFixed(precision);
    let prefix = '';
    if (signed) prefix = Math.sign(value) > 0 ? '+' : '-';
    return prefix + (0, _util.padString)(fixed, length - prefix.length, '0', true);
  }
  static keyToDouble(key) {
    if (typeof key === 'string' && key[0] === '+') key = key.substr(1);
    return key ? (0, _big2.default)(key) : undefined;
  }
}

exports.default = Fragment;