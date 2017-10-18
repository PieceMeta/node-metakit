const
  helper = require('../../helper'),
  chai = require('chai'),
  path = require('path')
chai.should()

const BVHFile = require(helper.requirePath('io/file')).BVHFile

describe('io.file.BVHFile', () => {
  it('Parses BVHFile file at path', () => {
    const bvh = new BVHFile()
    bvh.load(path.join(__dirname, '..', '..', '_fixtures', 'Example1.bvh'))
      .then(() => {
        bvh.data.constructor.name.should.equal('BVHFile')
        bvh.root.constructor.name.should.equal('BVHNode')

        bvh.root.id.equals('Hips')
        bvh.root.parent.is.null()
        bvh.root.offsetX.equals(0)
        bvh.root.offsetY.equals(0)
        bvh.root.offsetZ.equals(0)

        bvh.nodeList.length.equals(18)
        bvh.root.channels.length.equals(6)
        bvh.root.children.length.equals(3)
        bvh.root.frames.length.equals(2)
      })
  })
})
