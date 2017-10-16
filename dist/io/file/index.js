'use strict';

exports.__esModule = true;
exports.LMDB = exports.JSONFile = exports.CSV = exports.BaseFile = undefined;

var _baseFile = require('./base-file');

var _baseFile2 = _interopRequireDefault(_baseFile);

var _csv = require('./csv');

var _csv2 = _interopRequireDefault(_csv);

var _jsonFile = require('./json-file');

var _jsonFile2 = _interopRequireDefault(_jsonFile);

var _lmdb = require('./lmdb');

var _lmdb2 = _interopRequireDefault(_lmdb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import HDF5 from './hdf5'
exports.BaseFile = _baseFile2.default;
exports.CSV = _csv2.default;
exports.JSONFile = _jsonFile2.default;
exports.LMDB = _lmdb2.default;