const chai = require('chai')
chai.should()

const DataError = require('../../src/data').DataError

describe('data.DataError', () => {
  it('Creates new error instance', () => {
    const err = new DataError(DataError.types.INVALID_TYPE)
    err.should.be.instanceOf(DataError)
    err.message.should.equal(DataError.messages.error[err.code])
  })
})
