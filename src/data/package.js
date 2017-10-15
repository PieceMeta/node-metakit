import assert from 'assert'
import uuid4 from 'uuid/v4'
import fs from 'mz/fs'
import path from 'path'
import moment from 'moment'
import Promise from 'bluebird'

import View from './view'
import DataError from './data-error'

class Package {
  constructor (filepath = undefined, config = {}) {
    this._dirty = false
    this._filepath = filepath
    this._config = Object.assign({
      id: uuid4(),
      meta: {
        created: moment(),
        updated: undefined
      },
      views: []
    }, config)
  }

  addView (layout) {
    assert.equal(typeof this._filepath, 'string', DataError.messages[DataError.types.BAD_PARAMS])
    const views = this._config.views
    return new View(layout)
      .init().then(v => {
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
  get dirty () {
    return this._dirty
  }

  toJSON () {
    const conf = Object.assign({}, this._config)
    conf.views = conf.views.map(view => { return view._config.id })
    return JSON.stringify(conf, null, '\t')
  }
  toString () {
    return this.toJSON()
  }

  close () {
    return Promise.each(this.views, view => view.close())
  }

  static load (filepath) {
    return fs.readFile(path.join(filepath, 'index.json'))
      .then(data => JSON.parse(data))
      .then(config => new Package(filepath, config))
      .then(pkg => {
        return Promise.map(pkg.views, id => View.load(path.join(filepath, `${id}.json`)))
          .then(views => {
            pkg._config.views = views
            return pkg
          })
      })
  }
  static save (pkgpath, pkginstance) {
    return Promise.resolve().then(() => {
      return fs.mkdir(pkgpath).catch(err => { if (err.code !== 'EEXIST') throw err })
    }).then(() => {
      return Promise.each(pkginstance.views, view => {
        return View.save(pkginstance._filepath, view)
      })
    }).then(() => {
      pkginstance.meta.updated = moment()
      const configpath = path.join(path.resolve(pkgpath), 'index.json')
      return fs.writeFile(configpath, pkginstance.toJSON())
        .then(() => { pkginstance._dirty = false })
    })
  }
}

export default Package
