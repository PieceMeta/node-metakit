'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _fastCsv = require('fast-csv');

var _fastCsv2 = _interopRequireDefault(_fastCsv);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CSVFile {
  static parseFile(filename, dataCallback, endCallback) {
    const stream = CSVFile.getStream(filename);
    CSVFile.parseStream(stream, dataCallback, endCallback);
  }
  static parseStream(stream, dataCallback, endCallback) {
    _assert2.default.ok(stream instanceof _fs2.default.ReadStream);
    _assert2.default.equal(typeof dataCallback, 'function');
    _assert2.default.equal(typeof endCallback, 'function');

    const csvStream = _fastCsv2.default.parse({ trim: true }).on('data', dataCallback).on('error', function (err) {
      endCallback(err);
    }).on('end', function () {
      endCallback();
    });
    stream.pipe(csvStream);
  }
  static getStream(filename) {
    _assert2.default.equal(typeof filename, 'string');
    // process.stdout.write(`Opening CSV file for input at:\n${filename}\n\n`)
    return _fs2.default.createReadStream(filename);
  }
}

exports.default = CSVFile;
module.exports = exports['default'];