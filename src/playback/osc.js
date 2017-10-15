import osc from 'osc'
import microtime from 'microtime'
import Emitter from 'tiny-emitter'

class OSC extends Emitter {
  constructor (local = '0.0.0.0:8888', remote = '127.0.0.1:9999', broadcast = false) {
    super()
    this._port = new osc.UDPPort({
      localAddress: local.split(':')[0],
      localPort: parseInt(local.split(':')[1]),
      remoteAddress: remote.split(':')[0],
      remotePort: parseInt(remote.split(':')[1]),
      broadcast
    })
    this._port.on('ready', () => {
      this.emit('ready')
    })
    this._port.open()
  }
  sendBundle (messages, tSeconds = undefined) {
    if (!Array.isArray(messages)) {
      messages = [messages]
    }
    if (typeof tSeconds !== 'number') {
      tSeconds = microtime.nowDouble()
    }
    this._port.send({
      timeTag: osc.timeTag(tSeconds),
      packets: messages
    })
  }
  close () {
    this._port.close()
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
}

export default OSC
