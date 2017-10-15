import Big from 'big.js'
import microtime from 'microtime'

class Timestamp extends Big {
  constructor (value = undefined) {
    super(value || Timestamp.now())
  }
  static now () {
    return new Big(microtime.nowDouble())
  }
}

export default Timestamp
