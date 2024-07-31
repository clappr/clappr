import Events from './events'
import Log from '@/components/log'

describe('Events', function() {
  let events
  let callback

  beforeEach(() => {
    events = new Events()
    callback = jest.fn()
    Events.Custom = {}
  })

  it('on method needs one event name to register one listener', () => {
    events.on()

    expect(events._events).toBeUndefined()
  })

  it('listenTo method needs one event name to register one listener', () => {
    events.listenTo(events)

    expect(events._events).toBeUndefined()
  })
  it('listenToOnce method needs one event name to register one listener', () => {
    events.listenToOnce(events)

    expect(events._events).toBeUndefined()
  })

  it('once method needs one event name to register one listener', () => {
    events.once()

    expect(events._events).toBeUndefined()
  })

  it('off method needs one event name to unregister one listener', () => {
    events.off()

    expect(events._events).toBeUndefined()
  })

  it('stopListening method needs one event name to unregister one listener', () => {
    events.stopListening()

    expect(events._events).toBeUndefined()
  })

  it('subscribes to a given event', () => {
    events.on('clappr.any.event', callback)
    expect(callback).not.toHaveBeenCalled()

    events.trigger('clappr.any.event')
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('subscribes to a list of events separated by spaces', () => {
    events.on('clappr.any.event clappr.my.event', callback)
    expect(callback).not.toHaveBeenCalled()

    events.trigger('clappr.my.event')
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('subscribes to a given event using an object', () => {
    events.on({ 'clappr.any.event': callback })
    expect(callback).not.toHaveBeenCalled()

    events.trigger('clappr.any.event')
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('subscribes to a given event with context', () => {
    const context = { counter: 9 }
    const eventsCounter = function() {
      this.counter += 1
    }

    events.on('clappr.any.event', eventsCounter, context)
    expect(context.counter).toEqual(9)

    events.trigger('clappr.any.event')
    expect(context.counter).toEqual(10)
  })

  it('can unsubscribe an event', () => {
    events.on('clappr.any.event', callback)
    expect(callback).not.toHaveBeenCalled()

    events.off()
    events.trigger('clappr.any.event')

    expect(callback).not.toHaveBeenCalled()

    events.on('clappr.any.event', callback)
    events.off('clappr.any.event')
    events.trigger('clappr.any.event')

    expect(callback).not.toHaveBeenCalled()

    events.on('clappr.any.event', callback)
    events.off(null, callback)
    events.trigger('clappr.any.event')

    expect(callback).not.toHaveBeenCalled()
  })

  it('can trigger multiple times', () => {
    events.on('clappr.any.event', callback)
    expect(callback).not.toHaveBeenCalled()

    events.trigger('clappr.any.event')
    events.trigger('clappr.any.event', 1)
    events.trigger('clappr.any.event', 1, 2)
    events.trigger('clappr.any.event', 1, 2, 3)
    events.trigger('clappr.any.event', 1, 2, 3, 4)
    expect(callback).toHaveBeenCalledTimes(5)
  })

  it('can trigger dictionary { event: callback }', () => {
    events.listenTo(events, 'clappr.any.event', callback)

    expect(callback).not.toHaveBeenCalled()

    events.trigger({ 'clappr.any.event': callback })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('restricts to trigger only once', () => {
    events.once('clappr.any.event', callback)
    expect(callback).not.toHaveBeenCalled()

    events.trigger('clappr.any.event')
    events.trigger('clappr.any.event')
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('permits to listen events in other objects', () => {
    const myEvents = new Events()

    events.on('clappr.any.event', callback)
    myEvents.listenTo(events, 'clappr.any.event', callback)

    expect(callback).not.toHaveBeenCalled()

    events.trigger('clappr.any.event')
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('permits to stop listen all events from one reference', () => {
    const myEvents = new Events()

    events.on('clappr.any.event', callback)
    myEvents.listenTo(events, 'clappr.any.event', callback)

    expect(callback).not.toHaveBeenCalled()

    events.trigger('clappr.any.event')
    expect(callback).toHaveBeenCalledTimes(2)

    myEvents.stopListening()
    myEvents.trigger('clappr.any.event')

    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('permits to listen events as dictionary { event: callback } in other objects', () => {
    const myEvents = new Events()

    myEvents.listenTo(events, { 'clappr.any.event': callback })

    expect(callback).not.toHaveBeenCalled()

    events.trigger('clappr.any.event')
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('permits to stop listen events from one dictionary { event: callback }', () => {
    const myEvents = new Events()

    myEvents.listenTo(events, 'clappr.any.event', callback)

    expect(callback).not.toHaveBeenCalled()

    events.trigger('clappr.any.event')
    expect(callback).toHaveBeenCalledTimes(1)

    myEvents.stopListening(events, { 'clappr.any.event': callback })
    myEvents.trigger('clappr.any.event')

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('don\'t allow to bind the element itself as callback when the listen events in other objects', () => {
    const myEvents = new Events()

    myEvents.listenTo(events, 'clappr.any.event')
    myEvents.trigger('clappr.any.event')

    expect(myEvents._events).toBeUndefined()
  })

  it('permits to listen once events in other objects', () => {
    const myEvents = new Events()

    events.on('clappr.any.event', callback)
    myEvents.listenToOnce(events, 'clappr.any.event', callback)

    expect(callback).not.toHaveBeenCalled()

    events.trigger('clappr.any.event')
    events.trigger('clappr.any.event')
    expect(callback).toHaveBeenCalledTimes(3)
  })

  it('permits to listen once events in other objects', () => {
    const myEvents = new Events()

    events.on('clappr.any.event', callback)
    myEvents.listenToOnce(events, 'clappr.any.event', callback)

    expect(callback).not.toHaveBeenCalled()

    events.trigger('clappr.any.event', 42, 'some string')
    events.trigger('clappr.any.event', 42, 'some string')
    expect(callback).toHaveBeenCalledWith(42, 'some string')
    expect(callback).toHaveBeenCalledTimes(3)
  })

  it('permits to stop listening with callback argument a listen once event', () => {
    const myEvents = new Events()

    myEvents.listenToOnce(events, 'clappr.any.event', callback)
    myEvents.stopListening(events, 'clappr.any.event', callback)
    events.trigger('clappr.any.event')

    expect(callback).not.toHaveBeenCalled()
  })

  it('permits to stop listening events in other objects', () => {
    const myEvents = new Events()

    events.on('clappr.any.event', callback)
    myEvents.listenTo(events, 'clappr.any.event', callback)

    expect(callback).not.toHaveBeenCalled()

    myEvents.stopListening(events, 'clappr.any.event', callback)
    events.trigger('clappr.any.event')
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('calls handlers in the order they were registered', () => {
    let calls = []
    const Handler = function(id) {
      return () => {
        calls.push(id)
      }
    }

    events.on('clappr.any.event', new Handler(1))
    events.on('clappr.any.event', new Handler(2))
    events.on('clappr.any.event', new Handler(3))
    events.trigger('clappr.any.event')

    expect(calls).toEqual([1, 2, 3])
  })

  it('still calls later handlers if one throws an exception', () => {
    const handlerThatThrows = () => {
      throw new Error('Whoops')
    }

    events.on('clappr.any.event', handlerThatThrows)
    events.on('clappr.any.event', callback)
    events.trigger('clappr.any.event')

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('trigger custom event when registered', () => {
    const eventName = 'PLUGIN_CUSTOM_EVENT'

    Events.register(eventName)
    events.on(Events.Custom[eventName], callback)
    events.trigger(Events.Custom[eventName])

    expect(callback).toHaveBeenCalledTimes(1)
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

    Events.Custom = null
    Events.register('')

    Events.Custom = null
    events = Events.listAvailableCustomEvents()

    expect(events.length).toEqual(0)

    Events.register(eventName)
    events = Events.listAvailableCustomEvents()

    expect(events).toContain(eventName)
    expect(events).not.toContain('PLAYBACK_READY')
    expect(events).not.toContain('register')
    expect(events).not.toContain('listEvents')
  })

  describe('does not register an event when eventName is', () => {
    let stubLogError
    beforeEach(() => { stubLogError = jest.spyOn(Log.getInstance(), 'error') })
    afterEach(() => { stubLogError.mockClear() })

    it('an empty string', () => {
      Events.register('')
      Events.register('      ')

      expect(stubLogError).toHaveBeenCalledTimes(2)
    })

    it('not a string', () => {
      for (let arg of [() => {}, {}, [], null, undefined])
        Events.register(arg)

      expect(stubLogError.mock.calls.length).toEqual(5)
    })
  })
})
