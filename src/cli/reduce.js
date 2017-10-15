#!/usr/bin/env node --harmony

const yargs = require('yargs') // eslint-disable-line
  .command(['fps', '*'], 'Reduce FPS rate of an LMDB db and io as LMDB and HDF5', () => {}, (argv) => {
    process.env.IN_FILE = argv.infile
    process.env.OUT_FILE = argv.outfile
    process.env.FPS = argv.fps
    if (argv.debug) {
      process.env.DEBUG_MODE = true
    }
    require('../core/reduce')
  })
  .option('infile', {
    alias: 'i',
    describe: 'LMDB input file',
    required: true
  })
  .option('outfile', {
    alias: 'o',
    describe: 'LMDB io file, also used for HDF5',
    required: true
  })
  .option('fps', {
    alias: 'f',
    describe: 'Target frames per second',
    default: '100.0'
  })
  .option('debug', {
    alias: 'd',
    default: false
  })
  .help()
  .argv
