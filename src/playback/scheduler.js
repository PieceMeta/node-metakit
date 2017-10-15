import NanoTimer from 'nanotimer'

class Scheduler {
  constructor () {
    this._timer = new NanoTimer()
  }
  interval (timeStr, func, args = undefined, cb = undefined) {
    this._timer.clearInterval()
    this._timer.setInterval(func, args || '', timeStr, cb)
  }
  delay (timeStr, func, args = undefined, cb = undefined) {
    this._timer.clearTimeout()
    this._timer.setTimeout(func, args || '', timeStr, cb)
  }
  duration (func, ...args) {
    // Returns microseconds; 'm' for milliseconds
    return this._timer.time(func, !args.length ? '' : args, 'u')
  }
}

export default Scheduler
