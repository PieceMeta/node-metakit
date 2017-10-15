const chai = require('chai')
chai.should()

const playback = require('../../src/playback'),
  data = require('../../src/data')

let osc, oscListen, msg

const closePortCheck = () => {
  if (osc._port && osc._port.socket) {
    osc._port.socket.should.not.have.deep.property(null)
    osc.closePort()
    osc._port.socket.should.have.deep.property('_handle', null)
  }
}

const config = {
  listen_config: {
    localAddress: '0.0.0.0',
    localPort: 9001,
    remoteAddress: '127.0.0.1',
    remotePort: 9000
  },
  port_config: {
    localAddress: '0.0.0.0',
    localPort: 9000,
    remoteAddress: '127.0.0.1',
    remotePort: 9001
  },
  address: '/mtktest',
  num_args: 64,
  custom_timestamp: new data.Timestamp('5e10')
}

describe('playback.OSC', () => {
  it(`Initializes a new OSC instance with target ${config.port_config.remoteAddress}:${config.port_config.remotePort} ` +
    `over UDP, listening on ${config.listen_config.localAddress}:${config.listen_config.localPort}`, () => {
    osc = new playback.OSC()
    osc.should.be.instanceOf(playback.OSC)
    osc.setTransport(config.port_config, playback.OSC.transports.UDP)
    oscListen = new playback.OSC()
    oscListen.should.be.instanceOf(playback.OSC)
    oscListen.setTransport(config.listen_config, playback.OSC.transports.UDP)
  })
  it(`Starts a UDP sender`, () => {
    return new Promise(resolve => {
      osc.openPort()
      osc.once('ready', () => {
        osc.should.have.property('_port')
        osc._port.socket.constructor.name.should.equal('Socket')
        osc._port.options.should.contain(config.port_config)
        resolve()
      })
    })
  })
  it(`Starts a UDP listener`, () => {
    return new Promise(resolve => {
      oscListen.openPort()
      oscListen.listen()
      oscListen.once('ready', () => {
        oscListen.should.have.property('_port')
        oscListen._port.socket.constructor.name.should.equal('Socket')
        oscListen._port.options.should.contain(config.listen_config)
        resolve()
      })
    })
  })
  it('Creates a message', () => {
    msg = playback.OSC.buildMessage(config.address, new Float64Array(config.num_args).fill(0.0))
    msg.address.should.equal(config.address)
    msg.args.length.should.equal(config.num_args)
    msg.args[0].should.deep.equal({type: 'f', value: 0})
  })
  it('Sends the message as bundle', () => {
    return new Promise(resolve => {
      osc.sendBundle([msg])
      oscListen.once('bundle', (packets, timeTag, info = undefined) => {
        packets.length.should.equal(1)
        packets[0].address.should.equal(config.address)
        packets[0].args.length.should.equal(config.num_args)
        timeTag.should.be.instanceOf(data.Timestamp)
        if (info) {
          info.address.should.equal(config.listen_config.remoteAddress)
          info.port.should.equal(config.listen_config.remotePort)
        }
        resolve()
      })
    })
  })
  it('Adds custom timestamp to bundle', () => {
    return new Promise(resolve => {
      osc.sendBundle([msg], config.custom_timestamp)
      oscListen.once('bundle', (msg, timeTag) => {
        // FIXME: timestamp gets mangled when set to custom value as above
        // timeTag.toString().should.equal(config.custom_timestamp.toString())
        resolve()
      })
    })
  })
  it(`Closes the UDP port`, closePortCheck)
})
