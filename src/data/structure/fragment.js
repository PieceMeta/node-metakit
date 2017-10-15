import TinyEmitter from 'tiny-emitter'
import assert from 'assert'

import { DataError } from '../index'

import * as types from '../types'
import * as util from '../util'

class Fragment extends TinyEmitter {
  constructor (config = {}) {
    super()

    this._time = undefined
    this._value = undefined
    this._config = undefined

    this.init(Object.assign({}, config))
  }

  update (value, time = undefined, copy = false) {
    this.time = time || types.make(types.MKT_TIMESTAMP)
    this._key = util.keyFromDouble(time)

    switch (this._config.type) {
      case types.MKT_DOUBLE_MATRIX:
        if (value instanceof ArrayBuffer) {
          assert.equal(value.length, this._value.data.length)
          this._value.data = copy ? util.copyBuffer(value) : value
        }
        else {
          assert.equal(value.constructor.name, 'Matrix')
          assert.equal(value.type, this._value.type)
          this._value.data = copy ? util.copyBuffer(value.data) : value.data
        }
        break
      case types.MKT_DOUBLE_VECTOR:
        if (value instanceof ArrayBuffer) {
          assert.equal(value.length, this._value.data.length)
          this._value.data = copy ? util.copyBuffer(value) : value
        }
        else {
          assert.equal(value.constructor.name, 'Vector')
          assert.equal(value.type, this._value.type)
          assert.equal(value.data.length, this._value.data.length)
          this._value.data = copy ? util.copyBuffer(value.data) : value.data
        }
        break
      case types.MKT_DOUBLE_ARRAY:
        if (value instanceof Float64Array) {
          assert.equal(value.length, this._value.length)
          this._value = copy ? util.copyBuffer(value) : value
        }
        break
      default:
        throw new util.DataError(DataError.types.INVALID_TYPE)
    }
    this.emit('update')
  }

  get time () {
    return this._time
  }
  set time (val) {
    this._time = val ? types.make(types.MKT_TIMESTAMP, val) : undefined
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
    this._value = types.make(config.type, config)
    this._config = config
  }
}

export default Fragment
