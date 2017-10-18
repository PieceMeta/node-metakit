import 'colors'
import path from 'path'

import Emitter from '../../messaging/base-emitter'
import Double from '../../data/types/double'

import { util, types } from '../../data/index'
import { BVHFile, LMDB } from '../../io/file/index'

const BVHToLMDB = function (infile, outdir, options = {}, statusHandler = undefined, endHandler = undefined) {
  process.stdout.write(`\nBVH 2 LMDB ${new Array(61).fill('-').join('')}\n\n`.cyan)
  let _bvh = new BVHFile()
  return BVHFile.load(infile)
    .then(data => { _bvh.data = data })
}

export default BVHToLMDB
