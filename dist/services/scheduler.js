'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nanotimer = require('nanotimer');

var _nanotimer2 = _interopRequireDefault(_nanotimer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Scheduler {
  constructor() {
    this._timer = new _nanotimer2.default();
  }
  interval(timeStr, func, args = undefined, cb = undefined) {
    this._timer.clearInterval();
    this._timer.setInterval(func, args || '', timeStr, cb);
  }
  delay(timeStr, func, args = undefined, cb = undefined) {
    this._timer.clearTimeout();
    this._timer.setTimeout(func, args || '', timeStr, cb);
  }
  duration(func, ...args) {
    // Returns microseconds; 'm' for milliseconds
    return this._timer.time(func, !args.length ? '' : args, 'u');
  }
}

exports.default = Scheduler;
module.exports = exports['default'];