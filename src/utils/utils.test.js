import * as utils from './utils'

const pushUrl = (path) => {
  window.history.pushState({},'', path)
}

describe('Utils', () => {
  describe('assign module', () => {
    test('Returns same first object for calls without two objects', () => {
      const obj = { string: 'test', number: 1 }

      expect(utils.assign(obj)).toEqual({ string: 'test', number: 1 })
    })

    test('Returns same first object for calls with empty second object', () => {
      const obj = { string: 'test', number: 1 }

      expect(utils.assign(obj, {})).toEqual({ string: 'test', number: 1 })
    })

    test('Returns the merge result of the two received objects', () => {
      const obj1 = { string: 'test', number: 1 }
      const obj2 = { boolean: true }

      expect(utils.assign(obj1, obj2)).toEqual({ boolean: true, string: 'test', number: 1 })
    })
  })

  describe('extend module', () => {
    class Base {
      get name() { return 'base' }
      constructor(p1, p2) {
        this.prop1 = p1
        this.prop2 = p2
      }
      test() {}
    }

    test('should create a new class that extends parent', () => {
      const Derived = utils.extend(Base, {})
      const d = new Derived(1, 'some-value')
      expect(d.name).toEqual('base')
      expect(d.test()).toBeUndefined()
    })

    test('should pass constructor parameters to super constructor', () => {
      const Derived = utils.extend(Base, {})
      const d = new Derived(1, 'some-value')
      expect(d.prop1).toEqual(1)
      expect(d.prop2).toEqual('some-value')
    })

    test('should pass constructor parameters to initialize method', () => {
      const Derived = utils.extend(Base, {
        initialize(p1, p2, p3) {
          this.prop3 = p3
        }
      })
      const d = new Derived(1, 'some-value', 42)
      expect(d.prop3).toEqual(42)
    })

    it ('should support overriding methods', () => {
      const Derived = utils.extend(Base, {
        test() { return true }
      })
      const d = new Derived()
      expect(d.test()).toBeTruthy()
    })

    it ('should support overriding read-only properties', () => {
      const Derived = utils.extend(Base, {
        get name() { return 'derived' }
      })
      const d = new Derived()
      expect(d.name).toEqual('derived')
    })
  })

  describe('formatTime module', () => {
    test('converts seconds to time string format', () => {
      expect(utils.formatTime(1)).toEqual('00:01')
      expect(utils.formatTime(10)).toEqual('00:10')
      expect(utils.formatTime(60 * 10 + 15)).toEqual('10:15')
      expect(utils.formatTime(60 * 60 * 12)).toEqual('12:00:00')
      expect(utils.formatTime(60 * 60 * 24)).toEqual('1:00:00:00')
      expect(utils.formatTime(60 * 60 * 27)).toEqual('1:03:00:00')
      expect(utils.formatTime(1000/0)).toEqual('--:--')
    })
  })

  describe('Fullscreen module', () => {
    test('Returns the current fullscreen element', () => {

    })
    test('Requests fullscreen for one element', () => {

    })
    test('Cancel fullscreen', () => {

    })
    test('Check if fullscreen is enabled', () => {

    })
  })

  describe('Config module', () => {
    beforeEach(() => {
      localStorage.removeItem('clappr.localhost.volume')
    })

    test('restores default volume', () => {
      expect(utils.Config.restore('volume')).toEqual(100)
    })

    test('restores a persisted volume', () => {
      utils.Config.persist('volume', 42)
      expect(utils.Config.restore('volume')).toEqual(42)
    })

    test('returns undefined for unknown key', () => {
      expect(utils.Config.restore('unknown.key.CAFE')).toEqual(undefined)
    })

    test('don\'t persist invalid keys', () => {
      jest.spyOn(utils.Config, '_createKeyspace').mockImplementation(1)
      expect(utils.Config.persist()).toBeFalsy()
    })
  })

  describe('QueryString module', () => {
    beforeEach(() => {
      window.history.pushState({}, '', `${window.location.href}?query_string=test&another_query_string=0`)
    })
    afterEach(() => {
      window.history.pushState({}, '', window.location.href)
    })

    test('Creates a dict with each query string in the URL', () => {
      const test = window.location.search.substring(1)
      const parsedQueryStrings = utils.QueryString.parse(test)

      expect(parsedQueryStrings).toEqual({ 'query_string': 'test', 'another_query_string': '0' })
    })

    test('Returns current query strings on the URL', () => {
      expect(utils.QueryString.params).toEqual({ 'query_string': 'test', 'another_query_string': '0' })
    })

    test('Returns current hash strings on the URL', () => {
      window.history.pushState({}, '', `${window.location.href}#hash_string=test`)
      expect(utils.QueryString.hashParams).toEqual({ 'hash_string': 'test' })
    })
  })

  test('seekStringToSeconds module should convert seek regex in seconds', () => {

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

  test('creates unique id for a given prefix', () => {
    expect(utils.uniqueId('a')).not.toEqual(utils.uniqueId('a'))
  })

  test('isNumber module checks if one data is a valid number', () => {
    expect(utils.isNumber(1)).toBeTruthy()
    expect(utils.isNumber('1')).toBeTruthy()
    expect(utils.isNumber('number')).toBeFalsy()
    expect(utils.isNumber(true)).toBeFalsy()
    expect(utils.isNumber(() => '')).toBeFalsy()
  })

  test('currentScriptUrl module returns the current script available', () => {
    const script1 = document.createElement('script')
    script1.src = 'https://script.domain.com/path/script-example-1.js'
    const script2 = document.createElement('script')
    script2.src = 'https://script.domain.com/path/script-example-2.js'

    expect(utils.currentScriptUrl()).toEqual('')

    document.head.appendChild(script1)
    document.head.appendChild(script2)

    expect(utils.currentScriptUrl()).toEqual('https://script.domain.com/path/script-example-2.js')
  })

  test('getBrowserLanguage module returns window.navigator.language data', () => {
    expect(utils.getBrowserLanguage()).toEqual(window.navigator.language)
  })

  describe('now module', () => {
    test('Returns performance.now call response', () => {
      expect(utils.now()).toEqual(expect.any(Number))
    })

    test('Returns a valid date time when performance.now is not available', () => {
      const nowBkp = window.performance.now
      window.performance.now = null

      expect(utils.now()).toEqual(expect.any(Number))

      window.performance.now = nowBkp
    })
  })

  describe('removeArrayItem module', () => {
    test('removes an item when it exists', () => {
      const a = [1, 2, 3]
      utils.removeArrayItem(a, 2)
      expect(a.indexOf(2)).toEqual(-1)
      expect(a.length).toEqual(2)
    })

    test('does not remove anything when item doesn\'t exist', () => {
      const a = [1, 2, 3]
      utils.removeArrayItem(a, 4)
      expect(a.length).toEqual(3)
    })
  })

  describe('listContainsIgnoreCase module', () => {
    test('finds when it contains an item', () => {
      const aList = ['audio/aac', 'video/mp4']
      const anItem = 'audio/aac'

      const doesItContains = utils.listContainsIgnoreCase(anItem, aList)

      expect(doesItContains).toBeTruthy()
    })

    test('finds when it contains a list of any letter case', () => {
      const aList = ['AUDIO/aac', 'VIDEO/mp4']
      const anItem = 'audio/aac'

      const doesItContains = utils.listContainsIgnoreCase(anItem, aList)

      expect(doesItContains).toBeTruthy()
    })

    test('finds when it contains an item of any letter case', () => {
      const aList = ['audio/aac', 'video/mp4']
      const anItem = 'AUDIO/AAC'

      const doesItContains = utils.listContainsIgnoreCase(anItem, aList)

      expect(doesItContains).toBeTruthy()
    })

    test('does not find when an item is not contained', () => {
      const aList = ['audio/aac', 'video/mp4']
      const anItem = 'application/x-mpegURL'

      const doesItContains = utils.listContainsIgnoreCase(anItem, aList)

      expect(doesItContains).toBeFalsy()
    })

    test('does not find when an item is undefined', () => {
      const aList = ['audio/aac', 'video/mp4']
      const anItem = undefined

      const doesItContains = utils.listContainsIgnoreCase(anItem, aList)

      expect(doesItContains).toBeFalsy()
    })

    test('does not find when the list is undefined', () => {
      const aList = undefined
      const anItem = 'audio/aac'

      const doesItContains = utils.listContainsIgnoreCase(anItem, aList)

      expect(doesItContains).toBeFalsy()
    })
  })

  describe('canAutoPlayMedia module', () => {
    test('Returns true when auto play feature is available', (done) => {
      window.HTMLMediaElement.prototype.play = () => {
        return new Promise((resolve) => { setTimeout(() => resolve(), 100) })
      }

      const callback = (result) => {
        expect(result).toBeTruthy()
        done()
      }

      utils.canAutoPlayMedia(callback)
    })

    test('Returns false when auto play feature is not available', (done) => {
      window.HTMLMediaElement.prototype.play = () => {
        return new Promise((resolve) => { setTimeout(() => resolve(), 300) })
      }

      const callback = (result) => {
        expect(result).toBeFalsy()
        done()
      }

      utils.canAutoPlayMedia(callback)
    })

    test('Checks if auto play feature is available for specifics cases', (done) => {
      window.HTMLMediaElement.prototype.play = () => { /* do nothing */ }
      const callback = (result) => {
        expect(result).toBeTruthy()
        done()
      }

      utils.canAutoPlayMedia(callback, { element: document.createElement('video'), muted: true, inline: true })
    })
  })

  describe('DomRecycler module', () => {
    test('can be configured', () => {
      utils.DomRecycler.configure({ foo: 'bar' })
      expect(utils.DomRecycler.options.foo).toEqual('bar')
      expect(utils.DomRecycler.options.recycleVideo).toBeFalsy()
    })

    test('create a dom element', () => {
      const el = utils.DomRecycler.create('div')
      expect(el.tagName).toEqual('DIV')
    })

    test('does not recycle video tag by default', () => {
      const video1 = utils.DomRecycler.create('video')
      utils.DomRecycler.garbage(video1)
      const video2 = utils.DomRecycler.create('video')
      expect(video1).not.toBe(video2)
    })

    test('recycle video tag if recycleVideo option is set', () => {
      utils.DomRecycler.configure({ recycleVideo: true })
      const video1 = utils.DomRecycler.create('video')
      utils.DomRecycler.garbage(video1)
      const video2 = utils.DomRecycler.create('video')
      expect(video1).toEqual(video2)
    })
  })

  describe('DoubleEventHandler module', () => {
    test('handle double event', (done) => {
      const handler = new utils.DoubleEventHandler()
      const spy = jest.fn()
      const evt = new Event('touchend')

      handler.handle(evt, spy)
      setTimeout(() => {
        handler.handle(evt, spy)
        expect(spy).toHaveBeenCalledTimes(1)
        done()
      }, 500/2)
    })
  })
})
