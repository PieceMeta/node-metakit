import assert from 'assert'
import vectorious from 'vectorious'

import { DataError } from '../../data'
import Double from './double'
import Timestamp from './timestamp'
import Range from './range'

const
  MKT_TIMESTAMP = 0,
  MKT_RANGE = 1,

  MKT_DOUBLE_VALUE = 100,
  MKT_DOUBLE_MATRIX = 110,
  MKT_DOUBLE_VECTOR = 120,
  MKT_DOUBLE_ARRAY = 130

  /*
  MKT_FLOAT_VALUE = 200,
  MKT_FLOAT_ARRAY = 230,

  MKT_INT64_VALUE = 300,
  MKT_INT64_ARRAY = 330,

  MKT_INT32_VALUE = 400,
  MKT_INT32_ARRAY = 430,

  MKT_UINT8_ARRAY = 530
  */

const make = function (type, config = {}, value = undefined) {
  switch (type) {
    case MKT_TIMESTAMP:
      return new Timestamp(value || 0)
    case MKT_RANGE:
      return new Range(value)

    case MKT_DOUBLE_VALUE:
      return new Double(value || 0)
    case MKT_DOUBLE_MATRIX:
      assert(Array.isArray(config.shape), DataError.messages[DataError.types.BAD_PARAMS])
      return new vectorious.Matrix(value || config.shape)
    case MKT_DOUBLE_VECTOR:
      assert(Array.isArray(config.shape), DataError.messages[DataError.types.BAD_PARAMS])
      return new vectorious.Vector(value || config.shape)
    case MKT_DOUBLE_ARRAY:
      assert(typeof config.shape === 'number', DataError.messages[DataError.types.BAD_PARAMS])
      return new Float64Array(config.shape)

    /*
    case MKT_FLOAT_VALUE:
      break
    case MKT_FLOAT_ARRAY:
      break

    case MKT_INT64_VALUE:
      break
    case MKT_INT64_ARRAY:
      break

    case MKT_INT32_VALUE:
      break
    case MKT_INT32_ARRAY:
      break

    case MKT_UINT8_ARRAY:
      break
      */

    default:
      throw new DataError(DataError.types.BAD_PARAMS)
  }
}

export {
  make,

  MKT_TIMESTAMP,
  MKT_RANGE,

  MKT_DOUBLE_VALUE,
  MKT_DOUBLE_MATRIX,
  MKT_DOUBLE_VECTOR,
  MKT_DOUBLE_ARRAY

  /*
  MKT_FLOAT_VALUE,
  MKT_FLOAT_ARRAY,

  MKT_INT64_VALUE,
  MKT_INT64_ARRAY,

  MKT_INT32_VALUE,
  MKT_INT32_ARRAY,

  MKT_UINT8_ARRAY
  */
}
