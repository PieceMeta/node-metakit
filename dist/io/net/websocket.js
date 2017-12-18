'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _uws = require('uws');

var _uws2 = _interopRequireDefault(_uws);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _messaging = require('../../messaging');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class WebSocket extends _messaging.Emitter {
  constructor(port) {
    super();
    _assert2.default.equal(typeof port, 'number');
    const _ctx = this;
    this._server = new _uws2.default.Server({ port });
    this._connections = {};
    this._server.on('connection', function (ws) {
      const id = (0, _v2.default)();
      _ctx._connections[id] = ws;
      _ctx._connections[id].on('message', message => {
        _ctx.emit({ id, message }, _messaging.BaseEvent.types.MKT_EVENT_IO);
      });
      _ctx._connections[id].on('close', () => {
        _ctx._connections[id] = undefined;
        delete _ctx._connections[id];
      });
    });
  }
  tearDown() {
    return new _bluebird2.default(resolve => {
      this._server.close();
      resolve();
    });
  }
  broadcast(message) {
    const _ctx = this;
    return _bluebird2.default.map(Object.keys(_ctx._connections), id => {
      if (_ctx._connections[id]) {
        return _ctx._connections[id].send(message, { binary: Buffer.isBuffer(message) });
      }
    });
  }
}

exports.default = WebSocket;
module.exports = exports['default'];