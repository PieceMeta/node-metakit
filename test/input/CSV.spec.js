const chai = require('chai'),
  path = require('path')
chai.should()

const input = require('../../src/input')

describe('input.CSV', () => {
  it('Parses CSV file from path', () => {
    const entries = []
    input.CSV.parseFile(
      path.join(__dirname, '..', 'fixtures', 'test.csv'),
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
