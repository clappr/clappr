import * as utils from './utils'

const pushUrl = function(path) {
  window.history.pushState({},'', path)
}

describe('Utils', function() {
  describe('extend', function() {
    class Base {
      get name() { return 'base' }
      constructor(p1, p2) {
        this.prop1 = p1
        this.prop2 = p2
      }
      test() {}
    }

    test('should create a new class that extends parent', function() {
      const Derived = utils.extend(Base, {})
      const d = new Derived(1, 'some-value')
      expect(d.name).toEqual('base')
      expect(d.test()).toBeUndefined()
    })

    test('should pass constructor parameters to super constructor', function() {
      const Derived = utils.extend(Base, {})
      const d = new Derived(1, 'some-value')
      expect(d.prop1).toEqual(1)
      expect(d.prop2).toEqual('some-value')
    })

    test('should pass constructor parameters to initialize method', function() {
      const Derived = utils.extend(Base, {
        initialize(p1, p2, p3) {
          this.prop3 = p3
        }
      })
      const d = new Derived(1, 'some-value', 42)
      expect(d.prop3).toEqual(42)
    })

    it ('should support overriding methods', function() {
      const Derived = utils.extend(Base, {
        test() { return true }
      })
      const d = new Derived()
      expect(d.test()).toBeTruthy()
    })

    it ('should support overriding read-only properties', function() {
      const Derived = utils.extend(Base, {
        get name() { return 'derived' }
      })
      const d = new Derived()
      expect(d.name).toEqual('derived')
    })
  })

  test('creates unique id for a given prefix', function() {
    expect(utils.uniqueId('a')).not.toEqual(utils.uniqueId('a'))
  })

  test('converts seconds to time string format', function() {
    expect(utils.formatTime(1)).toEqual('00:01')
    expect(utils.formatTime(10)).toEqual('00:10')
    expect(utils.formatTime(60 * 10 + 15)).toEqual('10:15')
    expect(utils.formatTime(60 * 60 * 12)).toEqual('12:00:00')
    expect(utils.formatTime(60 * 60 * 24)).toEqual('1:00:00:00')
    expect(utils.formatTime(60 * 60 * 27)).toEqual('1:03:00:00')
  })

  test('should convert querystring seek regex in seconds', function() {

    pushUrl('/some/path/?t=1h10m30s')
    expect(utils.seekStringToSeconds()).toEqual(4230)

    pushUrl('/some/path/?t=40s')
    expect(utils.seekStringToSeconds()).toEqual(40)

    pushUrl('/some/path/?t=40s&stretch=false')
    expect(utils.seekStringToSeconds()).toEqual(40)

    pushUrl('/some/path/?t=30m5s')
    expect(utils.seekStringToSeconds()).toEqual(1805)

    pushUrl('/some/path/?t=1m')
    expect(utils.seekStringToSeconds()).toEqual(60)

    pushUrl('/some/path/?t=1h10s')
    expect(utils.seekStringToSeconds()).toEqual(3610)

    pushUrl('/some/path/?autoPlay=true&t=5m5s')
    expect(utils.seekStringToSeconds()).toEqual(305)

    pushUrl('/some/path/')
    expect(utils.seekStringToSeconds()).toEqual(0)

    pushUrl('/some/path/videos-1h/')
    expect(utils.seekStringToSeconds()).toEqual(0)

    pushUrl('/video/business/media/100000003661916/destroying.html?playlistId=1194811622182#t=6000&cview=true')
    expect(utils.seekStringToSeconds()).toEqual(6000)

    pushUrl('/video/business/media/100000003661916/destroying.html?playlistId=1194811622182#t=6000s&cview=true')
    expect(utils.seekStringToSeconds()).toEqual(6000)

    pushUrl('/video/business/media/100000003661916/destroying.html?playlistId=1194811622182#t=10m10s&cview=true')
    expect(utils.seekStringToSeconds()).toEqual(610)

    pushUrl('/video/business/media/100000003661916/destroying.html?playlistId=1194811622182#t=1h20m10s&cview=true')
    expect(utils.seekStringToSeconds()).toEqual(4810)

    pushUrl('/video/business/media/100000003661916/destroying.html?playlistId=1194811622182#t=6000s')
    expect(utils.seekStringToSeconds()).toEqual(6000)

    pushUrl('/video/business/media/100000003661916/destroying.html?playlistId=1194811622182#t=6000')
    expect(utils.seekStringToSeconds()).toEqual(6000)

    pushUrl('/video/business/media/100000003661916/destroying.html?playlistId=1194811622182&t=5m5s')
    expect(utils.seekStringToSeconds()).toEqual(305)

    pushUrl('/video/business/media/100000003661916/destroying.html?t=5m5s')
    expect(utils.seekStringToSeconds()).toEqual(305)

    pushUrl('/video/business/media/100000003661916/destroying.html?playlistId=1194811622182#t=5m5s')
    expect(utils.seekStringToSeconds()).toEqual(305)

    pushUrl('/video/business/media/100000003661916/destroying.html?playlistId=1194811622182&t=1h10m30s')
    expect(utils.seekStringToSeconds()).toEqual(4230)

    pushUrl('/video/business/media/100000003661916/destroying.html?playlistId=1194811622182&t=1m')
    expect(utils.seekStringToSeconds()).toEqual(60)

    pushUrl('/video/business/media/100000003661916/destroying.html?playlistId=1194811622182&t=40s')
    expect(utils.seekStringToSeconds()).toEqual(40)

    pushUrl('/video/business/media/100000003661916/destroying.html?playlistId=1194811622182&t=40s&more=here')
    expect(utils.seekStringToSeconds()).toEqual(40)

    pushUrl('/video/business/media/100000003661916/destroying.html?playlistId=1194811622182&t=30m5s')
    expect(utils.seekStringToSeconds()).toEqual(1805)

    pushUrl('/video/business/media/100000003661916/destroying.html?playlistId=1194811622182&t=5m5s')
    expect(utils.seekStringToSeconds()).toEqual(305)

    pushUrl('/video/business/media/100000003661916/destroying.html?playlistId=1194811622182')
    expect(utils.seekStringToSeconds()).toEqual(0)
  })

  describe('removeArrayItem', function() {
    test('removes an item when it exists', function() {
      const a = [1, 2, 3]
      utils.removeArrayItem(a, 2)
      expect(a.indexOf(2)).toEqual(-1)
      expect(a.length).toEqual(2)
    })

    test('does not remove anything when item doesn\'t exist', function() {
      const a = [1, 2, 3]
      utils.removeArrayItem(a, 4)
      expect(a.length).toEqual(3)
    })
  })

  describe('listContainsIgnoreCase', function() {
    test('finds when it contains an item', function() {
      const aList = ['audio/aac', 'video/mp4']
      const anItem = 'audio/aac'

      const doesItContains = utils.listContainsIgnoreCase(anItem, aList)

      expect(doesItContains).toBeTruthy()
    })

    test('finds when it contains a list of any letter case', function() {
      const aList = ['AUDIO/aac', 'VIDEO/mp4']
      const anItem = 'audio/aac'

      const doesItContains = utils.listContainsIgnoreCase(anItem, aList)

      expect(doesItContains).toBeTruthy()
    })

    test('finds when it contains an item of any letter case', function() {
      const aList = ['audio/aac', 'video/mp4']
      const anItem = 'AUDIO/AAC'

      const doesItContains = utils.listContainsIgnoreCase(anItem, aList)

      expect(doesItContains).toBeTruthy()
    })

    test('does not find when an item is not contained', function() {
      const aList = ['audio/aac', 'video/mp4']
      const anItem = 'application/x-mpegURL'

      const doesItContains = utils.listContainsIgnoreCase(anItem, aList)

      expect(doesItContains).toBeFalsy()
    })

    test('does not find when an item is undefined', function() {
      const aList = ['audio/aac', 'video/mp4']
      const anItem = undefined

      const doesItContains = utils.listContainsIgnoreCase(anItem, aList)

      expect(doesItContains).toBeFalsy()
    })

    test('does not find when the list is undefined', function() {
      const aList = undefined
      const anItem = 'audio/aac'

      const doesItContains = utils.listContainsIgnoreCase(anItem, aList)

      expect(doesItContains).toBeFalsy()
    })
  })

  describe('Config', function() {
    beforeEach(function() {
      localStorage.removeItem('clappr.localhost.volume')
    })

    test('restores default volume', function() {
      expect(utils.Config.restore('volume')).toEqual(100)
    })

    test('restores a persisted volume', function() {
      utils.Config.persist('volume', 42)
      expect(utils.Config.restore('volume')).toEqual(42)
    })

    test('returns undefined for unknown key', function() {
      expect(utils.Config.restore('unknown.key.CAFE')).toEqual(undefined)
    })
  })

  describe('DomRecycler', function() {
    test('can be configured', function() {
      utils.DomRecycler.configure({ foo: 'bar' })
      expect(utils.DomRecycler.options.foo).toEqual('bar')
      expect(utils.DomRecycler.options.recycleVideo).toBeFalsy()
    })

    test('create a dom element', function() {
      const el = utils.DomRecycler.create('div')
      expect(el.tagName).toEqual('DIV')
    })

    test('does not recycle video tag by default', function() {
      const video1 = utils.DomRecycler.create('video')
      utils.DomRecycler.garbage(video1)
      const video2 = utils.DomRecycler.create('video')
      expect(video1).not.toBe(video2)
    })

    test('recycle video tag if recycleVideo option is set', function() {
      utils.DomRecycler.configure({ recycleVideo: true })
      const video1 = utils.DomRecycler.create('video')
      utils.DomRecycler.garbage(video1)
      const video2 = utils.DomRecycler.create('video')
      expect(video1).toEqual(video2)
    })
  })

  describe('DoubleEventHandler', function() {
    test('handle double event', function() {
      const delay = 500
      const handler = new utils.DoubleEventHandler(delay)
      const spy = jest.fn()
      const evt = new Event('touchend')

      handler.handle(evt, spy)
      setTimeout(() => {
        handler.handle(evt, spy)
        expect(spy).toHaveBeenCalledTimes(1)
      }, delay/2)
    })
  })
})
