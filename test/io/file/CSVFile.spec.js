const
  helper = require('../../helper'),
  chai = require('chai'),
  path = require('path')
chai.should()

const filepath = path.join(__dirname, '..', '_fixtures', 'test.csv'),
  CSVFile = require(helper.requirePath('io/file')).CSVFile

describe('io.file.CSVFile', () => {
  it(`Parses CSVFile file from ${filepath}`, () => {
    const entries = []
    CSVFile.parseFile(
      filepath,
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
