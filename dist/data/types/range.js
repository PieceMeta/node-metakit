'use strict';

exports.__esModule = true;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _double = require('./double');

var _double2 = _interopRequireDefault(_double);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Range {
  constructor(val = undefined) {
    this._prefix = 'rng!';
    if (typeof val === 'string') this.fromJSON(val);else {
      _assert2.default.ok(val instanceof _double2.default, 'Range value must be type Double');
      this._low = this._high = val;
    }
  }
  update(val) {
    _assert2.default.ok(val instanceof _double2.default, 'Range value must be type Double');
    if (this.low.gt(val)) this._low = val;
    if (this.high.lt(val)) this._high = val;
  }

  get low() {
    return this._low;
  }
  get high() {
    return this._high;
  }

  toJSON() {
    return `${this._prefix}!${this.low.toString()}!${this.high.toString()}`;
  }
  fromJSON(val) {
    const parts = val.split('!');
    _assert2.default.equal(parts.length, 3, 'Invalid string for Range resurrection');
    _assert2.default.equal(parts.shift(), this._prefix, 'Wrong prefix for Range resurrection');
    this._low = (0, _double2.default)(parts[0]);
    this._high = (0, _double2.default)(parts[1]);
  }
}

exports.default = Range;