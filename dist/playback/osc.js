'use strict';

exports.__esModule = true;

var _osc = require('osc');

var _osc2 = _interopRequireDefault(_osc);

var _microtime = require('microtime');

var _microtime2 = _interopRequireDefault(_microtime);

var _tinyEmitter = require('tiny-emitter');

var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class OSC extends _tinyEmitter2.default {
  constructor(local = '0.0.0.0:8888', remote = '127.0.0.1:9999', broadcast = false) {
    super();
    this._port = new _osc2.default.UDPPort({
      localAddress: local.split(':')[0],
      localPort: parseInt(local.split(':')[1]),
      remoteAddress: remote.split(':')[0],
      remotePort: parseInt(remote.split(':')[1]),
      broadcast
    });
    this._port.on('ready', () => {
      this.emit('ready');
    });
    this._port.open();
  }
  sendBundle(messages, tSeconds = undefined) {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    if (typeof tSeconds !== 'number') {
      tSeconds = _microtime2.default.nowDouble();
    }
    this._port.send({
      timeTag: _osc2.default.timeTag(tSeconds),
      packets: messages
    });
  }
  close() {
    this._port.close();
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
}

exports.default = OSC;