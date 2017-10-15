'use strict';

exports.__esModule = true;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _double = require('./double');

var _double2 = _interopRequireDefault(_double);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DoubleArray {
  constructor(val = []) {
    this._prefix = 'dba!';
    if (typeof val === 'string' && val.indexOf(this._prefix) === 0) this.fromJSON(val);else {
      _assert2.default.ok(Array.isArray(val), 'DoubleArray value must be type array');
      this._values = val.map(function (v) {
        return (0, _double2.default)(v);
      });
    }
  }

  add(val, index = undefined) {
    _assert2.default.ok(val instanceof _double2.default, 'DoubleArray value must be type Double');
    if (typeof index === 'undefined') index = this._values.length;else {
      _assert2.default.equal(typeof index, 'number', 'DoubleArray index must be type number');
      _assert2.default.ok(Math.abs(index) <= this._values.length, 'DoubleArray index out of bounds');
    }
    if (index < 0) index = this._values.length + index;
    if (index === 0) this._values.unshift(val);
    if (index === this._values.length) this._values.push(val);
    return this._values.length;
  }
  at(index, val = undefined) {
    _assert2.default.equal(typeof index, 'number', 'DoubleArray index must be type number');
    _assert2.default.ok(Math.abs(index) < this._values.length, 'DoubleArray index out of bounds');
    if (index < 0) index = this._values.length + index;
    if (typeof val === 'undefined') return this._values[index];else {
      _assert2.default.ok(val instanceof _double2.default, 'DoubleArray value must be type Double');
      this._values[index] = val;
    }
  }

  get all() {
    return this._values;
  }
  get first() {
    return this._values.length > 0 ? this._values[0] : undefined;
  }
  get last() {
    return this._values.length > 0 ? this._values[this._values.length - 1] : undefined;
  }
  get size() {
    return this._values.length;
  }

  toJSON() {
    return `${this._prefix}!${this._values.map(v => {
      return v.toString();
    }).join('!')}}`;
  }
  fromJSON(val) {
    const parts = val.replace(this._prefix, '').split('!');
    this._values = parts.map(function (part) {
      return (0, _double2.default)(part);
    });
  }
}

exports.default = DoubleArray;