'use strict';

exports.__esModule = true;

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TypedBufferView {
  constructor(buffer, type = Float64Array, offset = undefined, length = undefined) {
    _assert2.default.equal(buffer.constructor.name, 'Buffer');
    this._type = type;
    this._readFunc = `readDouble${_os2.default.endianness()}`;
    this._buffer = buffer.slice(offset, length);
  }
  [Symbol.iterator]() {
    const _ctx = this;
    let position = 0;
    return {
      next: function next() {
        const rs = {
          done: position >= _ctx._buffer.byteLength / _ctx._type.BYTES_PER_ELEMENT - 1,
          value: _ctx._buffer[_ctx._readFunc](position * _ctx._type.BYTES_PER_ELEMENT)
        };
        position++;
        return rs;
      }
    };
  }
  get length() {
    return this._buffer.byteLength / this._type.BYTES_PER_ELEMENT;
  }
}

exports.default = TypedBufferView;