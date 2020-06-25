import Events from './events'
import Log from '../../components/log'

describe('Events', function() {
  beforeEach(() => {
    this.events = new Events()
    this.callback = jest.fn()
    Events.Custom = {}
  })

  it('subcribes to a given event', () => {
    this.events.on('clappr.any.event', this.callback)
    expect(this.callback).not.toHaveBeenCalled()

    this.events.trigger('clappr.any.event')
    expect(this.callback).toHaveBeenCalledTimes(1)
  })

  it('subscribes to a list of events separated by spaces', () => {
    this.events.on('clappr.any.event clappr.my.event', this.callback)
    expect(this.callback).not.toHaveBeenCalled()

    this.events.trigger('clappr.my.event')
    expect(this.callback).toHaveBeenCalledTimes(1)
  })

  it('subscribes to a given event using an object', () => {
    this.events.on({ 'clappr.any.event': this.callback })
    expect(this.callback).not.toHaveBeenCalled()

    this.events.trigger('clappr.any.event')
    expect(this.callback).toHaveBeenCalledTimes(1)
  })

  it('subscribes to a given event with context', () => {
    const context = { counter: 9 }
    const eventsCounter = function() {
      this.counter += 1
    }

    this.events.on('clappr.any.event', eventsCounter, context)
    expect(context.counter).toEqual(9)

    this.events.trigger('clappr.any.event')
    expect(context.counter).toEqual(10)
  })

  it('can unsub an event', () => {
    this.events.on('clappr.any.event', this.callback)
    expect(this.callback).not.toHaveBeenCalled()
    this.events.off('clappr.any.event')

    this.events.trigger('clappr.any.event')
    expect(this.callback).not.toHaveBeenCalled()
  })

  it('can trigger multiple times', () => {
    this.events.on('clappr.any.event', this.callback)
    expect(this.callback).not.toHaveBeenCalled()

    this.events.trigger('clappr.any.event')
    this.events.trigger('clappr.any.event')
    expect(this.callback).toHaveBeenCalledTimes(2)
  })

  it('restricts to trigger only once', () => {
    this.events.once('clappr.any.event', this.callback)
    expect(this.callback).not.toHaveBeenCalled()

    this.events.trigger('clappr.any.event')
    this.events.trigger('clappr.any.event')
    expect(this.callback).toHaveBeenCalledTimes(1)
  })

  it('permits to listen events in other objects', () => {
    const myEvents = new Events()

    this.events.on('clappr.any.event', this.callback)
    myEvents.listenTo(this.events, 'clappr.any.event', this.callback)

    expect(this.callback).not.toHaveBeenCalled()

    this.events.trigger('clappr.any.event')
    expect(this.callback).toHaveBeenCalledTimes(2)
  })

  it('permits to listen once events in other objects', () => {
    const myEvents = new Events()

    this.events.on('clappr.any.event', this.callback)
    myEvents.listenToOnce(this.events, 'clappr.any.event', this.callback)

    expect(this.callback).not.toHaveBeenCalled()

    this.events.trigger('clappr.any.event')
    this.events.trigger('clappr.any.event')
    expect(this.callback).toHaveBeenCalledTimes(3)
  })

  it('permits to listen once events in other objects', () => {
    const myEvents = new Events()

    this.events.on('clappr.any.event', this.callback)
    myEvents.listenToOnce(this.events, 'clappr.any.event', this.callback)

    expect(this.callback).not.toHaveBeenCalled()

    this.events.trigger('clappr.any.event', 42, 'some string')
    this.events.trigger('clappr.any.event', 42, 'some string')
    expect(this.callback).toHaveBeenCalledWith(42, 'some string')
    expect(this.callback).toHaveBeenCalledTimes(3)
  })

  it('permits to stop listening events in other objects', () => {
    const myEvents = new Events()

    this.events.on('clappr.any.event', this.callback)
    myEvents.listenTo(this.events, 'clappr.any.event', this.callback)

    expect(this.callback).not.toHaveBeenCalled()

    myEvents.stopListening(this.events, 'clappr.any.event', this.callback)
    this.events.trigger('clappr.any.event')
    expect(this.callback).toHaveBeenCalledTimes(1)
  })

  it('calls handlers in the order they were registered', () => {
    let calls = []
    const Handler = function(id) {
      return () => {
        calls.push(id)
      }
    }

    this.events.on('clappr.any.event', new Handler(1))
    this.events.on('clappr.any.event', new Handler(2))
    this.events.on('clappr.any.event', new Handler(3))
    this.events.trigger('clappr.any.event')

    expect(calls).toEqual([1, 2, 3])
  })

  it('still calls later handlers if one throws an exception', () => {
    const handlerThatThrows = () => {
      throw new Error('Whoops')
    }

    this.events.on('clappr.any.event', handlerThatThrows)
    this.events.on('clappr.any.event', this.callback)
    this.events.trigger('clappr.any.event')

    expect(this.callback).toHaveBeenCalledTimes(1)
  })

  it('trigger custom event when registered', () => {
    const eventName = 'PLUGIN_CUSTOM_EVENT'

    Events.register(eventName)
    this.events.on(Events.Custom[eventName], this.callback)
    this.events.trigger(Events.Custom[eventName])

    expect(this.callback).toHaveBeenCalledTimes(1)
  })

  it('put the label of custom event in camel case', () => {
    const eventName = 'PLUGIN_CUSTOM_EVENT'
    Events.register(eventName)

    expect(Events.Custom[eventName]).toEqual('pluginCustomEvent')
  })

  it('does not override event when exist', () => {
    const eventName = 'PLAYBACK_READY'
    Events.register(eventName)

    expect(Events[eventName]).toEqual('playback:ready')
  })

  it('list all available custom events', () => {
    let eventName = 'PLUGIN_CUSTOM_EVENT'
    let events

    Events.register(eventName)
    events = Events.listAvailableCustomEvents()

    expect(events).toContain(eventName)
    expect(events).not.toContain('PLAYBACK_READY')
    expect(events).not.toContain('register')
    expect(events).not.toContain('listEvents')
  })

  describe('does not register an event when eventName is', () => {
    beforeEach(() => { this.stubLogError = jest.spyOn(Log.getInstance(), 'error') })
    afterEach(() => { this.stubLogError.mockClear() })

    it('an empty string', () => {
      Events.register('')
      Events.register('      ')

      expect(this.stubLogError).toHaveBeenCalledTimes(2)
    })

    it('not a string', () => {
      for (let arg of [() => {}, {}, [], null, undefined])
        Events.register(arg)

      expect(this.stubLogError.mock.calls.length).toEqual(5)
    })
  })
})
