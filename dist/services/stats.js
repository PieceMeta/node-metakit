'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('colors');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _microtime = require('microtime');

var _microtime2 = _interopRequireDefault(_microtime);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _util = require('../data/util');

var filter = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Stats {
  constructor() {
    this._entries = 0;
    this._errors = 0;
    this._start = (0, _moment2.default)();
    this._frameTime = 0;
  }
  addEntries(count = 1) {
    _assert2.default.equal(typeof count, 'number');
    this._entries += count;
  }
  addErrors(count = 1) {
    _assert2.default.equal(typeof count, 'number');
    this.addEntries(count);
    this._errors += count;
  }
  print() {
    let stats = '\n';
    stats += `STATS ${new Array(66).fill('-').join('')}\n`.cyan;
    stats += '\n';
    stats += `Task started:   ${this.start.format('MM/DD/YYYY HH:mm:ss')}\n`;
    stats += `Task ended:     ${(0, _moment2.default)().format('MM/DD/YYYY HH:mm:ss')}\n`;
    stats += `Time spent:     ${this.start.toNow(true)}\n`.yellow;
    stats += '\n';
    stats += `Rows total:     ${this.entries}\n`.yellow;
    stats += `Rows imported:  ${this.imported}\n`.green;
    stats += `Rows failed:    ${this.errors}\n`.red;
    stats += '\n';
    process.stdout.write(stats + '\n');
  }
  getFrameDiff() {
    _logger2.default.debug(`Diff: ${this.micros}μs`, 'mtk:scheduler');
    this.micros = _microtime2.default.now();
  }
  checkSlowFrame(interval) {
    if (this.workTime > interval.micros) {
      _logger2.default.debug(`SLOW FRAME: ${this.workTime - interval.micros}μs\` over limit`.red, 'cl:osc');
    }
  }
  get entries() {
    return this._entries;
  }
  get imported() {
    return this.entries - this.errors;
  }
  get errors() {
    return this._errors;
  }
  get start() {
    return this._start;
  }
  get workTime() {
    return this._workTime;
  }
  set workTime(val) {
    this._workTime = val;
  }

  static updateValueRange(value, range = { min: Number.MAX_VALUE, max: Number.MIN_VALUE }) {
    range.max = Math.max(range.max, value);
    range.min = Math.min(range.min, value);
    return range;
  }

  static getFrameStats(frame, update = undefined) {
    const result = update || {
      // time
      t: null,
      // statistics (array length, neg. & pos. count, peak channel)
      s: { l: frame.length, n: 0, p: 0, c: -1 },
      // data (avg. & val. range)
      d: { a: 0, r: Stats.updateValueRange(0) }
    };
    for (let entry of frame) {
      result.t = entry[0];
      const channels = filter.removePrefixedFromArray(Object.keys(frame[1]), '_');
      for (let id of channels) {
        result.d.a += entry[1][id];
        if (result.d.r.max && entry[1][id] > result.d.r.max) result.s.c = parseInt(id);
        if (entry[1][id] > 0) result.s.p++;
        if (entry[1][id] < 0) result.s.n++;
        result.d.r = Stats.updateValueRange(entry[1][id], result.d.r || undefined);
        result.s.n += entry[1][id];
      }
      result.d.a /= (result.d.a ? 1 : 0) + result.s.l + 1;
    }
    return result;
  }
}

exports.default = Stats;
module.exports = exports['default'];