const chai = require('chai'),
  path = require('path'),
  uuidValidate = require('uuid-validate')
chai.should()

const Chance = require('chance'),
  chance = new Chance(),
  Package = require('../../../src/data/structure').Package

const config = {
  meta: {
    title: chance.sentence(),
    foo: 'bar'
  }
}

let pkg, filepath

describe('data.structure.Package', () => {
  it('Creates new empty data Package', () => {
    filepath = path.resolve(`/var/tmp/mtk-testpkg-${chance.word({syllables: 3})}`)
    pkg = new Package(filepath, config)
    pkg.should.be.instanceOf(Package)
    pkg._filepath.should.equal(filepath)
    pkg._config.meta.should.deep.equal(config.meta)
    uuidValidate(pkg._config.id, 4).should.equal(true)
    pkg._dirty.should.equal(false)
  })
  it('Stores a package config as JSON file', () => {
    return pkg.store(path.join(filepath, 'index.json'))
  })
  it('Loads package config from JSON file', () => {
    return Package.fromFile(path.join(filepath, 'index.json'))
      .then(loadedPkg => {
        pkg.should.contain(loadedPkg)
      })
  })
})
