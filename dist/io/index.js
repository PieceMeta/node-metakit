'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.net = exports.file = undefined;

var _file = require('./file');

var file = _interopRequireWildcard(_file);

var _net = require('./net');

var net = _interopRequireWildcard(_net);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.file = file;
exports.net = net;