import BaseFile from './base-file'
import BVH from 'bvh'

class BVHFile extends BaseFile {
  _decoder (data) {
    return Promise.resolve(BVH.parse(data.toString()))
  }
  load (filepath) {
    const _ctx = this
    return super.load(filepath).then(data => { _ctx._data = data })
  }
}

export default BVHFile
