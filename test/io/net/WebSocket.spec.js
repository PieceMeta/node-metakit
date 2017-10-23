const
  helper = require('../../helper'),
  WebSocket = require(helper.requirePath('io/net')).WebSocket,
  WebSocketClient = require('uws'),
  chai = require('chai'),
  uuidValidator = require('uuid-validate'),
  chance = new (require('chance'))()

chai.should()

let server

describe('io.net.WebSocket', () => {
  before(() => {
    return new Promise(resolve => {
      server = new WebSocket(3333)
      resolve()
    })
  })
  after(() => {
    return server.tearDown()
  })
  it('Creates a WebSocket server', () => {
    const BaseEvent = require(helper.requirePath('messaging')).BaseEvent,
      msg = chance.sentence()
    return new Promise(resolve => {
      server.on(BaseEvent.types.MKT_EVENT_IO, message => {
        message.should.be.instanceOf(BaseEvent)
        message.info.context.should.be.instanceOf(WebSocket)
        message.info.type.should.equal(50)
        uuidValidator(message.info.payload.id, 4).should.equal(true)
        message.info.payload.message.should.equal(msg)
        return server.broadcast('test')
          .then(() => {
            resolve()
          })
      })
      const client = new WebSocketClient('ws://localhost:3333')
      client.on('open', () => {
        client.send(msg)
      })
    })
  })
})
