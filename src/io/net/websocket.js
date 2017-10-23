import assert from 'assert'
import uws from 'uws'
import uuid from 'uuid/v4'
import Promise from 'bluebird'

import { Emitter, BaseEvent } from '../../messaging'

const WebSocketServer = uws.Server

class WebSocket extends Emitter {
  constructor (port) {
    super()
    assert.equal(typeof port, 'number')
    const _ctx = this
    this._server = new WebSocketServer({ port })
    this._connections = {}
    this._server.on('connection', function (ws) {
      const id = uuid()
      _ctx._connections[id] = ws
      _ctx._connections[id].on('message', _ctx._onMessage(_ctx, id))
      _ctx._connections[id].on('close', () => {
        _ctx._connections[id] = undefined
        delete _ctx._connections[id]
      })
    })
  }
  _onMessage (_ctx, id) {
    return function (message) {
      _ctx.emit({ id, message }, BaseEvent.types.MKT_EVENT_IO)
    }
  }
  broadcast (message) {
    const _ctx = this
    return Promise.map(Object.keys(_ctx._connections), id => {
      if (_ctx._connections[id]) {
        return _ctx._connections[id].send(message, {binary: Buffer.isBuffer(message)})
      }
    })
  }
}

export default WebSocket
