import Events from '../../src/base/events'
import Log from '../../src/plugins/log'

describe('Events', function(){
  beforeEach(function(){
    this.events = new Events()
    this.callback = sinon.spy()
    Events.Custom = {}
  })

  it('subcribes to a given event', function(){
    this.events.on('clappr.any.event', this.callback)
    this.callback.should.not.have.been.called

    this.events.trigger('clappr.any.event')
    this.callback.should.have.been.calledOnce
  })

  it('subscribes to a list of events separated by spaces', function(){
    this.events.on('clappr.any.event clappr.my.event', this.callback)
    this.callback.should.not.have.been.called

    this.events.trigger('clappr.my.event')
    this.callback.should.have.been.calledOnce
  })

  it('subscribes to a given event using an object', function(){
    this.events.on({'clappr.any.event': this.callback})
    this.callback.should.not.have.been.called

    this.events.trigger('clappr.any.event')
    this.callback.should.have.been.calledOnce
  })

  it('subscribes to a given event with context', function(){
    const context = { counter: 9 }
    const eventsCounter = function() {
      this.counter += 1
    }

    this.events.on('clappr.any.event', eventsCounter, context)
    expect(context.counter).to.be.equal(9)

    this.events.trigger('clappr.any.event')
    expect(context.counter).to.be.equal(10)
  })

  it('can unsub an event', function(){
    this.events.on('clappr.any.event', this.callback)
    this.callback.should.not.have.been.called
    this.events.off('clappr.any.event')

    this.events.trigger('clappr.any.event')
    this.callback.should.not.have.been.called
  })

  it('can trigger multiple times', function(){
    this.events.on('clappr.any.event', this.callback)
    this.callback.should.not.have.been.called

    this.events.trigger('clappr.any.event')
    this.events.trigger('clappr.any.event')
    this.callback.should.have.been.calledTwice
  })

  it('restricts to trigger only once', function(){
    this.events.once('clappr.any.event', this.callback)
    this.callback.should.not.have.been.called

    this.events.trigger('clappr.any.event')
    this.events.trigger('clappr.any.event')
    this.callback.should.have.been.calledOnce
  })

  it('permits to listen events in other objects', function(){
    const myEvents = new Events()

    this.events.on('clappr.any.event', this.callback)
    myEvents.listenTo(this.events, 'clappr.any.event', this.callback)

    this.callback.should.not.have.been.called

    this.events.trigger('clappr.any.event')
    this.callback.should.have.been.calledTwice
  })

  it('permits to listen once events in other objects', function(){
    const myEvents = new Events()

    this.events.on('clappr.any.event', this.callback)
    myEvents.listenToOnce(this.events, 'clappr.any.event', this.callback)

    this.callback.should.not.have.been.called

    this.events.trigger('clappr.any.event')
    this.events.trigger('clappr.any.event')
    this.callback.should.have.been.calledThrice
  })

  it('permits to stop listening events in other objects', function(){
    const myEvents = new Events()

    this.events.on('clappr.any.event', this.callback)
    myEvents.listenTo(this.events, 'clappr.any.event', this.callback)

    this.callback.should.not.have.been.called

    myEvents.stopListening(this.events, 'clappr.any.event', this.callback)
    this.events.trigger('clappr.any.event')
    this.callback.should.have.been.calledOnce
  })

  it('calls handlers in the order they were registered', function(){
    let calls = []
    const Handler = function(id) {
      return function() {
        calls.push(id)
      }
    }

    this.events.on('clappr.any.event', new Handler(1))
    this.events.on('clappr.any.event', new Handler(2))
    this.events.on('clappr.any.event', new Handler(3))
    this.events.trigger('clappr.any.event')

    expect(calls).to.be.eql([1, 2, 3])
  })

  it('still calls later handlers if one throws an exception', function(){
    const handlerThatThrows = function() {
      throw new Error('Whoops')
    }

    this.events.on('clappr.any.event', handlerThatThrows)
    this.events.on('clappr.any.event', this.callback)
    this.events.trigger('clappr.any.event')

    this.callback.should.have.been.calledOnce
  })

  it('trigger custom event when registered', function(){
    const eventName = 'PLUGIN_CUSTOM_EVENT'

    Events.register(eventName)
    this.events.on(Events.Custom[eventName], this.callback)
    this.events.trigger(Events.Custom[eventName])

    this.callback.should.have.been.calledOnce
  })

  it('put the label of custom event in camel case', function(){
    const eventName = 'PLUGIN_CUSTOM_EVENT'
    Events.register(eventName)

    expect(Events.Custom[eventName]).to.be.equal('pluginCustomEvent')
  })

  it('does not override event when exist', function(){
    const eventName = 'PLAYBACK_READY'
    Events.register(eventName)

    expect(Events[eventName]).to.be.equal('playback:ready')
  })

  it('list all available custom events', function(){
    let eventName = 'PLUGIN_CUSTOM_EVENT'
    let events

    Events.register(eventName)
    events = Events.listAvailableCustomEvents()

    expect(events).to.include(eventName)
    expect(events).to.not.include('PLAYBACK_READY')
    expect(events).to.not.include('register')
    expect(events).to.not.include('listEvents')
  })

  describe('does not register an event when eventName is', function() {

    beforeEach(function() {
      this.stubLogError = sinon.stub(Log.getInstance(), 'error')
    })

    afterEach(function() {
      Log.getInstance().error.restore()
    })

    it('an empty string', function(){
      Events.register('')
      Events.register('      ')

      this.stubLogError.should.have.been.calledTwice
    })

    it('not a string', function(){
      for(let arg of [function(){}, {}, [], null, undefined]) {
        Events.register(arg)
      }

      expect(this.stubLogError.callCount).to.be.equal(5)
    })
  })
})