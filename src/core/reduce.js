require('colors')
const path = require('path'),
  Big = require('big.js'),
  CLI = require('clui'),
  LMDB = require('../io/file/index').LMDB,
  // HDF5 = require('../io').HDF5,
  Stats = require('../services').Stats

const infile = path.resolve(process.env.IN_FILE),
  outfile = path.resolve(process.env.OUT_FILE),
  // basename = path.basename(outfile, path.extname(outfile)),
  statsThreshold = parseInt(process.env.STATS_THRESHOLD) || 100000,
  flushThreshold = parseInt(process.env.FLUSH_THRESHOLD) || 1000,
  fps = process.env.FPS ? Big(process.env.FPS) : Big('100.0'),
  interval = Big('1000.0').div(fps),
  debug = (process.env.DEBUG_MODE),
  spinner = new CLI.Spinner('Reducing...'),
  lmdb = new LMDB(),
  lmdbOut = new LMDB()

lmdb.openEnv(infile)
lmdbOut.openEnv(outfile)

const readCounter = function (count, stats, statsOut) {
  count++
  if (count % statsThreshold === 0) {
    stats.print()
    statsOut.print()
  }
  return count
}

for (let id of lmdb.dbIds) {
  process.stdout.write(`Opening DB ${id}...\n`.cyan)
  if (!debug) spinner.start()
  lmdb.openDb(id)

  const outId = lmdbOut.createDb(Object.assign({}, lmdb.meta[id])),
    txnRead = lmdb.beginTxn(true),
    stats = new Stats(),
    statsOut = new Stats()
  /*
  const hdf = HDF5.createFile(path.join(path.dirname(outfile), `${basename}.h5`)),
    hdfgroup = HDF5.createGroup(hdf, id)
  hdfgroup.title = basename
  hdfgroup.flush()
  */
  let millis = Big('0'),
    nextMillis = Big('0'),
    count = 0,
    // table = false,
    txnWrite = lmdbOut.beginTxn(),
    max, key, data, entry

  lmdb.initCursor(txnRead, id)
  while ((entry = lmdb.getCursorData(txnRead, id, true))) {
    stats.addEntries()
    count = readCounter(count, stats, statsOut)
    if (count % statsThreshold === 0) {
      stats.print()
      statsOut.print()
    }
    max = []
    for (let v of entry.data) max.push(Big(v))
    millis = nextMillis || entry.key
    nextMillis = nextMillis.add(interval)
    while (entry && entry.key.lt(nextMillis)) {
      for (let i in entry.data) {
        let v = Big(entry.data[i])
        if (v.abs().gt(max[i].abs())) {
          max[i] = v
        }
      }
      lmdb.advanceCursor(id, false)
      entry = lmdb.getCursorData(txnRead, id, true)
      stats.addEntries()
      count = readCounter(count, stats, statsOut)
    }
    max[0] = millis
    key = LMDB.stringKeyFromFloat(millis, lmdb.meta[id].key.length,
      lmdb.meta[id].key.precision, lmdb.meta[id].key.signed)
    data = Float64Array.from(max)
    lmdbOut.put(txnWrite, outId, key, data)
    statsOut.addEntries()
    /*
    const records = lmdb.meta[id].labels.map((label, idx) => {
      const column = Float64Array.from([max[idx]])
      column.name = label
      return column
    })
    if (table) {
      HDF5.appendRecords(hdfgroup.id, id, records)
    }
    else {
      HDF5.makeTable(hdfgroup.id, id, records)
      table = true
    }
    */
    if (flushThreshold && statsOut.entries % flushThreshold === 0) {
      process.stdout.write(`Flushing output at ${statsOut.entries} records\n`.yellow)
      lmdbOut.endTxn(txnWrite)
      txnWrite = lmdbOut.beginTxn()
    }
    lmdb.advanceCursor(id, false)
  }

  spinner.stop()

  process.stdout.write('Closing...'.yellow)
  lmdbOut.endTxn(txnWrite)
  lmdbOut.close()
  // hdfgroup.close()
  // hdf.close()
  lmdb.endTxn(txnRead, false)
  lmdb.close()
  process.stdout.write('Done.\n'.yellow)

  process.stdout.write('\nINPUT'.cyan)
  stats.print()
  process.stdout.write('\nOUTPUT'.cyan)
  statsOut.print()
}
