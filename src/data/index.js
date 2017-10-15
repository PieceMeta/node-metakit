import * as structure from './structure'
import * as types from './types'
import * as util from './util'

class DataError extends Error {
  constructor (code) {
    super(DataError.messages.error[code])
    Error.captureStackTrace(this, DataError)
    this.code = code
  }
  static get types () {
    return {
      INVALID_TYPE: 0,
      BAD_PARAMS: 1
    }
  }
  static get messages () {
    return {
      error: {
        0: 'Invalid Fragment type',
        1: 'Bad parameters'
      }
    }
  }
}

export {
  structure,
  types,
  util,
  DataError
}
