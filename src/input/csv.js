import assert from 'assert'
import csv from 'fast-csv'
import fs from 'fs'

class CSV {
  static parseFile (filename, dataCallback, endCallback) {
    const stream = CSV.getStream(filename)
    CSV.parseStream(stream, dataCallback, endCallback)
  }
  static parseStream (stream, dataCallback, endCallback) {
    assert.ok(stream instanceof fs.ReadStream)
    assert.equal(typeof dataCallback, 'function')
    assert.equal(typeof endCallback, 'function')

    const csvStream = csv
      .parse({ trim: true })
      .on('data', dataCallback)
      .on('error', function (err) {
        endCallback(err)
      })
      .on('end', function () {
        endCallback()
      })
    stream.pipe(csvStream)
  }
  static getStream (filename) {
    assert.equal(typeof filename, 'string')
    process.stdout.write(`Opening CSV file for input at:\n${filename}\n\n`)
    return fs.createReadStream(filename)
  }
}

export default CSV
