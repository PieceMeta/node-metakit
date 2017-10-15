import osc from 'osc'
import assert from 'assert'
import Emitter from 'tiny-emitter'

import { types } from '../../data'

class OSC extends Emitter {
  constructor () {
    super()
    this._transport = undefined
    this._port = undefined
    this._port = undefined
  }
  setTransport (config, transport) {
    this._transport = transport
    this._port = null
    let TransportConstruct
    switch (this._transport) {
      case OSC.transports.TCP_SOCKET:
        TransportConstruct = osc.TCPSocketPort
        break
      case OSC.transports.WEB_SOCKET:
        break
      default:
        TransportConstruct = osc.UDPPort
    }
    this._port = new TransportConstruct(config)
    const _ctx = this
    if (this._port) {
      this._port.on('ready', () => {
        _ctx.emit('ready')
      })
    }
  }
  openPort () {
    assert((this._port))
    this._port.open()
  }
  closePort () {
    if (this._port) this._port.close()
  }
  listen (forBundles = true) {
    assert((this._port))
    const _ctx = this,
      handleMessage = (msg, timeTag = undefined, info = undefined) => {
        _ctx.emit(
          'message',
          msg,
          timeTag && Array.isArray(timeTag.raw)
            ? types.make(types.MKT_TIMESTAMP, timeTag.raw[0] * Math.pow(2, 32) + timeTag.raw[1])
            : types.make(types.MKT_TIMESTAMP),
          info
        )
      },
      handleBundle = (bundle, info = undefined) => {
        _ctx.emit(
          'bundle',
          bundle.packets,
          bundle.timeTag && Array.isArray(bundle.timeTag.raw)
            ? types.make(types.MKT_TIMESTAMP, bundle.timeTag.raw[0] * Math.pow(2, 32) + bundle.timeTag.raw[1])
            : types.make(types.MKT_TIMESTAMP),
          info
        )
      }
    this._port.removeListener('bundle', handleBundle)
    this._port.removeListener('message', handleMessage)
    if (forBundles) this._port.on('bundle', handleBundle)
    else this._port.on('message', handleMessage)
  }
  sendBundle (messages, tSeconds = undefined) {
    if (!Array.isArray(messages)) {
      messages = [messages]
    }
    if (typeof tSeconds === 'undefined') {
      tSeconds = types.make(types.MKT_TIMESTAMP)
    }
    const bundle = {
      timeTag: osc.timeTag(tSeconds),
      packets: messages
    }
    this._port.send(bundle)
  }

  static buildMessage (address, args = []) {
    const parsedArgs = new Array(args.length)
    args.map((arg, i) => {
      if (typeof arg === 'number') {
        parsedArgs[i] = {
          type: 'f',
          value: arg
        }
      }
      else {
        parsedArgs[i] = {
          type: 's',
          value: arg ? arg.toString() : ''
        }
      }
    })
    return {
      address: address,
      args: parsedArgs
    }
  }
  static get transports () {
    return {
      UDP: 0,
      TCP_SOCKET: 1,
      WEB_SOCKET: 2
    }
  }
}

export default OSC
