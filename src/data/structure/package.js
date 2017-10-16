import assert from 'assert'
import path from 'path'
import Promise from 'bluebird'

import { DataError } from '../index'
import { JSONFile } from '../../io/file'

import View from './view'

class Package extends JSONFile {
  constructor (filepath = undefined, config = {}) {
    super(filepath)
    this._dirty = false
    this._filepath = filepath
    this._config = Object.assign(this._config, {
      views: []
    })
    this._config = Object.assign(this._config, config)
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

  toJSON () {
    const conf = Object.assign({}, this._config)
    conf.views = conf.views.map(view => { return view._config.id })
    return JSON.stringify(conf, null, '\t')
  }
  toString () {
    return this.toJSON()
  }

  store (filepath) {
    const _ctx = this
    return Promise.resolve().then(() => {
      return mkdirp(filepath).catch(err => { if (err.code !== 'EEXIST') throw err })
    }).then(() => {
      return JSONFile.save(path.join(filepath, 'index.json'), this.toJSON())
        .then(() => {
          return Promise.each(_ctx.views, view => {
            return view.store(_ctx._filepath)
          })
        })
    })
  }
  close () {
    return Promise.each(this.views, view => view.close())
  }

  static fromFile (filepath) {
    return Package.load(filepath)
      .then(config => new Package(filepath, config))
      .then(pkg => {
        return Promise.map(pkg.views, id => View.fromFile(path.join(filepath, `${id}.json`)))
          .then(views => {
            pkg._config.views = views
            return pkg
          })
      })
  }
}

export default Package
