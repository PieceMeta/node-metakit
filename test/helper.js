const
  path = require('path'),
  isDev = process.env.NODE_ENV !== 'production',
  sourceRoot = path.join(__dirname, '..', isDev ? 'src' : 'dist'),
  requirePath = srcpath => path.join(sourceRoot, srcpath)
module.exports = {
  isDev,
  sourceRoot,
  requirePath
}
