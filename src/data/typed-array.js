import os from 'os'
import assert from 'assert'

class TypedBufferView {
  constructor (buffer, type = Float64Array, offset = undefined, length = undefined) {
    assert.equal(buffer.constructor.name, 'Buffer')
    this._type = type
    this._readFunc = `readDouble${os.endianness()}`
    this._buffer = buffer.slice(offset, length)
  }
  [Symbol.iterator] () {
    const _ctx = this
    let position = 0
    return {
      next: function next () {
        const rs = {
          done: position >= _ctx._buffer.byteLength / _ctx._type.BYTES_PER_ELEMENT - 1,
          value: _ctx._buffer[_ctx._readFunc](position * _ctx._type.BYTES_PER_ELEMENT)
        }
        position++
        return rs
      }
    }
  }
  get length () {
    return this._buffer.byteLength / this._type.BYTES_PER_ELEMENT
  }
}

export default TypedBufferView
