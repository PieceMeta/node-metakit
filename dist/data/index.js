'use strict';

exports.__esModule = true;
exports.DataError = exports.util = exports.types = exports.structure = undefined;

var _structure = require('./structure');

var structure = _interopRequireWildcard(_structure);

var _types = require('./types');

var types = _interopRequireWildcard(_types);

var _util = require('./util');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

class DataError extends Error {
  constructor(code) {
    super(DataError.messages.error[code]);
    Error.captureStackTrace(this, DataError);
    this.code = code;
  }
  static get types() {
    return {
      INVALID_TYPE: 0,
      BAD_PARAMS: 1
    };
  }
  static get messages() {
    return {
      error: {
        0: 'Invalid Fragment type',
        1: 'Bad parameters'
      }
    };
  }
}

exports.structure = structure;
exports.types = types;
exports.util = util;
exports.DataError = DataError;