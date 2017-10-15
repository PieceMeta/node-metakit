'use strict';

exports.__esModule = true;

var _big = require('big.js');

var _big2 = _interopRequireDefault(_big);

var _microtime = require('microtime');

var _microtime2 = _interopRequireDefault(_microtime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Timestamp extends _big2.default {
  constructor(value = undefined) {
    super(value || Timestamp.now());
  }
  static now() {
    return new _big2.default(_microtime2.default.nowDouble());
  }
}

exports.default = Timestamp;