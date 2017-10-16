import assert from 'assert'
import { Emitter, BaseEvent } from '../messaging'

const
  _symProcessorConfig = Symbol('ProcessorConfig'),
  _symProcessorFunction = Symbol('ProcessorFunction'),
  _defaultConfig = {
    value: {
      options: {},
      statusHandler: undefined,
      endHandler: undefined
    },
    configurable: false,
    writable: false,
    enumerable: true
  },
  _passthrough = input => Promise.resolve(input)

class BaseProcessor extends Emitter {
  constructor (func = _passthrough, config = {}) {
    super(BaseEvent.types.MTK_EVENT_PROCESSOR, 'BaseProcessor')

    this.processorFunction = func

    const merged = Object.assign({}, _defaultConfig)
    this[_symProcessorConfig] = Object.assign(merged, config)
  }
  process (...args) {
    assert.equal(typeof data, 'object')
    this[_symProcessorFunction](args)
  }

  set processorFunction (func) {
    assert.equal(typeof func, 'function')
    this[_symProcessorFunction] = func
  }
}

export default BaseProcessor
