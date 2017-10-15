import assert from 'assert'
import { hdf5, h5tb } from 'hdf5'
import hdfGlobals from 'hdf5/lib/globals'

class HDF5 {
  static appendRecords (id, title, records) {
    assert.notEqual(typeof id, 'undefined')
    assert.equal(typeof title, 'string')
    assert.ok(Array.isArray(records))
    h5tb.appendRecords(id, title, records)
  }
  static makeTable (id, title, model) {
    assert.notEqual(typeof id, 'undefined')
    assert.equal(typeof title, 'string')
    assert.ok(Array.isArray(model))
    h5tb.makeTable(id, title, model)
  }
  static createGroup (file, groupName) {
    assert.notEqual(typeof file, 'undefined')
    assert.equal(typeof groupName, 'string')
    return file.createGroup(groupName)
  }
  static createFile (filename) {
    return new hdf5.File(filename, hdfGlobals.Access.ACC_TRUNC)
  }
  static get TYPES () {
    return {
      FLOAT64: 0
    }
  }
}

export default HDF5
