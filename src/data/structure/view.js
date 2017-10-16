import uuid4 from 'uuid/v4'
import moment from 'moment'
import Promise from 'bluebird'
import fs from 'mz/fs'
import path from 'path'
import assert from 'assert'

import { Emitter } from '../../messaging'
import { DataError } from '../index'
import { Layout } from './index'
import { LMDB, JSONFile } from '../../io/file'

class View extends Emitter {
  constructor (config = {}, basepath = undefined) {
    super()
    this._dirty = false
    this._db = undefined
    this._basepath = basepath
    this._config = Object.assign({
      id: undefined,
      meta: {},
      layout: null,
      storage: {
        type: 'lmdb',
        mapsize: 4096
      },
      key: {
        length: 16,
        precision: 6,
        signed: true
      }
    }, config)
  }

  init (layoutPath = undefined, create = false) {
    const _view = this
    Promise.resolve()
      .then(() => {
        if (typeof layoutPath !== 'string' || create === true) return new Layout()
        return Layout.fromFile(layoutPath)
      })
      .then(layout => {
        return layout.configureLayoutChildren()
      })
      .then(layout => {
        if (layout.dirty === true) return layout.store(layoutPath)
        return layout
      })
      .then(layout => {
        _view._config.layout = layout
        if (!_view.meta.created) {
          _view._dirty = true
          _view.meta.created = moment()
          _view._config.id = uuid4()
        }
        return _view
      })
  }

  open () {
    if (this._hasStorage()) {
      this._db = new LMDB()
      this._db.openEnv(
        this._basepath,
        this._config.storage.mapsize / 1024,
        this._config.layout.length
      )
    }
    return Promise.resolve()
  }

  close () {
    if (this._hasStorage()) {
      this._db.close()
    }
  }

  get id () {
    return this._config.id
  }
  get layout () {
    return this._config.layout || {}
  }
  get meta () {
    return this._config.meta || {}
  }
  get bytes () {
    const config = this._config
    return this._data ? Object.keys(this._data).reduce((sum, val) => {
      return sum + this._data[val].bytes
    }, 0) + config.key.length : 0
  }
  get hasStorage () {
    return (this._basepath && this._config.storage)
  }

  fragmentById (id) {
    return this._data[id]
  }
  fragmentsByPath (path, exact = false) {
    if (exact) return this._data[this._paths[path]]
    return Object.keys(this._paths)
      .filter(p => { return p.indexOf(path) > -1 })
      .map(p => { return this._data[this._paths[p]] })
  }

  toJSON () {
    return JSON.stringify(this._config, null, '\t')
  }
  toString () {
    return this.toJSON()
  }

  store (filepath) {
    assert.equal(typeof filepath, 'string', DataError.messages[DataError.types.BAD_PARAMS])
    const _ctx = this,
      file = path.join(filepath, `${this._config.id}.json`)
    return JSONFile.save(file, this.toJSON()).then(() => {
      _ctx._dirty = false
      return _ctx
    })
  }

  static fromFile (filepath) {
    assert.equal(typeof filepath, 'string', DataError.messages[DataError.types.BAD_PARAMS])
    return fs.readFile(path.resolve(filepath))
      .then(data => {
        return new View(JSON.parse(data), path.dirname(filepath))
      })
  }
}

export default View
