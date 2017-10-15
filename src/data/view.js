import Fragment from './fragment'
import uuid4 from 'uuid/v4'
import moment from 'moment'
import Promise from 'bluebird'
import slug from 'slug'
import fs from 'mz/fs'
import path from 'path'
import assert from 'assert'

import LMDB from '../output/lmdb'
import DataError from './data-error'

class View {
  constructor (config = {}, basepath = undefined) {
    this._dirty = false
    this._db = undefined
    this._basepath = basepath
    this._config = Object.assign({
      id: undefined,
      meta: {},
      layout: [],
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

  init () {
    const _view = this
    let data = {},
      paths = {}
    return this._configureLayoutChildren(data, this._config.layout, paths)
      .then(res => {
        _view._data = res.data
        _view._paths = res.paths
        if (!this.meta.created) {
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

  _hasStorage () {
    return (this._basepath && this._config.storage)
  }
  _configureLayoutChildren (data, children, paths, parentPath = '') {
    return Promise.each(children, entry => {
      if (!this.meta.created) {
        if (this._hasStorage()) entry.id = this._db.createDb(entry.id, false)
        else entry.id = uuid4()
      }
      else {
        if (this._hasStorage) this._db.openDb(entry.id)
      }
      entry.slug = slug(entry.title || entry.id)
      let currentPath = `${parentPath}/${entry.slug}`
      paths[currentPath] = entry.id
      return Promise.resolve()
        .then(() => {
          if (Array.isArray(entry.children) && entry.children.length) {
            return this._configureLayoutChildren(data, entry.children, paths, `${currentPath}`)
          }
          return { data, paths }
        }).then(res => {
          res.data[entry.id] = new Fragment(entry)
          return res
        })
    }).then(() => { return { data, paths } })
  }

  static load (filepath) {
    assert.equal(typeof filepath, 'string', DataError.messages[DataError.types.BAD_PARAMS])
    return fs.readFile(path.resolve(filepath)).then(data => {
      const view = new View(JSON.parse(data), path.dirname(filepath))
      return view
    })
  }

  static save (filepath, view) {
    assert.equal(typeof filepath, 'string', DataError.messages[DataError.types.BAD_PARAMS])
    const file = path.join(filepath, `${view._config.id}.json`)
    return fs.writeFile(file, view.toJSON()).then(() => {
      view._dirty = false
      return view
    })
  }
}

export default View
