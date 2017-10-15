import TinyEmitter from 'tiny-emitter'
import assert from 'assert'
import vectorious from 'vectorious'
import Big from 'big.js'
import microtime from 'microtime'

import { padString } from '../util'
import DataTypes from './data-types'
import DataError from './data-error'

class Fragment extends TinyEmitter {
  constructor (config = {}) {
    super()

    this._time = undefined
    this._value = undefined
    this._config = undefined

    this.init(Object.assign({}, config))
  }

  update (value, time = undefined, copy = false) {
    this.time = time || microtime.nowDouble()
    this._key = Fragment.getKeyFromDouble(microtime.nowDouble())

    switch (this._config.type) {
      case DataTypes.TYPE_FLOAT64_MATRIX:
        if (value instanceof ArrayBuffer) {
          assert.equal(value.length, this._value.data.length)
          this._value.data = copy ? Fragment.copyBuffer(value) : value
        }
        else {
          assert(value instanceof vectorious.Matrix)
          assert.equal(value.type, this._value.type)
          this._value.data = copy ? Fragment.copyBuffer(value.data) : value.data
        }
        break
      case DataTypes.TYPE_FLOAT64_VECTOR:
        if (value instanceof ArrayBuffer) {
          assert.equal(value.length, this._value.data.length)
          this._value.data = copy ? Fragment.copyBuffer(value) : value
        }
        else {
          assert(value instanceof vectorious.Vector)
          assert.equal(value.type, this._value.type)
          assert.equal(value.data.length, this._value.data.length)
          this._value.data = copy ? Fragment.copyBuffer(value.data) : value.data
        }
        break
      case DataTypes.TYPE_FLOAT64_ARRAY:
        if (value instanceof Float64Array) {
          assert.equal(value.length, this._value.length)
          this._value = copy ? Fragment.copyBuffer(value) : value
        }
        break
      default:
        throw new DataError(DataError.types.INVALID_TYPE)
    }
    this.emit('update')
  }

  get time () {
    return this._time
  }
  set time (val) {
    this._time = val ? new Big(val) : undefined
  }
  get key () {
    return this._key
  }
  get value () {
    return this._value
  }
  get bytes () {
    return this._value ? this._value.data.byteLength : 0
  }

  toJSON () {
    return JSON.stringify(this._config, null, '\t')
  }
  toString () {
    return this.toJSON()
  }

  init (config) {
    assert(config.type >= 0, DataError.messages[DataError.types.INVALID_TYPE])
    switch (config.type) {
      case DataTypes.TYPE_FLOAT64_MATRIX:
        assert(Array.isArray(config.shape), DataError.messages[DataError.types.BAD_PARAMS])
        this._value = new vectorious.Matrix(config.shape)
        break
      case DataTypes.TYPE_FLOAT64_VECTOR:
        this._value = new vectorious.Vector(config.shape)
        break
      case DataTypes.TYPE_FLOAT64_ARRAY:
        assert(typeof config.shape === 'number', DataError.messages[DataError.types.BAD_PARAMS])
        this._value = new Float64Array(config.shape)
        break
      default:
        throw new DataError(DataError.types.INVALID_TYPE)
    }
    this._config = config
  }

  static copyBuffer (source) {
    let buffer = new ArrayBuffer(source.byteLength)
    new Uint8Array(buffer).set(new Uint8Array(source))
    return buffer
  }
  static getKeyFromDouble (value, length = 16, precision = 6, signed = true) {
    const fixed = Big(Math.abs(value)).toFixed(precision)
    let prefix = ''
    if (signed) prefix = Math.sign(value) > 0 ? '+' : '-'
    return prefix + padString(fixed, length - prefix.length, '0', true)
  }
  static keyToDouble (key) {
    if (typeof key === 'string' && key[0] === '+') key = key.substr(1)
    return key ? Big(key) : undefined
  }
}

export default Fragment
