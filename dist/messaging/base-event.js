'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const _symEventConfig = Symbol('EventConfig'),
      _typesConfig = {
  value: {
    MKT_EVENT: 1,
    MKT_EVENT_DATA: 25,
    MKT_EVENT_IO: 50,
    MKT_EVENT_PROCESS: 75,
    MKT_EVENT_SERVICE: 100
  },
  writable: false,
  configurable: false
};

class BaseEvent {
  constructor(payload, context, type) {
    const value = { payload, context, type };
    Object.defineProperty(this, _symEventConfig, {
      value,
      enumerable: true,
      writable: false,
      configurable: false
    });
  }

  get info() {
    return this[_symEventConfig];
  }

  static make(payload = undefined, context = this, type = BaseEvent.types.MKT_EVENT) {
    return new BaseEvent(payload, context, type);
  }
}

Object.defineProperty(BaseEvent, 'types', _typesConfig);

exports.default = BaseEvent;
module.exports = exports['default'];