import TinyEmitter from 'tiny-emitter'
import path from 'path'
import fs from 'mz/fs'
import mkdirp from 'mkdirp-promise'
import moment from 'moment'
import writeFileAtomic from 'write-file-atomic'
import Promise from 'bluebird'

class BaseFile extends TinyEmitter {
  constructor (config = {}, data = undefined) {
    super()

    const defaultConfig = {
      meta: {},
      opts: {
        atomic: true,
        ext: undefined
      }
    }

    this._config = Object.assign({}, defaultConfig)
    if (typeof config === 'object') this._config = Object.assign(this._config, config)
    this._data = data
  }

  load (filepath) {
    const _ctx = this
    return fs.readFile(path.resolve(filepath))
      .then(data => _ctx._decoder(data))
      .then(data => Object.assign(_ctx, data))
      .catch(err => { throw err })
  }

  save (filepath, createPath = true) {
    const _ctx = this
    filepath = path.resolve(filepath)
    return Promise.resolve()
      .then(() => {
        if (createPath === true) {
          return mkdirp(path.dirname(filepath))
            .catch(err => {
              console.log(err)
            })
        }
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
      .then(data => _ctx._encoder(_ctx))
      .then(data => {
        return Promise.promisify(writeFileAtomic)(filepath, data, {})
      })
      .catch(err => {
        throw err
      })
  }

  _decoder (data) {
    return Promise.resolve(data)
  }

  _encoder (data) {
    return Promise.resolve(data)
  }

  get config () {
    return this._config
  }
  set config (val) {
    this._config = val
  }
  get data () {
    return this._data
  }
  set data (val) {
    this._data = val
  }
  get meta () {
    return this._config.meta
  }
  set meta (val) {
    this._config.meta = val
  }
}

export default BaseFile
