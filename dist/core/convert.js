'use strict';

const path = require('path'),
      CLI = require('clui'),
      csvToLMDB = require('../processors').csvToLMDB;

let spinner;
const infile = path.resolve(process.env.IN_FILE),
      outdir = process.env.OUT_DIR ? path.resolve(process.env.OUT_DIR) : path.dirname(infile),
      outType = process.env.OUT_TYPE || 'lmdb',
      debug = process.env.DEBUG_MODE,
      statusHandler = function (status) {
  if (debug) {
    return process.stdout.write(`${status}\n`);
  }
  if (!spinner) {
    spinner = new CLI.Spinner(status);
    return spinner.start();
  }
  spinner.message(status);
},
      endHandler = function () {
  if (spinner) {
    spinner.stop();
    spinner = undefined;
  }
};

Promise.resolve().then(function () {
  switch (outType) {
    case 'lmdb':
      return csvToLMDB(infile, outdir, {
        flushEvery: 100000,
        metaRange: [0, 2],
        labelRow: 3,
        dataStart: 4,
        type: process.env.DATA_TYPE || 'Float64',
        key: {
          column: 0,
          length: 12,
          precision: 3,
          signPrefix: false
        }
      }, statusHandler, endHandler);
    /* case 'hdf5':
      return Convert.csvToHDF5(
        infile,
        outdir,
        {
          flushEvery: 100000,
          metaRange: [0, 2],
          labelRow: 3,
          dataStart: 4
        },
        statusHandler,
        endHandler
      ) */
  }
}).then(stats => {
  stats.print();
  process.exit(0);
}).catch(err => {
  console.error(err.message);
  console.error(err.stack);
  process.exit(err.code);
});