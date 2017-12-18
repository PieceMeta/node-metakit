'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _tinyEmitter = require('tiny-emitter');

var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

var _baseEvent = require('./base-event');

var _baseEvent2 = _interopRequireDefault(_baseEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _symEmitterConfig = Symbol('EmitterConfig');

class BaseEmitter extends _tinyEmitter2.default {
  constructor(defaultType = _baseEvent2.default.types.MKT_EVENT, emitterId = 'base-emitter') {
    super();
    this[_symEmitterConfig] = { defaultType, emitterId };
  }

  emit(payload = undefined, type = undefined, target = this) {
    if (payload) _assert2.default.equal(typeof payload, 'object');
    if (type) _assert2.default.equal(typeof type, 'number');
    if (target) _assert2.default.equal(typeof target, 'object');
    const evt = _baseEvent2.default.make(payload, target, type || this[_symEmitterConfig].defaultType);
    super.emit(evt.info.type.toString(), evt);
  }

  on(type, fn) {
    _assert2.default.equal(typeof type, 'number');
    _assert2.default.equal(typeof fn, 'function');
    super.on(type.toString(), fn);
  }

  configureEmitter(defaultType = _baseEvent2.default.types.MKT_EVENT, emitterId = 'base-emitter') {
    this[_symEmitterConfig].defaultType = defaultType;
    this[_symEmitterConfig].emitterId = emitterId;
  }

  get emitterConfig() {
    return this[_symEmitterConfig];
  }
}

exports.default = BaseEmitter;
module.exports = exports['default'];