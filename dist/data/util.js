'use strict';

exports.__esModule = true;
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

exports.copyBuffer = copyBuffer;
exports.keyFromDouble = keyFromDouble;
exports.padString = padString;
exports.removePrefixedFromArray = removePrefixedFromArray;