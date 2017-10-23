const
  helper = require('../../helper'),
  chai = require('chai'),
  path = require('path')
chai.should()

const filepath = path.join(__dirname, '..', '..', '_fixtures', 'Example1.bvh'),
  BVHFile = require(helper.requirePath('io/file')).BVHFile

describe('io.file.BVHFile', () => {
  it(`Parses BVHFile file at ${filepath}`, () => {
    const bvh = new BVHFile()
    bvh.load(filepath)
      .then(() => {
        bvh.data.constructor.name.should.equal('BVHFile')
        bvh.root.constructor.name.should.equal('BVHNode')

        bvh.root.id.should.equal('Hips')
        bvh.root.offsetX.should.equal(0)
        bvh.root.offsetY.should.equal(0)
        bvh.root.offsetZ.should.equal(0)

        bvh.nodeList.length.should.equal(18)
        bvh.root.channels.length.should.equal(6)
        bvh.root.children.length.should.equal(3)
        bvh.root.frames.length.should.equal(2)
      })
  })
})
