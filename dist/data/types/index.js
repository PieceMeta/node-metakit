'use strict';

exports.__esModule = true;
exports.MKT_DOUBLE_ARRAY = exports.MKT_DOUBLE_VECTOR = exports.MKT_DOUBLE_MATRIX = exports.MKT_DOUBLE_VALUE = exports.MKT_RANGE = exports.MKT_TIMESTAMP = exports.make = undefined;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _vectorious = require('vectorious');

var _vectorious2 = _interopRequireDefault(_vectorious);

var _data = require('../../data');

var _double = require('./double');

var _double2 = _interopRequireDefault(_double);

var _timestamp = require('./timestamp');

var _timestamp2 = _interopRequireDefault(_timestamp);

var _range = require('./range');

var _range2 = _interopRequireDefault(_range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MKT_TIMESTAMP = 1,
      MKT_RANGE = 2,
      MKT_DOUBLE_VALUE = 100,
      MKT_DOUBLE_MATRIX = 110,
      MKT_DOUBLE_VECTOR = 120,
      MKT_DOUBLE_ARRAY = 130;

/*
MKT_FLOAT_VALUE = 200,
MKT_FLOAT_ARRAY = 230,
 MKT_INT64_VALUE = 300,
MKT_INT64_ARRAY = 330,
 MKT_INT32_VALUE = 400,
MKT_INT32_ARRAY = 430,
 MKT_UINT8_ARRAY = 530
*/

const make = function (type, config = {}, value = undefined) {
  switch (type) {
    case MKT_TIMESTAMP:
      return new _timestamp2.default(value || 0);
    case MKT_RANGE:
      return new _range2.default(value);

    case MKT_DOUBLE_VALUE:
      return new _double2.default(value || 0);
    case MKT_DOUBLE_MATRIX:
      (0, _assert2.default)(Array.isArray(config.shape), _data.DataError.messages[_data.DataError.types.BAD_PARAMS]);
      return new _vectorious2.default.Matrix(value || config.shape);
    case MKT_DOUBLE_VECTOR:
      (0, _assert2.default)(Array.isArray(config.shape), _data.DataError.messages[_data.DataError.types.BAD_PARAMS]);
      return new _vectorious2.default.Vector(value || config.shape);
    case MKT_DOUBLE_ARRAY:
      (0, _assert2.default)(typeof config.shape === 'number', _data.DataError.messages[_data.DataError.types.BAD_PARAMS]);
      return new Float64Array(config.shape);

    /*
    case MKT_FLOAT_VALUE:
      break
    case MKT_FLOAT_ARRAY:
      break
     case MKT_INT64_VALUE:
      break
    case MKT_INT64_ARRAY:
      break
     case MKT_INT32_VALUE:
      break
    case MKT_INT32_ARRAY:
      break
     case MKT_UINT8_ARRAY:
      break
      */

    default:
      throw new _data.DataError(_data.DataError.types.BAD_PARAMS);
  }
};

exports.make = make;
exports.MKT_TIMESTAMP = MKT_TIMESTAMP;
exports.MKT_RANGE = MKT_RANGE;
exports.MKT_DOUBLE_VALUE = MKT_DOUBLE_VALUE;
exports.MKT_DOUBLE_MATRIX = MKT_DOUBLE_MATRIX;
exports.MKT_DOUBLE_VECTOR = MKT_DOUBLE_VECTOR;
exports.MKT_DOUBLE_ARRAY = MKT_DOUBLE_ARRAY;