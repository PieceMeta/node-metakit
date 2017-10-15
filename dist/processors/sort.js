"use strict";

exports.__esModule = true;
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

exports.framesByTimeAsc = framesByTimeAsc;
exports.framesByStringTimeAsc = framesByStringTimeAsc;
exports.primitveNumbersAsc = primitveNumbersAsc;