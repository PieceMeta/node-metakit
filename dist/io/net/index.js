'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebSocket = exports.OSC = undefined;

var _osc = require('./osc');

var _osc2 = _interopRequireDefault(_osc);

var _websocket = require('./websocket');

var _websocket2 = _interopRequireDefault(_websocket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.OSC = _osc2.default;
exports.WebSocket = _websocket2.default;