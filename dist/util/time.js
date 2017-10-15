'use strict';

exports.__esModule = true;

var _microtime = require('microtime');

var _microtime2 = _interopRequireDefault(_microtime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Time {
  static get microtime() {
    return _microtime2.default.now();
  }
}

exports.default = Time;