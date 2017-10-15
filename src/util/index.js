import ChannelMatrix from './channel-matrix'
import HarmonicMatrix from './harmonic-matrix'
import Harmonics from './harmonics'
import Logger from './logger'
import Stats from './stats'
import Time from './time'
import * as filters from './filter'
import * as sort from './sort'

import Big from 'big.js'
import D3Node from 'd3-node'

const padString = function (str, length, char = ' ', padLeft = false) {
  const pad = new Array(length - str.length).fill(char).join('')
  if (padLeft) { return pad + str }
  return str + pad
}

const parseDouble = function (value) {
  try { return Big(value) }
  catch (err) { return null }
}

const quantize = function (value, steps = 20, precision = 0) {
  steps = Math.max(steps, 20.0)
  precision = precision > 0 ? Math.pow(10.0, precision) : 0
  return value
}

const getHSLFromRadians = (rad, alpha = 1.0, sat = 1.0, light = 0.5) =>
  D3Node.d3.hsl(rad * 180 / Math.PI, sat, light, alpha)

export {
  ChannelMatrix,
  HarmonicMatrix,
  Harmonics,
  Logger,
  Stats,
  Time,
  padString,
  parseDouble,
  filters,
  sort,
  quantize,
  getHSLFromRadians
}
