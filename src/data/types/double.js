import BigNumber from 'bignumber.js'
BigNumber.config({ ERRORS: false })

class Double extends BigNumber {
  static fromString (key) {
    if (typeof key === 'string' && key[0] === '+') key = key.substr(1)
    return key ? new Double(key) : null
  }
}

export default Double
