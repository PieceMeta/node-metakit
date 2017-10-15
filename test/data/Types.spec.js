const chai = require('chai')
chai.should()

const Types = require('../../src/data/data-types').default

describe('data.Types', () => {
  it('Enumerates possible storage types for data fragments', () => {
    Types.TYPE_FLOAT64_MATRIX.should.equal(0)
    Types.TYPE_FLOAT64_VECTOR.should.equal(1)
    Types.TYPE_FLOAT64_ARRAY.should.equal(2)
  })
})
