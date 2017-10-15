#!/usr/bin/env node --harmony

const yargs = require('yargs') // eslint-disable-line
  .command(['lmdb2osc', '*'], 'Realtime playback of an LMDB file as OSC packets', () => {}, (argv) => {
    process.env.IN_FILE = argv.infile
    process.env.FPS = argv.fps
    process.env.ADDR_LOCAL = argv.local
    process.env.ADDR_REMOTE = argv.remote
    if (argv.address) {
      process.env.OSC_ADDRESS = argv.address
    }
    if (argv.debug) {
      process.env.DEBUG = 'cl:*,' + process.env.DEBUG
    }
    require('../core/playback')
  })
  .option('infile', {
    alias: 'i',
    describe: 'LMDB input file',
    required: true
  })
  .option('fps', {
    alias: 'f',
    describe: 'Target frames per second',
    default: '50.0'
  })
  .option('local', {
    alias: 'l',
    describe: 'Local OSC address to listen on',
    default: '127.0.0.1:8888'
  })
  .option('remote', {
    alias: 'r',
    describe: 'Remote OSC address to send to',
    default: '127.0.0.1:9999'
  })
  .option('address', {
    alias: 'a',
    describe: 'Override default OSC address'
  })
  .option('debug', {
    alias: 'd',
    default: false
  })
  .help()
  .argv
