const chai = require('chai'),
  path = require('path'),
  chance = new (require('chance'))(),
  uuidValidator = require('uuid-validate')
chai.should()

const LMDB = require('../../../src/io/file').LMDB,
  TypedBufferView = require('../../../src/data/structure').TypedBufferView,
  data = require('../../../src/data')

const config = {
  filepath: path.resolve(`/var/tmp/mtk-testlmdb-${chance.word({syllables: 3})}`),
  max_gb: 4,
  max_dbs: 10,
  generate_entries: 200,
  entry_length: 100,
  key_length: 32
}

let lmdb, dbId, txn, vals = []

describe('io.file.LMDB', () => {
  it(`Initializes a new LMDB environment with max ${config.max_gb}GB and ${config.max_dbs} DB(s)`, () => {
    lmdb = new LMDB()
    lmdb.should.be.instanceOf(LMDB)

    lmdb.openEnv(config.filepath, config.max_gb, config.max_dbs)
    lmdb._filename.should.equal(config.filepath)
    lmdb.env.constructor.name.should.equal('Env')
    lmdb.meta.should.deep.equal({})
    lmdb.dbIds.length.should.equal(0)
  })
  it('Creates a database in the environment and writes metadata to disk', () => {
    const meta = {
      title: chance.sentence({words: 4}),
      description: chance.sentence()
    }
    lmdb.createDb(meta, true)
    lmdb.dbIds.length.should.equal(1)
    uuidValidator(lmdb.dbIds[0], 4).should.equal(true)
    lmdb.meta[lmdb.dbIds[0]].should.deep.equal(meta)
    dbId = lmdb.dbIds[0]
    lmdb._meta[dbId].dbi.constructor.name.should.equal('Dbi')
  })
  it('Closes the DB', () => {
    lmdb.closeDb(dbId)
    lmdb._meta[dbId].should.have.deep.property('dbi', null)
  })
  it('Opens the DB', () => {
    lmdb.openDb(dbId)
    lmdb.dbIds.length.should.equal(1)
    lmdb.dbIds[0].should.equal(dbId)
    lmdb._meta[dbId].dbi.constructor.name.should.equal('Dbi')
  })
  it('Begins a write transaction', () => {
    txn = lmdb.beginTxn()
    txn.constructor.name.should.equal('Txn')
  })
  it(`Writes ${config.generate_entries} records, each with ${config.entry_length}x random doubles ` +
    `using ${config.key_length} chars wide string keys`, () => {
    for (let i = 0; i < config.generate_entries; i += 1) {
      const _arr = new Float64Array(config.entry_length).map(() => {
        return chance.floating()
      })
      vals.push(_arr)
      lmdb.put(txn, dbId, data.util.keyFromDouble(i, config.key_length), _arr.slice())
    }
  })
  it('Commits write transaction', () => {
    lmdb.endTxn(txn, true)
  })
  it('Begins a read transaction', () => {
    txn = lmdb.beginTxn(true)
    txn.constructor.name.should.equal('Txn')
  })
  it('Acquires a cursor at default position (first entry)', () => {
    lmdb.initCursor(txn, dbId)
    lmdb._meta[dbId].should.have.property('cursor')
    lmdb._meta[dbId].cursor.key.should.equal(data.util.keyFromDouble(0, config.key_length))
  })
  it('Gets parsed data at current cursor position and does not parse key', () => {
    const result = lmdb.getCursorData(txn, dbId, false)
    result.should.have.property('key')
    result.should.have.property('data')
    result.data.should.be.instanceOf(TypedBufferView)
    let i = 0
    for (let v of result.data) {
      v.should.equal(vals[0][i])
      i++
    }
  })
  it('Gets parsed data at current cursor position and parses key to double (Big)', () => {
    const result = lmdb.getCursorData(txn, dbId, true)
    result.should.have.property('key')
    result.key.constructor.name.should.equal('Double')
    result.key.valueOf().should.equal('0')
    result.key.toString().should.equal('0')
  })
  it('Gets raw bytes at current cursor position', () => {
    const result = lmdb.getCursorRaw(txn, dbId, false)
    result.should.have.property('key')
    result.key.should.equal(data.util.keyFromDouble(0, config.key_length))
    result.should.have.property('buffer')
    result.buffer.should.be.instanceOf(Uint8Array)
    result.buffer.length.should.equal(config.entry_length * Float64Array.BYTES_PER_ELEMENT)
  })
  it('Advances cursor through all records without looping', () => {
    let result, n = 0
    while (lmdb.cursors[dbId].nextKey) {
      lmdb.advanceCursor(dbId, false)
      n++
      result = lmdb.getCursorData(txn, dbId, false)
      let i = 0
      for (let v of result.data) {
        v.should.equal(vals[n][i])
        i++
      }
    }
  })
  it('Aborts readonly transaction', () => {
    lmdb.endTxn(txn, false)
  })
  it('Closes the LMDB environment', () => {
    lmdb.close()
    lmdb.should.have.deep.property('env', null)
  })
})
