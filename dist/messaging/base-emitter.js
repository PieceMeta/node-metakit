'use strict';

exports.__esModule = true;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _tinyEmitter = require('tiny-emitter');

var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

var _baseEvent = require('base-event');

var _baseEvent2 = _interopRequireDefault(_baseEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _symEmitterConfig = Symbol('EmitterConfig');

class BaseEmitter extends _tinyEmitter2.default {
  constructor(defaultType = BaseEmitter.types.MKT_EVENT, emitterId = 'base-emitter') {
    super();
    this[_symEmitterConfig] = { defaultType, emitterId };
  }

  emit(payload = undefined, type = undefined, target = this) {
    if (payload) _assert2.default.equal(typeof payload, 'object');
    if (type) _assert2.default.equal(typeof type, 'number');
    if (target) _assert2.default.equal(typeof target, 'object');
    const evt = _baseEvent2.default.make(payload, type || this[_symEmitterConfig].defaultType, target);
    super.emit(evt.type, evt);
  }

  configureEmitter(defaultType = BaseEmitter.types.MKT_EVENT, emitterId = 'base-emitter') {
    this[_symEmitterConfig].defaultType = defaultType;
  }

  get emitterConfig() {
    return this[_symEmitterConfig];
  }
}

exports.default = BaseEmitter;