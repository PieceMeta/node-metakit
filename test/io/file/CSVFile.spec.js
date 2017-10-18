const
  helper = require('../../helper'),
  chai = require('chai'),
  path = require('path')
chai.should()

const CSVFile = require(helper.requirePath('io/file')).CSVFile

describe('io.file.CSVFile', () => {
  it('Parses CSVFile file from path', () => {
    const entries = []
    CSVFile.parseFile(
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
