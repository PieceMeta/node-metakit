import assert from 'assert'
import Double from './double'

class Range {
  constructor (val = undefined) {
    this._prefix = 'rng!'
    if (typeof val === 'string') this.fromJSON(val)
    else {
      assert.ok(val instanceof Double, 'Range value must be type double')
      this._low = this._high = val
    }
  }
  update (val) {
    assert.ok(val instanceof Double, 'Range value must be type double')
    if (this.low.gt(val)) this._low = val
    if (this.high.lt(val)) this._high = val
  }

  get low () {
    return this._low
  }
  get high () {
    return this._high
  }

  toJSON () {
    return `${this._prefix}!${this.low.toString()}!${this.high.toString()}`
  }
  fromJSON (val) {
    const parts = val.split('!')
    assert.equal(parts.length, 3, 'Invalid string for Range resurrection')
    assert.equal(parts.shift(), this._prefix, 'Wrong prefix for Range resurrection')
    this._low = Double(parts[0])
    this._high = Double(parts[1])
  }
}

export default Range
