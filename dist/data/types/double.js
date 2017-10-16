'use strict';

exports.__esModule = true;

var _bignumber = require('bignumber.js');

var _bignumber2 = _interopRequireDefault(_bignumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bignumber2.default.config({ ERRORS: false });

class Double extends _bignumber2.default {
  static fromString(key) {
    if (typeof key === 'string' && key[0] === '+') key = key.substr(1);
    return key ? new Double(key) : null;
  }
}

exports.default = Double;