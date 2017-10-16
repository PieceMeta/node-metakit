import assert from 'assert'
import Big from 'big.js'

import BaseProcessor from './base-processor'

class CompressFPS extends BaseProcessor {
  constructor () {
    super()
    this._data = undefined
    this._count = undefined
    this._fps = undefined
    this._interval = {}
  }

  interpolate (data, mode = CompressFPS.INTERPOLATE.MAX) {
    assert.notEqual(typeof data, 'undefined')
    assert.equal(Object.getPrototypeOf(Object.getPrototypeOf(data)).constructor.name, 'TypedArray')
    assert.equal(Object.getPrototypeOf(Object.getPrototypeOf(this._data)).constructor.name, 'TypedArray')
    assert.ok(Number.isInteger(mode))

    switch (mode) {
      case CompressFPS.INTERPOLATE.MAX:
        data.forEach((val, i) => {
          if (typeof this._data[i] === 'number' && Math.abs(val) > Math.abs(this._data[i])) this._data[i] = val
        })
        break
      case CompressFPS.INTERPOLATE.MIN:
        data.forEach((val, i) => {
          if (typeof this._data[i] === 'number' && Math.abs(val) < Math.abs(this._data[i])) this._data[i] = val
        })
        break
      case CompressFPS.INTERPOLATE.AVG:
        data.forEach((val, i) => {
          if (this._data[i]) this._data[i] += val
        })
        this._count += 1
        break
      default:
        throw new Error(`Unknown interpolation mode: ${mode}`)
    }
  }

  get interval () {
    return this._interval
  }
  set fps (val) {
    this._fps = Big(val)
    this._interval = {
      micros: Big(1000000).div(this._fps).round(0),
      millis: Big(1000).div(this._fps).round(0)
    }
  }

  get data () {
    if (this.count > 1) {
      this._data.forEach((val, i) => {
        if (typeof this._data[i] === 'number') this._data[i] = Big(this._data[i]).div(val)
      })
      this._count = 0
    }
    return this._data
  }
  set data (value) {
    assert.equal(Object.getPrototypeOf(Object.getPrototypeOf(value)).constructor.name, 'TypedArray')
    this._data = value
    this._count = 1
  }

  get count () {
    return this._count
  }
  set count (value) {
    /* ignored */
  }

  static get INTERPOLATE () {
    return {
      MAX: 0,
      MIN: 0,
      AVG: 0
    }
  }
}

export default CompressFPS
