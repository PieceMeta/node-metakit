'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('colors');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _baseEmitter = require('../../messaging/base-emitter');

var _baseEmitter2 = _interopRequireDefault(_baseEmitter);

var _double = require('../../data/types/double');

var _double2 = _interopRequireDefault(_double);

var _index = require('../../data/index');

var _index2 = require('../../io/file/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BVHToLMDB = function (infile, outdir, options = {}, statusHandler = undefined, endHandler = undefined) {
  process.stdout.write(`\nBVH 2 LMDB ${new Array(61).fill('-').join('')}\n\n`.cyan);
  let _bvh = new _index2.BVHFile();
  return _index2.BVHFile.load(infile).then(data => {
    _bvh.data = data;
  });
};

exports.default = BVHToLMDB;
module.exports = exports['default'];