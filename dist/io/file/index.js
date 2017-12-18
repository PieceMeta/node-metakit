'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSONFile = exports.CSVFile = exports.BVHFile = exports.BaseFile = undefined;

var _baseFile = require('./base-file');

var _baseFile2 = _interopRequireDefault(_baseFile);

var _bvhFile = require('./bvh-file');

var _bvhFile2 = _interopRequireDefault(_bvhFile);

var _csvFile = require('./csv-file');

var _csvFile2 = _interopRequireDefault(_csvFile);

var _jsonFile = require('./json-file');

var _jsonFile2 = _interopRequireDefault(_jsonFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.BaseFile = _baseFile2.default;
exports.BVHFile = _bvhFile2.default;
exports.CSVFile = _csvFile2.default;
exports.JSONFile = _jsonFile2.default;