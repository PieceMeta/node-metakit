'use strict';

exports.__esModule = true;

var _osc = require('osc');

var _osc2 = _interopRequireDefault(_osc);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _tinyEmitter = require('tiny-emitter');

var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

var _timestamp = require('../data/timestamp');

var _timestamp2 = _interopRequireDefault(_timestamp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class OSC extends _tinyEmitter2.default {
  constructor() {
    super();
    this._transport = undefined;
    this._port = undefined;
    this._port = undefined;
  }
  setTransport(config, transport) {
    this._transport = transport;
    this._port = null;
    let TransportConstruct;
    switch (this._transport) {
      case OSC.transports.TCP_SOCKET:
        TransportConstruct = _osc2.default.TCPSocketPort;
        break;
      case OSC.transports.WEB_SOCKET:
        break;
      default:
        TransportConstruct = _osc2.default.UDPPort;
    }
    this._port = new TransportConstruct(config);
    const _ctx = this;
    if (this._port) {
      this._port.on('ready', () => {
        _ctx.emit('ready');
      });
    }
  }
  openPort() {
    (0, _assert2.default)(this._port);
    this._port.open();
  }
  closePort() {
    if (this._port) this._port.close();
  }
  listen(forBundles = true) {
    (0, _assert2.default)(this._port);
    const _ctx = this,
          handleMessage = (msg, timeTag = undefined, info = undefined) => {
      _ctx.emit('message', msg, timeTag && Array.isArray(timeTag.raw) ? new _timestamp2.default(timeTag.raw[0] * Math.pow(2, 32) + timeTag.raw[1]) : _timestamp2.default.now(), info);
    },
          handleBundle = (bundle, info = undefined) => {
      _ctx.emit('bundle', bundle.packets, bundle.timeTag && Array.isArray(bundle.timeTag.raw) ? new _timestamp2.default(bundle.timeTag.raw[0] * Math.pow(2, 32) + bundle.timeTag.raw[1]) : _timestamp2.default.now(), info);
    };
    this._port.removeListener('bundle', handleBundle);
    this._port.removeListener('message', handleMessage);
    if (forBundles) this._port.on('bundle', handleBundle);else this._port.on('message', handleMessage);
  }
  sendBundle(messages, tSeconds = undefined) {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    if (typeof tSeconds === 'undefined') {
      tSeconds = _timestamp2.default.now();
    }
    const bundle = {
      timeTag: _osc2.default.timeTag(tSeconds),
      packets: messages
    };
    this._port.send(bundle);
  }

  static buildMessage(address, args = []) {
    const parsedArgs = new Array(args.length);
    args.map((arg, i) => {
      if (typeof arg === 'number') {
        parsedArgs[i] = {
          type: 'f',
          value: arg
        };
      } else {
        parsedArgs[i] = {
          type: 's',
          value: arg ? arg.toString() : ''
        };
      }
    });
    return {
      address: address,
      args: parsedArgs
    };
  }
  static get transports() {
    return {
      UDP: 0,
      TCP_SOCKET: 1,
      WEB_SOCKET: 2
    };
  }
}

exports.default = OSC;