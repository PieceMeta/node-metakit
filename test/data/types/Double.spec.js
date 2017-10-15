const chai = require('chai')
chai.should()

const types = require('../../../src/data/types/index')

describe('data.types.Double', () => {
  it('Creates a Double (single value) instance from a string value', () => {
    const double = types.make(types.MKT_DOUBLE_VALUE, undefined, '0.00000005')
    double.constructor.name.should.equal('Double')
    double.toString().should.equal('5e-8')
    double.valueOf().should.equal('5e-8')
  })
  it('Creates a Double (single value) instance from a number value', () => {
    const double = types.make(types.MKT_DOUBLE_VALUE, undefined, 0.00000005)
    double.constructor.name.should.equal('Double')
    double.toString().should.equal('5e-8')
    double.valueOf().should.equal('5e-8')
  })
})
