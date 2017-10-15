'use strict';

exports.__esModule = true;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Logger {
  static log(msg) {
    process.stdout.write(msg);
  }
  static error(msg) {
    process.stderr.write(msg);
  }
  static debug(msg, module = 'mtk') {
    (0, _debug2.default)(module)(msg);
  }
}

exports.default = Logger;