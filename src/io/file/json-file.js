import BaseFile from './base-file'

class JSONFile extends BaseFile {
  constructor () {
    super({
      encoder: data => JSON.stringify(this, null, '\t'),
      decoder: JSON.parse,
      opts: {
        atomic: true,
        ext: '.json'
      }
    })
  }

  static load (filepath) {
    return super.load(filepath)
  }
  save (filepath) {
    return super.save(filepath, true)
  }
}

export default JSONFile
