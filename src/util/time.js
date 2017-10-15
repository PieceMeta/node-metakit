import microtime from 'microtime'

class Time {
  static get microtime () {
    return microtime.now()
  }
}

export default Time
