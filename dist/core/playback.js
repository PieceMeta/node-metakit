'use strict';

require('colors');
const path = require('path'),
      moment = require('moment'),
      CLI = require('clui'),
      CompressFPS = require('../processors').CompressFPS,
      Double = require('../data/types/double'),
      Scheduler = require('../services').Scheduler,
      Stats = require('../services').Stats,
      Logger = require('../services').Logger,
      LMDB = require('../io/file').LMDB,
      OSC = require('../io/net').OSC;

const streams = {},
      spinner = new CLI.Spinner(),
      lmdb = new LMDB(),
      osc = new OSC({
  localAddress: process.env.ADDR_LOCAL,
  localPort: process.env.PORT_LOCAL,
  remoteAddress: process.env.ADDR_REMOTE,
  remotePort: process.env.PORT_REMOTE
});

lmdb.openEnv(path.resolve(process.env.IN_FILE));
osc.on('ready', function () {
  Logger.debug('Ready', 'cl:osc');

  for (let id of lmdb.dbIds) {
    Logger.debug('Init', 'mtk:scheduler');
    let bundle, keyMillis, busy;
    const address = process.env.OSC_ADDRESS || `/${id.split('-')[0]}`,
          proc = {
      seq: new Scheduler(),
      frames: new CompressFPS(),
      stats: new Stats()
    };
    proc.frames.fps = process.env.FPS;
    streams[id] = proc;

    Logger.log(`Reading data from LMDB database ${id}...\n`.cyan + `Sending packets to osc://${process.env.ADDR_REMOTE}:${process.env.PORT_REMOTE}${address} ` + `at ${Double(process.env.FPS).toFixed(3)}fps\n\n`.yellow);

    lmdb.openDb(id);
    const txn = lmdb.beginTxn(true);
    lmdb.initCursor(txn, id);

    proc.seq.interval(`${proc.frames.interval.micros}u`, function () {
      if (process.env.DEBUG) proc.stats.getFrameDiff();
      proc.stats.workTime = proc.seq.duration(function () {
        if (busy) throw new Error('Scheduler calls overlap');
        busy = true;

        if (bundle) {
          osc.sendBundle(bundle);
          let msg = `Sending... ${moment(Math.round(keyMillis)).format('HH:mm:ss:SSS')} (Ctrl-C to exit)`;
          if (process.env.DEBUG) proc.stats.checkSlowFrame(proc.frames.interval);else if (spinner) spinner.message(msg);
        }

        let keyDiff,
            entry = lmdb.getCursorData(txn, id, true);
        keyMillis = entry.key;
        keyDiff = entry.key.minus(keyMillis);
        proc.frames.data = entry.data;
        while (keyDiff.lt(proc.frames.interval.millis) && keyDiff.gte(Double(0))) {
          proc.frames.interpolate(entry.data, CompressFPS.INTERPOLATE.MAX);
          lmdb.advanceCursor(id);
          entry = lmdb.getCursorData(txn, id, true);
          keyDiff = entry.key.minus(keyMillis);
        }

        bundle = OSC.buildMessage(address, streams[id].frames.data);
        busy = false;
      });

      if (process.env.DEBUG) {
        Logger.debug(`Work: ${proc.stats.workTime}μs`, 'mtk:scheduler');
      }
    });
  }

  if (!process.env.DEBUG) spinner.start();
});