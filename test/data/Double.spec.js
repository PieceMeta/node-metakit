const chai = require('chai')
chai.should()

const BigNumber = require('bignumber.js'),
  Double = require('../../src/data/double').default

describe('data.Double', () => {
  it('Creates a Double (single value) instance from a string value', () => {
    const double = new Double('0.00000005')
    double.should.be.instanceOf(Double)
    double.constructor.prototype.should.be.instanceOf(BigNumber)
    double.toString().should.equal('5e-8')
    double.valueOf().should.equal('5e-8')
  })
  it('Creates a Double (single value) instance from a number value', () => {
    const double = new Double(0.00000005)
    double.should.be.instanceOf(Double)
    double.constructor.prototype.should.be.instanceOf(BigNumber)
    double.toString().should.equal('5e-8')
    double.valueOf().should.equal('5e-8')
  })
})
