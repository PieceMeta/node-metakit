import TinyEmitter from 'tiny-emitter'
import path from 'path'
import fs from 'mz/fs'
import mkdirp from 'mkdirp-promise'
import moment from 'moment'
import writeFileAtomic from 'write-file-atomic'

const defaultConfig = {
  encoder: data => Promise.resolve(data),
  decoder: data => Promise.resolve(data),
  meta: {},
  opts: {
    atomic: true,
    ext: undefined
  }
}

class BaseFile extends TinyEmitter {
  constructor (config = {}) {
    super()
    this._config = Object.assign({}, defaultConfig)
    this._config = Object.assign(this._config, config)
    this._data = undefined
  }

  load (filepath) {
    const _ctx = this
    return fs.readFile(path.resolve(filepath))
      .then(data => _ctx._config.decoder(_ctx))
      .catch(err => {
        throw err
      })
  }

  save (filepath, createPath = true) {
    const _ctx = this
    filepath = path.resolve(filepath)
    Promise.resolve()
      .then(() => {
        if (createPath === true) return mkdirp(path.dirname(filepath))
      })
      .then(() => {
        const fp = filepath
        filepath = path.join(path.dirname(fp),
          `${path.basename(fp, _ctx._config.opts.ext)}${_ctx._config.opts.ext || ''}`)

        if (_ctx._config.meta) {
          const now = moment()
          if (!_ctx._config.meta.created) _ctx._config.meta.created = now
          _ctx._config.meta.updated = now
        }

        return _ctx
      })
      .then(data => _ctx._config.encoder(data))
      .then(data => writeFileAtomic(filepath, data))
      .catch(err => {
        throw err
      })
  }

  get data () {
    return this._data
  }
  get meta () {
    return this._config.meta
  }
}

export default BaseFile
