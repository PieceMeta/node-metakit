import path from 'path'
import BaseProcessor from '../base-processor'
// import CSVToHDF5 from './csv-to-hdf5'

const
  CONVERT_MODE_CSV_TO_LMDB = { id: 0, file: 'csv-to-lmdb.js' },
  CONVERT_MODE_CSV_TO_HDF5 = { id: 1, file: 'csv-to-hdf5.js' },
  _convertModes = {
    CONVERT_MODE_CSV_TO_LMDB,
    CONVERT_MODE_CSV_TO_HDF5
  }

class Converter extends BaseProcessor {
  constructor (config = {}, mode = CONVERT_MODE_CSV_TO_LMDB) {
    super()
    this._config = config
    this._mode = mode
  }
  setMode (mode) {
    let file
    switch (mode) {
      case CONVERT_MODE_CSV_TO_LMDB.id:
        file = CONVERT_MODE_CSV_TO_LMDB.file
        break
      case CONVERT_MODE_CSV_TO_HDF5.id:
        file = CONVERT_MODE_CSV_TO_HDF5.file
        throw new Error('Not implemented')
      default:
        throw new Error('Unknown mode')
    }
    this._mode = mode
    super.processorFunction = require(path.join(__dirname, file))
  }
}

Object.defineProperty(Converter, 'modes',
  { value: _convertModes, writable: false, configurable: false })

export default Converter
