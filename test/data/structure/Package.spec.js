const
  helper = require('../../helper'),
  chai = require('chai'),
  path = require('path'),
  uuidValidate = require('uuid-validate')
chai.should()

const Chance = require('chance'),
  chance = new Chance(),
  Package = require(helper.requirePath('data/structure')).Package

const config = {
  meta: {
    title: chance.sentence(),
    foo: 'bar'
  }
}

let pkg, loadedPkg, filepath

describe('data.structure.Package', () => {
  it('Creates new empty data Package', () => {
    filepath = path.resolve(`/tmp/mtkpkg-${chance.word({syllables: 3})}`)
    pkg = new Package(filepath, config)
    pkg.should.be.instanceOf(Package)
    pkg.meta.should.deep.equal(config.meta)
    uuidValidate(pkg.id, 4).should.equal(true)
    pkg.isDirty.should.equal(false)
  })
  it('Stores a package config as a collection of JSON files', () => {
    return pkg.save(filepath)
  })
  it('Loads package config from JSON files', () => {
    return Package.load(path.dirname(filepath))
      .then(data => {
        loadedPkg.should.contain(data)
      })
  })
})
