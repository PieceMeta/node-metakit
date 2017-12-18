'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _hdf = require('hdf5');

var _globals = require('hdf5/lib/globals');

var _globals2 = _interopRequireDefault(_globals);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class HDF5 {
  static appendRecords(id, title, records) {
    _assert2.default.notEqual(typeof id, 'undefined');
    _assert2.default.equal(typeof title, 'string');
    _assert2.default.ok(Array.isArray(records));
    _hdf.h5tb.appendRecords(id, title, records);
  }
  static makeTable(id, title, model) {
    _assert2.default.notEqual(typeof id, 'undefined');
    _assert2.default.equal(typeof title, 'string');
    _assert2.default.ok(Array.isArray(model));
    _hdf.h5tb.makeTable(id, title, model);
  }
  static createGroup(file, groupName) {
    _assert2.default.notEqual(typeof file, 'undefined');
    _assert2.default.equal(typeof groupName, 'string');
    return file.createGroup(groupName);
  }
  static createFile(filename) {
    return new _hdf.hdf5.File(filename, _globals2.default.Access.ACC_TRUNC);
  }
  static get TYPES() {
    return {
      FLOAT64: 0
    };
  }
}

exports.default = HDF5;
module.exports = exports['default'];