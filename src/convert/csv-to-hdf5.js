import 'colors'
import Emitter from 'tiny-emitter'
import path from 'path'
import * as input from '../input'
import * as output from '../output'
import { Stats, padString, parseDouble } from '../util'

const csvToHDF5 = function (infile, outdir, options = {}, statusHandler = undefined, endHandler = undefined) {
  process.stdout.write(`\nCSV 2 HDF5 ${new Array(61).fill('-').join('')}\n\n`.cyan)
  options = Object.assign({
    flushEvery: 10000,
    dataStart: 0,
    type: output.HDF5.TYPES.FLOAT64
  }, options)
  const emitter = new Emitter(),
    stats = new Stats()
  if (typeof statusHandler === 'function') {
    emitter.on('status', statusHandler)
  }
  if (typeof endHandler === 'function') {
    emitter.on('end', endHandler)
  }
  return new Promise(function (resolve, reject) {
    let row = 0, hasError = false, basename, outfile, table, group
    const meta = {}

    const onData = function (data) {
        if (row >= options.dataStart) {
          const records = meta.labels.map((label, idx) => {
            const parsed = parseDouble(data[idx])
            hasError = hasError || parsed === null
            const column = Float64Array.from([hasError ? 0.0 : parsed])
            column.name = label
            return column
          })
          if (hasError) {
            stats.addErrors()
          }
          else {
            if (table) {
              output.HDF5.appendRecords(group.id, basename, records)
            }
            else {
              output.HDF5.makeTable(group.id, basename, records)
              table = true
              emitter.emit('status', padString('Parsing rows... ', 32))
            }
            stats.addEntries()
          }
          if (stats.entries % options.flushEvery === 0) {
            group.flush()
            outfile.flush()
            emitter.emit('status', padString(`Parsed ${stats.entries} rows...`, 32))
          }
        }
        else {
          if (Array.isArray(options.metaRange) && row >= options.metaRange[0] && row < options.metaRange[1]) {
            meta[data[0]] = data[1]
          }
          else if (typeof options.labelRow === 'number' && row === options.labelRow) {
            meta.labels = data
          }
          if (options.dataStart === 0 || row === options.dataStart - 1) {
            basename = path.basename(infile, path.extname(infile))
            const outpath = path.join(outdir, `${basename}.h5`)
            process.stdout.write(`Opening HDF5 file for output at:\n${outpath}\n\n`)
            outfile = output.HDF5.createFile(outpath)
            group = output.HDF5.createGroup(outfile, basename)
            for (let key in meta) {
              if (typeof meta === 'string' || typeof meta === 'number') {
                group[key] = meta[key]
              }
            }
            group.flush()
          }
        }
        row++
      },
      onEnd = function (err) {
        emitter.emit('end')
        process.stdout.write(`Parsed ${stats.entries} rows, closing file...`.yellow)
        group.close()
        outfile.close()
        process.stdout.write('Done.\n'.yellow)
        if (err) {
          return reject(err)
        }
        resolve(stats)
      }

    input.CSV.parseFile(infile, onData, onEnd)
  })
}

export default csvToHDF5
