import BaseFile from './base-file'

class JSONFile extends BaseFile {
  constructor (data = undefined) {
    super({
      opts: {
        atomic: true,
        ext: '.json'
      }
    }, data)
  }

  _decoder (data) {
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
}

export default JSONFile
