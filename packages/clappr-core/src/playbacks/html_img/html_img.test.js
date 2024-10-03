import HTMLImg from './html_img'
import Playback from '../../base/playback/playback'
import Events from '../../base/events/events'

describe('HTMLImg', function () {
  describe('should check properties and methods', function () {
    test('should return html_img', function () {
      const imgInstance = new HTMLImg({ src: 'https://placehold.co/400' })
      expect(imgInstance.name).toBe('html_img')
    })

    test('should return min version', function () {
      const imgInstance = new HTMLImg({ src: 'https://placehold.co/400' })
      expect(imgInstance.supportedVersion).toEqual({ min: VERSION })
    })

    test('should return img', function () {
      const imgInstance = new HTMLImg({ src: 'https://placehold.co/400' })
      expect(imgInstance.tagName).toBe('img')
    })

    test('should return attributes', function () {
      const imgInstance = new HTMLImg({ src: 'https://placehold.co/400' })
      expect(imgInstance.attributes).toEqual({
        'data-html-img': ''
      })
    })

    test('should return events', function () {
      const imgInstance = new HTMLImg({ src: 'https://placehold.co/400' })
      expect(imgInstance.events).toEqual({
        'load': '_onLoad',
        'abort': '_onError',
        'error': '_onError'
      })
    })

    test('should return NO_OP', function () {
      const imgInstance = new HTMLImg({ src: 'https://placehold.co/400' })
      expect(imgInstance.getPlaybackType()).toBe(Playback.NO_OP)
    })
  })

  describe('should check constructor', function () {
    test('should set src attribute', function () {
      const params = { src: 'https://placehold.co/400' }
      const imgInstance = new HTMLImg(params)
      expect(imgInstance.el.src).toBe(params.src)
    })
  })

  describe('should check render method', function () {
    test('should append style to element', function () {
      const imgInstance = new HTMLImg({ src: 'https://placehold.co/400' })
      imgInstance.render()
      expect(imgInstance.$el.children().length).toBe(1)
    })

    test('should trigger PLAYBACK_READY event', function () {
      const imgInstance = new HTMLImg({ src: 'https://placehold.co/400' })
      const spy = jest.spyOn(imgInstance, 'trigger')
      imgInstance.render()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(Events.PLAYBACK_READY, 'html_img')
    })
  })

  describe('should check _onLoad method', function () {
    test('should trigger PLAYBACK_ENDED event', function () {
      const imgInstance = new HTMLImg({ src: 'https://placehold.co/400' })
      const spy = jest.spyOn(imgInstance, 'trigger')
      imgInstance._onLoad()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(Events.PLAYBACK_ENDED, 'html_img')
    })
  })

  describe('should check _onError method', function () {
    test('should trigger PLAYBACK_ERROR event with load error message', function () {
      const imgInstance = new HTMLImg({ src: 'http://example.com/image.jpg' })
      const spy = jest.spyOn(imgInstance, 'trigger')
      imgInstance._onError({ type: 'error' })
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(Events.PLAYBACK_ERROR, { message: 'load error' }, 'html_img')
    })

    test('should trigger PLAYBACK_ERROR event with loading aborted message', function () {
      const imgInstance = new HTMLImg({ src: 'https://placehold.co/400' })
      const spy = jest.spyOn(imgInstance, 'trigger')
      imgInstance._onError({ type: 'abort' })
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(Events.PLAYBACK_ERROR, { message: 'loading aborted' }, 'html_img')
    })
  })

  describe('should check canPlay method', function () {
    test('should return true for valid image resources', function () {
      expect(HTMLImg.canPlay('http://example.com/image.jpg')).toBe(true)
      expect(HTMLImg.canPlay('http://example.com/image.png')).toBe(true)
      expect(HTMLImg.canPlay('http://example.com/image.gif')).toBe(true)
    })

    test('should return false for invalid image resources', function () {
      expect(HTMLImg.canPlay('http://example.com/image.mp4')).toBe(false)
      expect(HTMLImg.canPlay('http://example.com/image.mp3')).toBe(false)
      expect(HTMLImg.canPlay('http://example.com/image.txt ')).toBe(false)
    })
  })
})
