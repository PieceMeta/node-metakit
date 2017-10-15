const chai = require('chai'),
  path = require('path'),
  uuidValidate = require('uuid-validate')
chai.should()

const Chance = require('chance'),
  chance = new Chance(),
  data = require('../../src/data')

describe('data.Package', () => {
  it('Creates new empty data Package', () => {
    const filepath = path.resolve(`/var/tmp/mtk-testpkg-${chance.word({syllables: 3})}`)
    const config = {
      meta: {
        title: chance.sentence(),
        foo: 'bar'
      }
    }
    const pkg = new data.Package(filepath, config)
    pkg.should.be.instanceOf(data.Package)
    pkg._filepath.should.equal(filepath)
    pkg._config.meta.should.deep.equal(config.meta)
    uuidValidate(pkg._config.id, 4).should.equal(true)
    pkg._dirty.should.equal(false)
  })
})
