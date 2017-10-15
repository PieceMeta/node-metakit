'use strict';

exports.__esModule = true;
exports.getHSLFromRadians = exports.quantize = exports.sort = exports.filters = exports.parseDouble = exports.padString = exports.Time = exports.Stats = exports.Logger = exports.Harmonics = exports.HarmonicMatrix = exports.ChannelMatrix = undefined;

var _channelMatrix = require('./channel-matrix');

var _channelMatrix2 = _interopRequireDefault(_channelMatrix);

var _harmonicMatrix = require('./harmonic-matrix');

var _harmonicMatrix2 = _interopRequireDefault(_harmonicMatrix);

var _harmonics = require('./harmonics');

var _harmonics2 = _interopRequireDefault(_harmonics);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _stats = require('./stats');

var _stats2 = _interopRequireDefault(_stats);

var _time = require('./time');

var _time2 = _interopRequireDefault(_time);

var _filter = require('./filter');

var filters = _interopRequireWildcard(_filter);

var _sort = require('./sort');

var sort = _interopRequireWildcard(_sort);

var _big = require('big.js');

var _big2 = _interopRequireDefault(_big);

var _d3Node = require('d3-node');

var _d3Node2 = _interopRequireDefault(_d3Node);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const padString = function (str, length, char = ' ', padLeft = false) {
  const pad = new Array(length - str.length).fill(char).join('');
  if (padLeft) {
    return pad + str;
  }
  return str + pad;
};

const parseDouble = function (value) {
  try {
    return (0, _big2.default)(value);
  } catch (err) {
    return null;
  }
};

const quantize = function (value, steps = 20, precision = 0) {
  steps = Math.max(steps, 20.0);
  precision = precision > 0 ? Math.pow(10.0, precision) : 0;
  return value;
};

const getHSLFromRadians = (rad, alpha = 1.0, sat = 1.0, light = 0.5) => _d3Node2.default.d3.hsl(rad * 180 / Math.PI, sat, light, alpha);

exports.ChannelMatrix = _channelMatrix2.default;
exports.HarmonicMatrix = _harmonicMatrix2.default;
exports.Harmonics = _harmonics2.default;
exports.Logger = _logger2.default;
exports.Stats = _stats2.default;
exports.Time = _time2.default;
exports.padString = padString;
exports.parseDouble = parseDouble;
exports.filters = filters;
exports.sort = sort;
exports.quantize = quantize;
exports.getHSLFromRadians = getHSLFromRadians;