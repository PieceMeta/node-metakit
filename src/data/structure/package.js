import assert from 'assert'
import path from 'path'
import Promise from 'bluebird'
import uuid4 from 'uuid/v4'

import { DataError } from '../index'
import { JSONFile } from '../../io/file'

import View from './view'

const defaultConfig = {
  id: undefined,
  views: []
}

class Package extends JSONFile {
  constructor (filepath = null, config = {}) {
    super(filepath)
    this._dirty = false
    this._config = Object.assign(super.config || {}, defaultConfig)
    this._config = Object.assign(this._config, config)
    if (!this._config.id) this._config.id = uuid4()
  }

  addView (layout) {
    assert.equal(typeof this._filepath, 'string', DataError.messages[DataError.types.BAD_PARAMS])
    const views = this._config.views
    return new View(layout)
      .init()
      .then(v => {
        views.push(v)
        this._dirty = true
        return v.id
      })
  }
  getViewById (id) {
    const view = this.views.find(view => {
      return view.id === id
    })
    return new Promise(resolve => {
      resolve(view)
    })
  }

  get id () {
    return this._config.id
  }
  get meta () {
    return this._config.meta
  }
  set meta (val) {
    assert.equal(typeof val, 'object')
    this._config.meta = Object.assign(this._config.meta, val)
    this._dirty = true
  }
  get views () {
    return this._config.views
  }
  get isDirty () {
    return this._dirty === true
  }

  toJSON () {
    const conf = Object.assign({}, this._config)
    conf.views = conf.views.map(view => { return view._config.id })
    return JSON.stringify(conf, null, '\t')
  }
  toString () {
    return this.toJSON()
  }

  static load (filepath) {
    assert.equal(typeof filepath, 'string')
    return super.load(path.join(filepath, 'index.json'))
      .then(config => {
        return new Package(filepath, config)
      })
  }
  save (filepath) {
    const _ctx = this
    return super.save(path.join(filepath, 'index.json'), true)
      .then(() => {
        return Promise.each(_ctx.views, view => view.store(filepath))
      })
  }
  close () {
    return Promise.each(this.views, view => view.close())
  }
}

export default Package
