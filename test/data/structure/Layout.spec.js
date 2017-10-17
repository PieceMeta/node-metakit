const
  helper = require('../../helper'),
  chai = require('chai')
chai.should()

const Chance = require('chance'),
  chance = new Chance(),
  Layout = require(helper.requirePath('data/structure')).Layout

const config = {
  meta: {
    title: chance.sentence()
  }
}

let layout

describe('data.structure.Layout', () => {
  it('Creates new empty Layout', () => {
    layout = new Layout(config)
    layout.should.be.instanceOf(Layout)
  })
})
