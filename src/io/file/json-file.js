import BaseFile from './base-file'

class JSONFile extends BaseFile {
  constructor () {
    super({
      opts: {
        atomic: true,
        ext: '.json'
      }
    })
  }

  // FIXME: one is static, one is not... needs to be one way or the other, not both
  static _decoder (data) {
    return new Promise(resolve => {
      resolve(JSON.parse(data))
    })
  }

  _encoder (data) {
    return new Promise(resolve => {
      resolve((typeof data.toJSON === 'function' ? data.toJSON() : JSON.stringify(data, null, '\t')))
    }).catch(err => {
      throw err
    })
  }

  static load (filepath) {
    return super.load(filepath)
  }
  save (filepath, createPath = true) {
    // TODO: check what the fuck is going on with all the promise wrapping...
    return Promise.resolve(super.save(filepath, createPath))
  }
}

export default JSONFile
