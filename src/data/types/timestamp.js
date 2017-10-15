import microtime from 'microtime'
import Double from './double'

class Timestamp extends Double {
  constructor (value = undefined) {
    super(value || Timestamp.now())
  }

  static now () {
    return new Timestamp(microtime.nowDouble())
  }
  static get microtime () {
    return microtime.now()
  }
}

export default Timestamp
