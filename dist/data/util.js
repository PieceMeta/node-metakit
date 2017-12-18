'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const copyBuffer = function (source) {
  let buffer = new ArrayBuffer(source.byteLength);
  new Uint8Array(buffer).set(new Uint8Array(source));
  return buffer;
};

const removePrefixedFromArray = function (array, stringPrefix = '_') {
  return array.filter(val => {
    return typeof val === 'string' ? val.indexOf(stringPrefix) === -1 : true;
  });
};

const padString = function (str, length, char = ' ', padLeft = false) {
  const _pad = new Array(length - str.length).fill(char).join('');
  if (padLeft) return _pad + str;
  return str + _pad;
};

const keyFromDouble = function (value, length = 16, precision = 6, signed = true) {
  const fixed = value.toFixed(precision);
  let prefix = '';
  if (signed) prefix = Math.sign(value) >= 0 ? '+' : '-';
  return prefix + padString(fixed, length - prefix.length, '0', true);
};

const framesByTimeAsc = function (a, b) {
  return a[0] - b[0];
};

const framesByStringTimeAsc = function (a, b) {
  if (a[0] > b[0]) return 1;
  if (a[0] < b[0]) return -1;
  return 0;
};

const primitveNumbersAsc = function (a, b) {
  return parseInt(a) - parseInt(b);
};

exports.copyBuffer = copyBuffer;
exports.keyFromDouble = keyFromDouble;
exports.padString = padString;
exports.removePrefixedFromArray = removePrefixedFromArray;
exports.framesByTimeAsc = framesByTimeAsc;
exports.framesByStringTimeAsc = framesByStringTimeAsc;
exports.primitveNumbersAsc = primitveNumbersAsc;