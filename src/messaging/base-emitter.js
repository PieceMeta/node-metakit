import assert from 'assert'

import TinyEmitter from 'tiny-emitter'
import BaseEvent from './base-event'

const _symEmitterConfig = Symbol('EmitterConfig')

class BaseEmitter extends TinyEmitter {
  constructor (defaultType = BaseEvent.types.MKT_EVENT, emitterId = 'base-emitter') {
    super()
    this[_symEmitterConfig] = { defaultType, emitterId }
  }

  emit (payload = undefined, type = undefined, target = this) {
    if (payload) assert.equal(typeof payload, 'object')
    if (type) assert.equal(typeof type, 'number')
    if (target) assert.equal(typeof target, 'object')
    const evt = BaseEvent.make(payload, target, type || this[_symEmitterConfig].defaultType)
    super.emit(evt.info.type.toString(), evt)
  }

  on (type, fn) {
    assert.equal(typeof type, 'number')
    assert.equal(typeof fn, 'function')
    super.on(type.toString(), fn)
  }

  configureEmitter (defaultType = BaseEvent.types.MKT_EVENT, emitterId = 'base-emitter') {
    this[_symEmitterConfig].defaultType = defaultType
    this[_symEmitterConfig].emitterId = emitterId
  }

  get emitterConfig () {
    return this[_symEmitterConfig]
  }
}

export default BaseEmitter
