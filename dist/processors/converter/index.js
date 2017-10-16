'use strict';

exports.__esModule = true;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _baseProcessor = require('../base-processor');

var _baseProcessor2 = _interopRequireDefault(_baseProcessor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import CSVToHDF5 from './csv-to-hdf5'

const CONVERT_MODE_CSV_TO_LMDB = { id: 0, file: 'csv-to-lmdb.js' },
      CONVERT_MODE_CSV_TO_HDF5 = { id: 1, file: 'csv-to-hdf5.js' },
      _convertModes = {
  CONVERT_MODE_CSV_TO_LMDB,
  CONVERT_MODE_CSV_TO_HDF5
};

class Converter extends _baseProcessor2.default {
  constructor(config = {}, mode = CONVERT_MODE_CSV_TO_LMDB) {
    super();
    this._config = config;
    this._mode = mode;
  }
  setMode(mode) {
    let file;
    switch (mode) {
      case CONVERT_MODE_CSV_TO_LMDB.id:
        file = CONVERT_MODE_CSV_TO_LMDB.file;
        break;
      case CONVERT_MODE_CSV_TO_HDF5.id:
        file = CONVERT_MODE_CSV_TO_HDF5.file;
        throw new Error('Not implemented');
      default:
        throw new Error('Unknown mode');
    }
    this._mode = mode;
    super.processorFunction = require(_path2.default.join(__dirname, file));
  }
}

Object.defineProperty(Converter, 'modes', { value: _convertModes, writable: false, configurable: false });

exports.default = Converter;