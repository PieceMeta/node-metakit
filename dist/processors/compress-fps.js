'use strict';

exports.__esModule = true;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _big = require('big.js');

var _big2 = _interopRequireDefault(_big);

var _baseProcessor = require('./base-processor');

var _baseProcessor2 = _interopRequireDefault(_baseProcessor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CompressFPS extends _baseProcessor2.default {
  constructor() {
    super();
    this._data = undefined;
    this._count = undefined;
    this._fps = undefined;
    this._interval = {};
  }

  interpolate(data, mode = CompressFPS.INTERPOLATE.MAX) {
    _assert2.default.notEqual(typeof data, 'undefined');
    _assert2.default.equal(Object.getPrototypeOf(Object.getPrototypeOf(data)).constructor.name, 'TypedArray');
    _assert2.default.equal(Object.getPrototypeOf(Object.getPrototypeOf(this._data)).constructor.name, 'TypedArray');
    _assert2.default.ok(Number.isInteger(mode));

    switch (mode) {
      case CompressFPS.INTERPOLATE.MAX:
        data.forEach((val, i) => {
          if (typeof this._data[i] === 'number' && Math.abs(val) > Math.abs(this._data[i])) this._data[i] = val;
        });
        break;
      case CompressFPS.INTERPOLATE.MIN:
        data.forEach((val, i) => {
          if (typeof this._data[i] === 'number' && Math.abs(val) < Math.abs(this._data[i])) this._data[i] = val;
        });
        break;
      case CompressFPS.INTERPOLATE.AVG:
        data.forEach((val, i) => {
          if (this._data[i]) this._data[i] += val;
        });
        this._count += 1;
        break;
      default:
        throw new Error(`Unknown interpolation mode: ${mode}`);
    }
  }

  get interval() {
    return this._interval;
  }
  set fps(val) {
    this._fps = (0, _big2.default)(val);
    this._interval = {
      micros: (0, _big2.default)(1000000).div(this._fps).round(0),
      millis: (0, _big2.default)(1000).div(this._fps).round(0)
    };
  }

  get data() {
    if (this.count > 1) {
      this._data.forEach((val, i) => {
        if (typeof this._data[i] === 'number') this._data[i] = (0, _big2.default)(this._data[i]).div(val);
      });
      this._count = 0;
    }
    return this._data;
  }
  set data(value) {
    _assert2.default.equal(Object.getPrototypeOf(Object.getPrototypeOf(value)).constructor.name, 'TypedArray');
    this._data = value;
    this._count = 1;
  }

  get count() {
    return this._count;
  }
  set count(value) {
    /* ignored */
  }

  static get INTERPOLATE() {
    return {
      MAX: 0,
      MIN: 0,
      AVG: 0
    };
  }
}

exports.default = CompressFPS;