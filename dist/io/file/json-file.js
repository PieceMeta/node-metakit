'use strict';

exports.__esModule = true;

var _baseFile = require('./base-file');

var _baseFile2 = _interopRequireDefault(_baseFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class JSONFile extends _baseFile2.default {
  constructor(data = undefined) {
    super({
      opts: {
        atomic: true,
        ext: '.json'
      }
    }, data);
  }

  _decoder(data) {
    return new Promise(resolve => {
      resolve(JSON.parse(data));
    });
  }

  _encoder(data) {
    return new Promise(resolve => {
      resolve(typeof data.toJSON === 'function' ? data.toJSON() : JSON.stringify(data, null, '\t'));
    }).catch(err => {
      throw err;
    });
  }
}

exports.default = JSONFile;