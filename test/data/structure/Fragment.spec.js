const chai = require('chai')
chai.should()

const Fragment = require('../../../src/data/index').structure.Fragment,
  types = require('../../../src/data/index').types

describe('data.Fragment', () => {
  it('Creates an empty data fragment of type FLOAT64_MATRIX in the shape [[0, 0], [0, 0]]', () => {
    const config = {
      type: types.MKT_DOUBLE_MATRIX,
      shape: [[0, 0], [0, 0]]
    }
    const fragment = new Fragment(config)
    fragment.should.be.instanceOf(Fragment)
    fragment._config.should.deep.equal(config)
    fragment._value.data.constructor.name.should.equal('Float64Array')
    fragment._value.data.length.should.equal(4)
    fragment._value.shape.should.deep.equal([2, 2])
  })
  it('Creates an empty data fragment of type FLOAT64_VECTOR with a length of 4 (x, y, z and w)', () => {
    const config = {
      type: types.MKT_DOUBLE_VECTOR,
      shape: [0, 0, 0, 0]
    }
    const fragment = new Fragment(config)
    fragment.should.be.instanceOf(Fragment)
    fragment._config.should.deep.equal(config)
    fragment._value.constructor.name.should.equal('Vector')
    fragment._value.type.name.should.equal('Float64Array')
    fragment._value.length.should.equal(4)
    fragment._value.x.should.equal(0.0)
    fragment._value.y.should.equal(0.0)
    fragment._value.z.should.equal(0.0)
    fragment._value.w.should.equal(0.0)
  })
  it('Creates an empty data fragment of type FLOAT64_ARRAY with a length of 3', () => {
    const config = {
      type: types.MKT_DOUBLE_ARRAY,
      shape: 3
    }
    const fragment = new Fragment(config)
    fragment.should.be.instanceOf(Fragment)
    fragment._config.should.deep.equal(config)
    fragment._value.constructor.name.should.equal('Float64Array')
    fragment._value.length.should.equal(3)
  })
})
