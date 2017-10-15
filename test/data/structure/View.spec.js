const chai = require('chai'),
  uuidValidate = require('uuid-validate')
chai.should()

const Chance = require('chance'),
  chance = new Chance(),
  View = require('../../../src/data/structure/index').View

describe('data.structure.View', () => {
  it('Creates and inits new empty data View', () => {
    const config = {
      meta: {
        title: chance.sentence(),
        foo: 'bar'
      }
    }
    return new View(config)
      .init()
      .then(view => {
        view.should.be.instanceOf(View)
        view._config.meta.should.deep.equal(config.meta)
        uuidValidate(view._config.id, 4).should.equal(true)
        view._dirty.should.equal(true)
      })
  })
})
