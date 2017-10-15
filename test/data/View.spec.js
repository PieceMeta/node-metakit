const chai = require('chai'),
  uuidValidate = require('uuid-validate')
chai.should()

const Chance = require('chance'),
  chance = new Chance(),
  data = require('../../src/data')

describe('data.View', () => {
  it('Creates and inits new empty data View', () => {
    const config = {
      meta: {
        title: chance.sentence(),
        foo: 'bar'
      }
    }
    return new data.View(config)
      .init()
      .then(view => {
        view.should.be.instanceOf(data.View)
        view._config.meta.should.deep.equal(config.meta)
        uuidValidate(view._config.id, 4).should.equal(true)
        view._dirty.should.equal(true)
      })
  })
})
