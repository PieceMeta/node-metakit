'use strict';

exports.__esModule = true;

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

const WebSocketServer = _uws2.default.Server;

class WebSocket extends _messaging.Emitter {
  constructor(port) {
    super();
    _assert2.default.equal(typeof port, 'number');
    const _ctx = this;
    this._server = new WebSocketServer({ port });
    this._connections = {};
    this._server.on('connection', function (ws) {
      const id = (0, _v2.default)();
      _ctx._connections[id] = ws;
      _ctx._connections[id].on('message', _ctx._onMessage(_ctx, id));
      _ctx._connections[id].on('close', () => {
        _ctx._connections[id] = undefined;
        delete _ctx._connections[id];
      });
    });
  }
  _onMessage(_ctx, id) {
    return function (message) {
      _ctx.emit({ id, message }, _messaging.BaseEvent.types.MKT_EVENT_IO);
    };
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