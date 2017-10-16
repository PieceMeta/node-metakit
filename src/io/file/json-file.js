import BaseFile from './base-file'

class JSONFile extends BaseFile {
  constructor (filepath) {
    super({
      filepath,
      encoder: data => JSON.stringify(data, null, '\t'),
      decoder: JSON.parse,
      atomic: true,
      extname: '.json'
    })
    const _ctx = this
    return this.load(filepath).then(data => { _ctx._data = data })
  }

  save (filepath = undefined) {
    const _ctx = this
    return this.save(filepath || _ctx._config.filepath, _ctx.data)
  }
}

export default JSONFile
