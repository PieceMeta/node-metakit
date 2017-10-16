const _symEventConfig = Symbol('EventConfig'),
  _typesConfig = {
    value: {
      MKT_EVENT: 0,
      MKT_EVENT_DATA: 25,
      MKT_EVENT_IO: 50,
      MKT_EVENT_PROCESS: 75,
      MKT_EVENT_SERVICE: 100
    },
    writable: false,
    configurable: false
  }

class BaseEvent {
  constructor (payload, context, type) {
    const config = {
      value: { payload, context, type },
      enumerable: true,
      writable: false,
      configurable: false
    }
    Object.defineProperty(this, _symEventConfig, config)
  }

  get info () {
    return this[_symEventConfig]
  }

  static make (payload = undefined, context = this, type = BaseEvent.types.MKT_EVENT) {
    return new BaseEvent(payload, context, type)
  }
}

Object.defineProperty(BaseEvent, 'types', _typesConfig)

export default BaseEvent
