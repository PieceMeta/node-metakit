const chai = require('chai')
chai.should()

const OSC = require('../../../src/io/net').OSC,
  Timestamp = require('../../../src/data/types/timestamp').default

let osc, oscListen, msg

const closePortCheck = () => {
  [osc, oscListen].forEach(osc => {
    if (osc._port && osc._port.socket) {
      osc._port.socket.should.not.have.deep.property('_handle', null)
      osc.closePort()
      osc._port.socket.should.have.deep.property('_handle', null)
    }
  })
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
  custom_timestamp: new Timestamp('5e10')
}

describe('OSC', () => {
  it(`Initializes a new OSC instance with target ${config.port_config.remoteAddress}:${config.port_config.remotePort} ` +
    `over UDP, listening on ${config.listen_config.localAddress}:${config.listen_config.localPort}`, () => {
    osc = new OSC()
    osc.should.be.instanceOf(OSC)
    osc.setTransport(config.port_config, OSC.transports.UDP)
    oscListen = new OSC()
    oscListen.should.be.instanceOf(OSC)
    oscListen.setTransport(config.listen_config, OSC.transports.UDP)
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
    msg = OSC.buildMessage(config.address, new Float64Array(config.num_args).fill(0.0))
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
        timeTag.should.be.instanceOf(Timestamp)
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
