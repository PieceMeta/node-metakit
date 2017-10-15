require('colors')
const path = require('path'),
  moment = require('moment'),
  Big = require('big.js'),
  CLI = require('clui'),
  PB = require('../playback'),
  Stats = require('../util').Stats,
  Logger = require('../util').Logger,
  LMDB = require('../output').LMDB

const streams = {},
  spinner = new CLI.Spinner(),
  lmdb = new LMDB(),
  osc = new PB.OSC(
    process.env.ADDR_LOCAL,
    process.env.ADDR_REMOTE,
    process.env.ADDR_REMOTE.indexOf('.255:') !== -1
  )

lmdb.openEnv(path.resolve(process.env.IN_FILE))
osc.on('ready', function () {
  Logger.debug('Ready', 'cl:osc')

  for (let id of lmdb.dbIds) {
    Logger.debug('Init', 'mtk:scheduler')
    let bundle, keyMillis, busy
    const address = process.env.OSC_ADDRESS || `/${id.split('-')[0]}`,
      proc = {
        seq: new PB.Scheduler(),
        frames: new PB.Frames(),
        stats: new Stats()
      }
    proc.frames.fps = process.env.FPS
    streams[id] = proc

    Logger.log(`Reading data from LMDB database ${id}...\n`.cyan +
      `Sending packets to osc://${process.env.ADDR_REMOTE}${address} ` +
      `at ${Big(process.env.FPS).toFixed(2)}fps\n\n`.yellow)

    lmdb.openDb(id)
    const txn = lmdb.beginTxn(true)
    lmdb.initCursor(txn, id)

    proc.seq.interval(`${proc.frames.interval.micros}u`, function () {
      if (process.env.DEBUG) proc.stats.getFrameDiff()
      proc.stats.workTime = proc.seq.duration(function () {
        if (busy) throw new Error('Scheduler calls overlap')
        busy = true

        if (bundle) {
          osc.sendBundle(bundle)
          let msg = `Sending... ${moment(Math.round(keyMillis)).format('HH:mm:ss:SSS')} (Ctrl-C to exit)`
          if (process.env.DEBUG) proc.stats.checkSlowFrame(proc.frames.interval)
          else if (spinner) spinner.message(msg)
        }

        let keyDiff, entry = lmdb.getCursorData(txn, id, true)
        keyMillis = entry.key
        keyDiff = entry.key.minus(keyMillis)
        proc.frames.data = entry.data
        while (keyDiff.lt(proc.frames.interval.millis) && keyDiff.gte(Big(0))) {
          proc.frames.interpolate(entry.data, PB.Frames.INTERPOLATE.MAX)
          lmdb.advanceCursor(id)
          entry = lmdb.getCursorData(txn, id, true)
          keyDiff = entry.key.minus(keyMillis)
        }

        bundle = PB.OSC.buildMessage(address, streams[id].frames.data)
        busy = false
      })

      if (process.env.DEBUG) {
        Logger.debug(`Work: ${proc.stats.workTime}μs`, 'mtk:scheduler')
      }
    })
  }

  if (!process.env.DEBUG) spinner.start()
})
