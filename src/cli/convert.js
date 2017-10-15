#!/usr/bin/env node --harmony

const setGeneral = function (argv) {
  process.env.IN_FILE = argv.infile
  process.env.OUT_DIR = argv.outdir
  process.env.DATA_TYPE = argv.type
  if (argv.debug) {
    process.env.DEBUG_MODE = true
  }
}

const yargs = require('yargs') // eslint-disable-line
  .command(['csv2lmdb', '*'], 'Convert CSV to LMDB', () => {}, (argv) => {
    setGeneral(argv)
    process.env.OUT_TYPE = 'lmdb'
    require('../core/convert')
  })
  /* .command('csv2hdf5', 'Convert CSV to HDF5', () => {}, (argv) => {
    setGeneral(argv)
    process.env.OUT_TYPE = 'hdf5'
    require('../nanobrains/convert')
  }) */
  .option('infile', {
    alias: 'i',
    describe: 'CSV input file',
    required: true
  })
  .option('outdir', {
    alias: 'o',
    describe: 'LMDB io directory',
    required: true
  })
  .option('type', {
    alias: 't',
    describe: 'Value type to be stored',
    default: 'Float64',
    choices: ['Float64', 'Float32']
  })
  .option('debug', {
    alias: 'd',
    default: false
  })
  .help()
  .argv
