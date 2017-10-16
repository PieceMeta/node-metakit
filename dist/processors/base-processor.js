'use strict';

exports.__esModule = true;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _messaging = require('../messaging');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const _symProcessorConfig = Symbol('ProcessorConfig'),
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
      _passthrough = input => Promise.resolve(input);

class BaseProcessor extends _messaging.Emitter {
  constructor(func = _passthrough, config = {}) {
    super(_messaging.BaseEvent.types.MTK_EVENT_PROCESSOR, 'BaseProcessor');

    this.processorFunction = func;

    const merged = Object.assign({}, _defaultConfig);
    this[_symProcessorConfig] = Object.assign(merged, config);
  }
  process(...args) {
    _assert2.default.equal(typeof data, 'object');
    this[_symProcessorFunction](args);
  }

  set processorFunction(func) {
    _assert2.default.equal(typeof func, 'function');
    this[_symProcessorFunction] = func;
  }
}

exports.default = BaseProcessor;