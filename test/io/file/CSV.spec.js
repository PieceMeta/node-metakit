const chai = require('chai'),
  path = require('path')
chai.should()

const CSV = require('../../../src/io/file/index').CSV

describe('input.CSV', () => {
  it('Parses CSV file from path', () => {
    const entries = []
    CSV.parseFile(
      path.join(__dirname, '..', '_fixtures', 'test.csv'),
      data => {
        entries.push(data)
      },
      err => {
        err.should.not.exist()
        entries.length.should.equal(50)
      }
    )
  })
})
