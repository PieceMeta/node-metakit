import Debug from 'debug'

class Logger {
  static log (msg) {
    process.stdout.write(msg)
  }
  static error (msg) {
    process.stderr.write(msg)
  }
  static debug (msg, module = 'cl') {
    Debug(module)(msg)
  }
}

export default Logger
