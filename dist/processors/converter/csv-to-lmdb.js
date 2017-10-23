'use strict';

exports.__esModule = true;

require('colors');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _baseEmitter = require('../../messaging/base-emitter');

var _baseEmitter2 = _interopRequireDefault(_baseEmitter);

var _double = require('../../data/types/double');

var _double2 = _interopRequireDefault(_double);

var _index = require('../../data/index');

var _index2 = require('../../io/file/index');

var _index3 = require('../../services/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const CSVToLMDB = function (infile, outdir, options = {}, statusHandler = undefined, endHandler = undefined) {
  process.stdout.write(`\nCSV 2 LMDB ${new Array(61).fill('-').join('')}\n\n`.cyan);
  options = Object.assign({
    flushEvery: 10000,
    dataStart: 0,
    keyColumn: 0,
    type: _index2.LMDB.TYPES.FLOAT64,
    key: {
      column: 0,
      length: 16,
      precision: 6,
      signPrefix: true
    }
  }, options);
  const emitter = new _baseEmitter2.default(),
        stats = new _index3.Stats();
  if (typeof statusHandler === 'function') {
    emitter.on('status', statusHandler);
  }
  if (typeof endHandler === 'function') {
    emitter.on('end', endHandler);
  }
  return new Promise(function (resolve, reject) {
    let row = 0,
        basename,
        dbUUID,
        txn;
    const lmdb = new _index2.LMDB(),
          meta = {
      type: options.type,
      key: options.key
    };

    const onData = function (data) {
      if (row >= options.dataStart) {
        const parsedKey = new _double2.default(data[options.key.column]);
        if (typeof parsedKey !== 'number') return row++;
        const key = _index.util.keyFromDouble(parsedKey === null ? 0 : parsedKey, options.key.length, options.key.precision, options.key.signPrefix);
        let values,
            hasError = false;
        switch (options.type) {
          /*
          case types.MKT_FLOAT_ARRAY:
            values = Float32Array.from(data.map(val => {
              const parsed = new Double(val)
              hasError = hasError || parsed === null
              return hasError ? 0.0 : parsed
            }))
            break
            */
          default:
            values = _index.types.make(_index.types.MKT_DOUBLE_ARRAY, data.map(val => {
              const parsed = new _double2.default(val);
              hasError = hasError || parsed === null;
              return hasError ? 0.0 : parsed;
            }));
        }
        if (hasError) {
          stats.addErrors();
        } else {
          lmdb.put(txn, dbUUID, key, values);
          stats.addEntries();
        }
        if (stats.entries % options.flushEvery === 0) {
          lmdb.endTxn(txn);
          emitter.emit('status', _index.util.padString(`Parsed ${stats.entries} rows...`, 32));
          txn = lmdb.beginTxn();
        }
      } else {
        if (Array.isArray(options.metaRange) && row >= options.metaRange[0] && row < options.metaRange[1]) {
          meta[data[0]] = data[1];
        } else if (typeof options.labelRow === 'number' && row === options.labelRow) {
          meta.labels = data;
        }
        if (options.dataStart === 0 || row === options.dataStart - 1) {
          basename = _path2.default.basename(infile, _path2.default.extname(infile));
          const outpath = _path2.default.join(outdir, `${basename}.lmdb`);
          process.stdout.write(`Opening LMDB environment for output at:\n${outpath}\n\n`);
          lmdb.openEnv(outpath, 4, 1);
          meta.title = basename;
          dbUUID = lmdb.createDb(meta);
          txn = lmdb.beginTxn();
          emitter.emit('status', _index.util.padString('Parsing rows... ', 32));
        }
      }
      row++;
    },
          onEnd = function (err) {
      emitter.emit('end');
      process.stdout.write(`Parsed ${stats.entries} rows, closing environment...`.yellow);
      lmdb.endTxn(txn);
      lmdb.close();
      process.stdout.write('Done.\n'.yellow);
      if (err) {
        return reject(err);
      }
      resolve(stats);
    };

    _index2.CSVFile.parseFile(infile, onData, onEnd);
  });
};

exports.default = CSVToLMDB;