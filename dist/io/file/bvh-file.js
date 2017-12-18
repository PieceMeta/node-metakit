'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _baseFile = require('./base-file');

var _baseFile2 = _interopRequireDefault(_baseFile);

var _bvh = require('bvh');

var _bvh2 = _interopRequireDefault(_bvh);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BVHFile extends _baseFile2.default {
  _decoder(data) {
    return Promise.resolve(_bvh2.default.parse(data.toString()));
  }
  load(filepath) {
    const _ctx = this;
    return super.load(filepath).then(data => {
      _ctx._data = data;
    });
  }
}

exports.default = BVHFile;
module.exports = exports['default'];