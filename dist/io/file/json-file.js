'use strict';

exports.__esModule = true;

var _baseFile = require('./base-file');

var _baseFile2 = _interopRequireDefault(_baseFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class JSONFile extends _baseFile2.default {
  constructor() {
    super({
      encoder: data => JSON.stringify(this, null, '\t'),
      decoder: JSON.parse,
      opts: {
        atomic: true,
        ext: '.json'
      }
    });
  }

  static load(filepath) {
    return super.load(filepath);
  }
  save(filepath) {
    return super.save(filepath, true);
  }
}

exports.default = JSONFile;