'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _microtime = require('microtime');

var _microtime2 = _interopRequireDefault(_microtime);

var _double = require('./double');

var _double2 = _interopRequireDefault(_double);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Timestamp extends _double2.default {
  constructor(value = undefined) {
    super(value || Timestamp.now());
  }

  static now() {
    return new Timestamp(_microtime2.default.nowDouble());
  }
  static get microtime() {
    return _microtime2.default.now();
  }
}

exports.default = Timestamp;
module.exports = exports['default'];