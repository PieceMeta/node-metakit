import TinyEmitter from 'tiny-emitter'
import slug from 'slug'
import uuid4 from 'uuid/v4'

import { Fragment } from './index'

class Layout extends TinyEmitter {
  constructor (config = {}, data = undefined) {
    super()
    const defaultConfig = {
      meta: {},
      paths: {},
      fragments: [],
      basepath: null,
      dbs: {}
    }
    let dbId
    this._config = Object.assign({}, defaultConfig)
    this._config = Object.assign(this._config, config)
    if (!this._config.meta.created) {
      this._id = uuid4()
      this._config.id = this.id
      if (this.hasStorage === true) dbId = this._db.createDb(this.id, false)
      else dbId = uuid4()
      this.config.dbs[dbId] = {
        type: 'LMDB',
        id: dbId,
        config: {}
      }
    }
    else {
      if (this.hasStorage === true) this._db.openDb(this.id)
    }
    if (typeof data === 'object') {
      this.configureLayoutChildren(data)
    }
  }

  configureLayoutChildren (data, parentPath = '') {
    const _ctx = this
    return Promise.each(_ctx.config.fragments, fragment => {
      fragment.slug = slug(fragment.title || fragment.id)
      let currentPath = `${parentPath}/${fragment.slug}`
      _ctx.config.paths[currentPath] = fragment.id
      return Promise.resolve()
        .then(() => {
          if (Array.isArray(fragment.children) && fragment.children.length) {
            return this.configureLayoutChildren(data, `${currentPath}`)
          }
          return this
        }).then(layout => {
          const fragment = new Fragment(layout)
          _ctx.fragments[fragment.id] = fragment
          return this
        })
    })
  }

  get id () {
    return this._id
  }
  get dbs () {
    return this._config.dbs
  }
  get fragments () {
    return this._config.fragments
  }
  get hasStorage () {
    return (this._config.basepath)
  }
}

export default Layout
