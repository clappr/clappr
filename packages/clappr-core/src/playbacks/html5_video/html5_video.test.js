import HTML5Video from './html5_video'
import Events from '../../base/events'

import $ from 'clappr-zepto'

describe('HTML5Video playback', function() {
  beforeEach(() => {
    this.options = { src: 'http://example.com/dash.ogg' }
  })

  test('checks if it can play a resource', () => {
    expect(HTML5Video.canPlay()).toBeFalsy()
    expect(HTML5Video.canPlay('')).toBeFalsy()
    expect(HTML5Video.canPlay('resource_without_dots')).toBeFalsy()
    // expect(HTML5Video.canPlay('http://domain.com/video.ogv')).toBeTruthy()
    // expect(HTML5Video.canPlay('http://domain.com/video.ogv?query_string=here')).toBeTruthy()
    // expect(HTML5Video.canPlay('/relative/video.ogv')).toBeTruthy()
  })

  // test('checks if it can play a resource with mime-type', () => {
  //   expect(HTML5Video.canPlay('resource_without_dots', 'video/ogg; codecs="theora, vorbis"')).toBeTruthy()
  // })

  test('does set a valid src to video element', () => {
    const playback = new HTML5Video(this.options)
    expect(playback._src).toEqual('http://example.com/dash.ogg')
  })

  test('starts not ready', () => {
    const playback = new HTML5Video(this.options)

    expect(playback.isReady).toBeUndefined()
  })

  test('can be ready', () => {
    const playback = new HTML5Video(this.options)
    playback._ready()

    expect(playback.isReady).toBeTruthy()
  })

  test('triggers PLAYBACK_PLAY_INTENT on play request', () => {
    window.HTMLMediaElement.prototype.play = () => { /* do nothing */ }

    const callback = jest.fn()
    const playback = new HTML5Video(this.options)

    playback.on(Events.PLAYBACK_PLAY_INTENT, callback)
    playback.play()

    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('trigger PLAYBACK_SEEK on media seeking event', done => {
    const callback = jest.fn()
    const playback = new HTML5Video({ src: '/test/fixtures/SampleVideo_360x240_1mb.mp4' })

    playback.on(Events.PLAYBACK_SEEK, callback)
    playback.on(Events.PLAYBACK_SEEK, () => {
      expect(callback).toHaveBeenCalledTimes(1)
      done()
    }, this)

    playback.el.dispatchEvent(new Event('seeking'))
  })

  test('triggers PLAYBACK_SEEKED on media seeked event', done => {
    const callback = jest.fn()
    const playback = new HTML5Video({ src: '/test/fixtures/SampleVideo_360x240_1mb.mp4' })

    playback.on(Events.PLAYBACK_SEEKED, callback)
    playback.on(Events.PLAYBACK_SEEKED, () => {
      expect(callback).toHaveBeenCalledTimes(1)
      done()
    }, this)

    playback.el.dispatchEvent(new Event('seeked'))
  })

  test('can check autoplay availability', done => {
    // FIXME: find a way to set disableCanAutoPlay to true only if Travis run
    const playback = new HTML5Video({ src: 'http://example.com/dash.ogg', mute: true, disableCanAutoPlay: true })
    const callback = jest.fn((result, error) => {
      expect(result).toBeTruthy()
      expect(error).toBeNull()
      expect(callback).toHaveBeenCalledTimes(1)
      done()
    })

    playback.canAutoPlay(callback)
  })

  test('can be consented', done => {
    window.HTMLMediaElement.prototype.load = () => { /* do nothing */ }
    const playback = new HTML5Video({ src: '/test/fixtures/SampleVideo_360x240_1mb.mp4' })
    const callback = jest.fn(() => {
      expect(callback).toHaveBeenCalledTimes(1)
      done()
    })

    playback.consent(callback)
    playback.el.dispatchEvent(new Event('loadedmetadata'))
  })

  // test('isPlaying() is true after constructor when autoPlay is true', done => {
  //   const playback = new HTML5Video({ src: 'http://example.com/dash.ogg', autoPlay: true, mute: true, disableCanAutoPlay: true })

  //   playback.on(Events.PLAYBACK_PLAY_INTENT, () => {
  //     expect(playback.isPlaying()).toBeTruthy()
  //     done()
  //   })
  // })

  test('setup crossorigin attribute', () => {
    const options = $.extend({ playback: { crossOrigin: 'use-credentials' } }, this.options)
    const playback = new HTML5Video(options)

    expect(playback.el.crossOrigin).toEqual('use-credentials')
    expect(playback.el.getAttribute('crossorigin')).toEqual('use-credentials')
  })

  test('enables inline playback for webviews when playInline flag is set', () => {
    const options = $.extend({ playback: { playInline: true } }, this.options)
    const playback = new HTML5Video(options)

    expect(playback.el['x-webkit-playsinline']).toBeTruthy()
    expect(playback.el.getAttribute('playsinline')).toEqual('playsinline')
  })

  test('allows displaying default video tag controls', () => {
    const options1 = { ...this.options }
    const playback1 = new HTML5Video(options1)
    expect(playback1.el.hasAttribute('controls')).toBeFalsy()

    const options2 = Object.assign({ playback: { controls: 'controls' } }, this.options)
    const playback2 = new HTML5Video(options2)
    expect(playback2.el.hasAttribute('controls')).toBeTruthy()

    const options3 = Object.assign({ playback: { controls: false } }, this.options)
    const playback3 = new HTML5Video(options3)
    expect(playback3.el.hasAttribute('controls')).toBeFalsy()
  })

  test('mute or unmute video element when volume is changed', () => {
    const playback = new HTML5Video(this.options)

    expect(playback.el.getAttribute('muted')).toBeNull()
    expect(playback.el.muted).toBeFalsy()

    playback.volume(0)
    expect(playback.el.getAttribute('muted')).toEqual('true')
    expect(playback.el.muted).toBeTruthy()

    playback.volume(0.5)
    expect(playback.el.getAttribute('muted')).toBeNull()
    expect(playback.el.muted).toBeFalsy()
  })

  // test('setup external tracks', () => {
  //   let newTrackUrl = () => { URL.createObjectURL(new Blob([], { type: 'text/vtt' })) }
  //   const options = $.extend({ playback: {
  //     externalTracks: [
  //       { lang: 'en', label: 'English', src: newTrackUrl(), kind: 'subtitles' },
  //       { lang: 'fr', label: 'French', src: newTrackUrl() }
  //     ]
  //   } }, this.options)
  //   const playback = new HTML5Video(options)
  //   playback.render()
  //   const $tracks = playback.$el.find('track[data-html5-video-track]')

  //   expect($tracks[0].getAttribute('data-html5-video-track')).toEqual('0')
  //   expect($tracks[0].getAttribute('kind')).toEqual('subtitles')
  //   expect($tracks[0].getAttribute('label')).toEqual('English')
  //   expect($tracks[0].getAttribute('srclang')).toEqual('en')

  //   expect($tracks[1].getAttribute('data-html5-video-track')).toEqual('1')
  //   expect($tracks[1].getAttribute('kind')).toEqual('subtitles')
  //   expect($tracks[1].getAttribute('label')).toEqual('French')
  //   expect($tracks[1].getAttribute('srclang')).toEqual('fr')
  // })

  // test('can switch text tracks', () => {
  //   let newTrackUrl = () => { URL.createObjectURL(new Blob([], { type: 'text/vtt' })) }
  //   const options = $.extend({ playback: {
  //     externalTracks: [
  //       { lang: 'en', label: 'English', src: newTrackUrl(), kind: 'subtitles' },
  //       { lang: 'fr', label: 'French', src: newTrackUrl() }
  //     ]
  //   } }, this.options)
  //   const playback = new HTML5Video(options)
  //   playback.render()

  //   expect(playback.hasClosedCaptionsTracks).toBeTruthy()
  //   expect(playback.closedCaptionsTracks.length).equal(2)
  //   expect(playback.closedCaptionsTrackId).equal(-1)
  //   expect(playback.closedCaptionsTracks[0].track.mode).to.not.equal('showing')
  //   expect(playback.closedCaptionsTracks[1].track.mode).to.not.equal('showing')

  //   playback.closedCaptionsTrackId = 0
  //   expect(playback.closedCaptionsTrackId).equal(0)
  //   expect(playback.closedCaptionsTracks[0].track.mode).equal('showing')
  //   expect(playback.closedCaptionsTracks[1].track.mode).to.not.equal('showing')

  //   playback.closedCaptionsTrackId = 1
  //   expect(playback.closedCaptionsTrackId).equal(1)
  //   expect(playback.closedCaptionsTracks[0].track.mode).to.not.equal('showing')
  //   expect(playback.closedCaptionsTracks[1].track.mode).equal('showing')

  //   playback.closedCaptionsTrackId = -1
  //   expect(playback.closedCaptionsTrackId).equal(-1)
  //   expect(playback.closedCaptionsTracks[0].track.mode).to.not.equal('showing')
  //   expect(playback.closedCaptionsTracks[1].track.mode).to.not.equal('showing')
  // })

  describe('progress', () => {
    let start, end, currentTime, playback
    const duration = 300
    const fakeEl = {
      get currentTime() { return currentTime },
      get duration() { return duration },
      get buffered() { return { start: (i) => start[i], end: (i) => end[i], get length() { return start.length } } }
    }

    beforeEach(() => {
      currentTime = 0
      start = [0]
      end = [30]

      this.callback = jest.fn()
      playback = new HTML5Video(this.options)
      playback.setElement(fakeEl)
      playback.on(Events.PLAYBACK_PROGRESS, this.callback)
    })

    test('should trigger PLAYBACK_PROGRESS with current buffer position', () => {
      playback._onProgress() // cannot trigger event on fake element (improve later?)
      let currentProgress = this.callback.mock.calls[0][0]

      expect(currentProgress.start).toEqual(start[0])
      expect(currentProgress.current).toEqual(end[0])
      expect(currentProgress.total).toEqual(duration)
    })

    test('should find current buffer position', () => {
      start = [0, 50, 180]
      end = [30, 90, 280]
      currentTime = 75 // this should be located at index 1

      playback._onProgress() // cannot trigger event on fake element (improve later?)
      let progress = this.callback.mock.calls[0][0]

      expect(progress.start).toEqual(start[1])
      expect(progress.current).toEqual(end[1])
    })

    test('does not trigger buffer event when the playback is initialized', () => {
      /*
        Only trigger buffer events when buffer state change.
        The default value for _bufferState is false.
      */

      let builtInEvents = ['loadedmetadata', 'progress', 'timeupdate'].map(
        function(label) {
          return new Event(label)
        }
      )

      let callback = jest.fn()
      let playback = new HTML5Video(this.options)

      playback.on(Events.PLAYBACK_BUFFERING, callback)
      playback.on(Events.PLAYBACK_BUFFERFULL, callback)

      builtInEvents.map(function(event) { playback.el.dispatchEvent(event) })
      expect(callback).not.toHaveBeenCalled()
    })

    test('should return an array of buffer segments as {start, end} objects', () => {
      start = [0, 50, 180]
      end = [30, 90, 280]

      playback._onProgress() // cannot trigger event on fake element (improve later?)
      let buffered = this.callback.mock.calls[0][1]

      expect(buffered.length).toEqual(start.length)
      expect(buffered[0]).toEqual({ start: start[0], end: end[0] })
      expect(buffered[1]).toEqual({ start: start[1], end: end[1] })
      expect(buffered[2]).toEqual({ start: start[2], end: end[2] })
    })
  })

  // test('should be able to identify it can play resources independently of the file extension case', () => {
  //   expect(HTML5Video.canPlay('/relative/video.ogg')).toBeTruthy()
  //   expect(HTML5Video.canPlay('/relative/VIDEO.OGG')).toBeTruthy()
  // })

  describe('options', () => {
    test('should use the playback object within player options', () => {
      const options = {
        src: 'http://example.com/video.m3u8',
        nonPlaybackOption: false,
        playback: {
          somePlaybackOption: true
        }
      }
      const html5Video = new HTML5Video(options)
      expect(html5Video.options.playback.somePlaybackOption).toBeTruthy()
      expect(Object.keys(html5Video.options.playback)).not.toContain('nonPlaybackOption')
    })

    test('should use hlsjsConfig from player options as fallback', () => {
      const options = {
        src: 'http://example.com/video.m3u8',
        nonPlaybackOption: false,
        somePlaybackOption: true
      }
      const html5Video = new HTML5Video(options)
      expect(html5Video.options.playback.somePlaybackOption).toBeTruthy()
      expect(html5Video.options.playback.nonPlaybackOption).toBeFalsy()
    })

    it('respect minimumDvrSize precedence over _minDvrSize default value', () => {
      const options = { src: 'http://example.com/video.m3u8' }
      let html5Video = new HTML5Video(options)

      expect(html5Video._minDvrSize).toEqual(60)

      html5Video = new HTML5Video({ ...options, playback: { minimumDvrSize: 10 } })

      expect(html5Video._minDvrSize).toEqual(10)
    })
  })

  describe('video element', () => {
    beforeEach(() => {
      window.HTMLMediaElement.prototype.play = () => { /* do nothing */ }
      window.HTMLMediaElement.prototype.pause = () => { /* do nothing */ }
      window.HTMLMediaElement.prototype.stop = () => { /* do nothing */ }
    })

    test('should set src url from options', () => {
      const options = {
        src: 'http://example.com/some_source?query_string=here',
        mimeType: 'application/x-mpegURL'
      }
      const html5Video = new HTML5Video(options)
      html5Video.render()
      expect(html5Video.el.getAttribute('src')).toEqual(options.src)
    })

    test('should have src attribute removed after stop, and then added after play', () => {
      const options = {
        src: 'http://example.com/video.mp4'
      }
      const html5Video = new HTML5Video(options)
      html5Video.render()
      html5Video.play()
      html5Video.stop()
      expect(html5Video.el.hasAttribute('src')).toBeFalsy()
      html5Video.play()
      expect(html5Video.el.getAttribute('src')).toEqual(options.src)
    })
  })

  describe('audio resources', () => {
    // test('should be able to play audio resources', () => {
    //   expect(HTML5Video.canPlay('http://domain.com/Audio.oga')).toBeTruthy()
    //   expect(HTML5Video.canPlay('http://domain.com/Audio.oga?query_string=here')).toBeTruthy()
    //   expect(HTML5Video.canPlay('/relative/Audio.oga')).toBeTruthy()
    //   expect(HTML5Video.canPlay('/relative/Audio.wav')).toBeTruthy()
    // })

    test('should play audio resources on an audio tag', () => {
      const options = { src: 'http://example.com/dash.oga' }
      const playback = new HTML5Video(options)
      expect(playback.tagName).toEqual('audio')
    })

    test('should use an audio tag when the audioOnly option is set to true', () => {
      const options = {
        src: 'http://example.com/dash.m3u8',
        playback: { audioOnly: true }
      }
      const playback = new HTML5Video(options)
      expect(playback.tagName).toEqual('audio')
    })

    test('should not play video resources on an audio tag if audioOnly flag is not set and a video mime-type is set', () => {
      const options = { src: 'http://example.com/video.mp4', mimeType: 'video/mp4' }
      const playback = new HTML5Video(options)
      expect(playback.isAudioOnly).toBeFalsy()
      expect(playback.tagName).toEqual('video')
    })

    test('should play on audio tag if audioOnly flag is not set and the mime-type specified is audio only', () => {
      let options = { src: 'http://example.com/audio?some_parameter=value', mimeType: 'audio/ogg' },
        playback = new HTML5Video(options)
      expect(playback.isAudioOnly).toBeTruthy()
      expect(playback.tagName).toEqual('audio')

      options = { src: 'http://example.com/audio?some_parameter=value', mimeType: 'audio/wav' }
      playback = new HTML5Video(options)
      expect(playback.isAudioOnly).toBeTruthy()
      expect(playback.tagName).toEqual('audio')
    })

    test('should not play video resources on an audio tag if audioOnly flag is not set', () => {
      const options = { src: 'http://example.com/dash.m3u8' }
      const playback = new HTML5Video(options)
      expect(playback.isAudioOnly).toBeFalsy()
      expect(playback.tagName).toEqual('video')
    })
  })

  test('can configure loop', () => {
    const options = $.extend({ loop: true }, this.options)
    const playback = new HTML5Video(options)

    expect(playback.el.loop).toEqual(true)

    playback.configure({ loop: false })

    expect(playback.el.loop).toEqual(false)

    playback.configure({ loop: true })

    expect(playback.el.loop).toEqual(true)
  })

  describe('getDuration', () => {
    test('return distinct duration references for different playback types', () => {
      let start = [0]
      let end = [30]
      let html5Video = new HTML5Video({ src: 'http://example.com/video.mp4' })
      html5Video.setElement({
        get duration() { return 10 },
        get seekable() { return { start: (i) => start[i], end: (i) => end[i], get length() { return start.length } } }
      })
      jest.spyOn(html5Video, 'getDuration')

      html5Video.getDuration()
      expect(html5Video.getDuration).toHaveReturnedWith(10)


      html5Video = new HTML5Video({ src: 'http://example.com/video.m3u8' })
      html5Video.setElement({
        get duration() { return 10 },
        get seekable() { return { start: (i) => start[i], end: (i) => end[i], get length() { return start.length } } }
      })
      jest.spyOn(html5Video, 'getDuration')
      jest.spyOn(html5Video, 'getPlaybackType').mockReturnValue('live')

      html5Video.getDuration()
      expect(html5Video.getDuration).toHaveReturnedWith(30)
    })

    test('retry to get duration for live media when there is no seekable range', () => {
      jest.useFakeTimers()
      let start = []
      let end = []
      let html5Video = new HTML5Video({ src: 'http://example.com/video.m3u8' })
      html5Video.setElement({ get seekable() { return { length: 0 } } })

      jest.spyOn(html5Video, 'getDuration')
      jest.spyOn(html5Video, 'getPlaybackType').mockReturnValue('live')
      jest.spyOn(html5Video, '_updateSettings')

      html5Video.getDuration()
      start = [0]
      end = [20]
      html5Video.setElement({
        get duration() { return 10 },
        get seekable() { return { start: (i) => start[i], end: (i) => end[i], get length() { return start.length } } }
      })

      jest.advanceTimersByTime(1000)
      expect(html5Video._updateSettings).toHaveBeenCalled()
      jest.clearAllTimers()

      expect(html5Video.getDuration).toHaveReturnedWith(20)
    })
  })

  describe('_onTimeUpdate', () => {
    test('return el.duration for VoD on PLAYBACK_TIMEUPDATE event', () => {
      const callback = jest.fn()
      const html5Video = new HTML5Video({ src: 'http://example.com/video.mp4' })
      html5Video.setElement({
        get duration() { return 10 },
        /* eslint-disable */
        get seekable() {
          return {
            start: (i) => start[i],
            end: (i) => end[i],
            get length() { return start.length }
          }
        }
        /* eslint-disable */
      })
      html5Video.on(Events.PLAYBACK_TIMEUPDATE, callback)
      html5Video._onTimeUpdate()

      expect(callback).toHaveBeenCalledWith({ current: undefined, total: 10 }, 'html5_video')
    })

    test('return getDuration() for Live on PLAYBACK_TIMEUPDATE event', () => {
      let start = [0]
      let end = [50]
      const callback = jest.fn()
      const html5Video = new HTML5Video({ src: 'http://example.com/video.m3u8' })

      html5Video.setElement({
        get duration() { return 10 },
        get seekable() {
          return {
            start: (i) => start[i],
            end: (i) => end[i],
            get length() { return start.length }
          }
        }
      })

      jest.spyOn(html5Video, 'getPlaybackType').mockReturnValue('live')

      html5Video.on(Events.PLAYBACK_TIMEUPDATE, callback)
      html5Video._onTimeUpdate()

      expect(callback).toHaveBeenCalledWith({ current: undefined, total: 50 }, 'html5_video')
    })
  })

  test('_updateDvr triggers DVR events with current status', () => {
    const DVR_STATUS = 'enabled'
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const html5Video = new HTML5Video({ src: 'http://example.com/video.m3u8' })

    html5Video.on(Events.PLAYBACK_DVR, callback1)
    html5Video.on(Events.PLAYBACK_STATS_ADD, callback2)

    html5Video._updateDvr(DVR_STATUS)

    expect(callback1).toHaveBeenCalledWith(DVR_STATUS)
    expect(callback2).toHaveBeenCalledWith({ dvr: DVR_STATUS })
  })

  test('dvrEnabled getter return current DVR status', () => {
    const html5Video = new HTML5Video({ src: 'http://example.com/video.m3u8' })
    jest.spyOn(html5Video, 'dvrEnabled', 'get')

    expect(html5Video.dvrEnabled).toEqual(false)

    jest.spyOn(html5Video, 'getDuration').mockReturnValue(5000)
    jest.spyOn(html5Video, 'getPlaybackType').mockReturnValue('live')

    expect(html5Video.dvrEnabled).toEqual(true)
  })

  test('isValidMinimumDVRSizeConfig getter guarantee a valid minimum DVR size', () => {
    let html5Video = new HTML5Video({ src: 'http://example.com/video.m3u8' })
    expect(html5Video.isValidMinimumDVRSizeConfig).toBeFalsy()

    html5Video = new HTML5Video({ src: 'http://example.com/video.m3u8', playback: { minimumDvrSize: null } })
    expect(html5Video.isValidMinimumDVRSizeConfig).toBeFalsy()

    html5Video = new HTML5Video({ src: 'http://example.com/video.m3u8', playback: { minimumDvrSize: 'test' } })
    expect(html5Video.isValidMinimumDVRSizeConfig).toBeFalsy()

    html5Video = new HTML5Video({ src: 'http://example.com/video.m3u8', playback: { minimumDvrSize: '10' } })
    expect(html5Video.isValidMinimumDVRSizeConfig).toBeFalsy()

    html5Video = new HTML5Video({ src: 'http://example.com/video.m3u8', playback: { minimumDvrSize: 0 } })
    expect(html5Video.isValidMinimumDVRSizeConfig).toBeTruthy()

    html5Video = new HTML5Video({ src: 'http://example.com/video.m3u8', playback: { minimumDvrSize: 10 } })
    expect(html5Video.isValidMinimumDVRSizeConfig).toBeTruthy()
  })

  describe('seek', () => {
    test('use duration when occurs seek with negative values', () => {
      const html5Video = new HTML5Video({ src: 'http://example.com/video.m3u8' })
      jest.spyOn(html5Video, 'getDuration').mockReturnValue(5000)
      html5Video.seek(-1)

      expect(html5Video.el.currentTime).toEqual(5000)
    })

    test('always use a margin for video currentTime to check DVR status', () => {
      const start = [0]
      const end = [100]

      const html5Video = new HTML5Video({ src: 'http://example.com/video.m3u8' })
      jest.spyOn(html5Video, 'getPlaybackType').mockReturnValue('live')
      jest.spyOn(html5Video, '_updateDvr')
      html5Video.setElement({
        get seekable() {
          return {
            start: (i) => start[i],
            end: (i) => end[i],
            get length() { return start.length }
          }
        }
      })
      html5Video.seek(html5Video.el.seekable.end(0))

      expect(html5Video._updateDvr).toHaveBeenCalledWith(false)

      html5Video.seek(96)

      expect(html5Video._updateDvr).toHaveBeenCalledWith(true)
    })
  })
})
