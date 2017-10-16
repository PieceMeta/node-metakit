const
  helper = require('../helper'),
  chai = require('chai')
chai.should()

const DataError = require(helper.requirePath('data')).DataError

describe('data.DataError', () => {
  it('Creates new error instance', () => {
    const err = new DataError(DataError.types.INVALID_TYPE)
    err.should.be.instanceOf(DataError)
    err.message.should.equal(DataError.messages.error[err.code])
  })
})
