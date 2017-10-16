'use strict';

exports.__esModule = true;
exports.Emitter = exports.BaseEvent = undefined;

var _baseEvent = require('./base-event');

var _baseEvent2 = _interopRequireDefault(_baseEvent);

var _baseEmitter = require('./base-emitter');

var _baseEmitter2 = _interopRequireDefault(_baseEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.BaseEvent = _baseEvent2.default;
exports.Emitter = _baseEmitter2.default;