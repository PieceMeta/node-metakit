'use strict';

require('colors');
const path = require('path'),
      fs = require('mz/fs'),
      Promise = require('bluebird'),
      Logger = require('../services').Logger,
      LMDB = require('../io/file/index').LMDB,
      LineChart = require('../plot').LineChart;

const lmdb = new LMDB(),
      infile = path.resolve(process.env.IN_FILE);

lmdb.openEnv(infile);

Promise.map(lmdb.dbIds, function (id) {
  lmdb.openDb(id);
  const txn = lmdb.beginTxn(true);
  lmdb.initCursor(txn, id);

  let entry = lmdb.getCursorData(txn, id, false),
      scope = process.env.GLOBAL_RANGE ? 'g' : 'l',
      plots = [],
      valueRange = { min: Number.MAX_VALUE, max: Number.MIN_VALUE };
  while (entry) {
    for (let i in entry.data) {
      if (i > 0) {
        if (i - 1 >= plots.length) plots.push([]);
        if (entry.data[i] < valueRange.min) valueRange.min = entry.data[i];
        if (entry.data[i] > valueRange.max) valueRange.max = entry.data[i];
        plots[i - 1].push({ key: entry.data[0], value: entry.data[i] });
      }
    }
    lmdb.advanceCursor(id, false);
    entry = lmdb.getCursorData(txn, id, false);
  }

  lmdb.close();

  if (process.env.ROUND_RANGE) {
    valueRange = { min: Math.floor(valueRange.min), max: Math.ceil(valueRange.max) };
  }

  if (process.env.SYMMETRIC) {
    const min = valueRange.min < 0 && Math.abs(valueRange.min) > valueRange.max ? valueRange.min : valueRange.max * Math.sign(valueRange.min),
          max = valueRange.max > 0 && Math.abs(valueRange.min) > valueRange.max ? Math.abs(valueRange.min) : valueRange.max;
    valueRange = { min, max };
  }

  console.log(`MIN value ${valueRange.min}`.yellow);
  console.log(`MAX value ${valueRange.max}`.yellow);

  const useRange = process.env.GLOBAL_RANGE || process.env.COMBINED_PLOT || process.env.SYMMETRIC,
        useLine = process.env.USE_LINE,
        useDot = process.env.USE_DOT;

  function makePlot(data, i) {
    const plotter = new LineChart(useRange ? valueRange : undefined, useLine, useDot);
    plotter.data = data;
    let pad = i < 9 ? '0' : '',
        filename = path.basename(infile, path.extname(infile)),
        title = `File: ${filename} - ` + (process.env.COMBINED_PLOT ? `Combined Channels` : `Channel #${pad}${i + 1}`),
        variant = process.env.COMBINED_PLOT ? 'comb' : `ch${pad}${i + 1}`,
        symmetric = process.env.SYMMETRIC ? 'sym-' : '';
    console.log(`Plot #${i + 1}: ${title}`);
    return plotter.makePlot(12000, 1080, 250, title).then(chart => {
      return fs.writeFile(path.join(__dirname, '..', '..', 'plots', `${filename}-${symmetric}${scope}-${variant}.svg`), chart);
    });
  }

  if (process.env.COMBINED_PLOT) {
    return makePlot(plots, 0);
  }
  return Promise.map(plots, (plot, i) => {
    return makePlot(plot, i);
  }, { concurrency: 4 });
}, { concurrency: 1 }).then(() => {
  process.exit(0);
}).catch(err => {
  Logger.error(err.message);
  Logger.debug(err.stack, 'mtk:plot');
  process.exit(err.code);
});