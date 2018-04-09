import Events from 'base/events.js'
import Core from '../../src/components/core'
import HLS from 'playbacks/hls'
import HLSJS from 'hls.js'

describe('HLS playback', () => {
  it('should be able to identify it can play resources independently of the file extension case', function() {

    // FIXME: why is this not working in Firefox?
    if (window.navigator.userAgent.match(/Firefox\//))
      return


    // FIXME: this should actually use a mock of HlsJs
    //        we are not testing Hls.js or browser capabilities here
    //        but the logic inside HLS-Playback

    expect(HLS.canPlay('/relative/video.m3u8')).to.be.true
    expect(HLS.canPlay('/relative/VIDEO.M3U8')).to.be.true
    expect(HLS.canPlay('/relative/video.m3u8?foobarQuery=1234#somefragment')).to.be.true
    expect(HLS.canPlay('whatever_no_extension?foobarQuery=1234#somefragment', 'application/x-mpegURL' )).to.be.true
    expect(HLS.canPlay('//whatever_no_extension?foobarQuery=1234#somefragment', 'application/x-mpegURL' )).to.be.true
  })

  it('should ensure it does not create an audio tag if audioOnly is not set', function() {
    let options = { src: 'http://clappr.io/video.m3u8' },
      playback = new HLS(options)
    expect(playback.tagName).to.be.equal('video')
    options = { src: 'http://clappr.io/video.m3u8', mimeType: 'application/x-mpegurl' }
    playback = new HLS(options)
    expect(playback.tagName).to.be.equal('video')
  })

  it('should play on an audio tag if audioOnly is set', function() {
    let options = { src: 'http://clappr.io/video.m3u8', playback: { audioOnly: true } },
      playback = new HLS(options)
    expect(playback.tagName).to.be.equal('audio')
  })

  describe('options backwards compatibility', function() {
    // backwards compatibility (TODO: remove on 0.3.0)
    it('should set options.playback as a reference to options if options.playback not set', function() {
      let options = { src: 'http://clappr.io/video.m3u8' },
        hls = new HLS(options)
      expect(hls.options.playback).to.be.equal(hls.options)
      options = { src: 'http://clappr.io/video.m3u8', playback: { test: true } }
      hls = new HLS(options)
      expect(hls.options.playback.test).to.be.equal(true)
    })
  })

  describe('hls.js configuration', function() {
    it('should use hlsjsConfig from playback options', function() {
      const options = {
        src: 'http://clappr.io/video.m3u8',
        playback: {
          hlsMinimumDvrSize: 1,
          hlsjsConfig: {
            someHlsjsOption: 'value'
          }
        }
      }
      const playback = new HLS(options)
      playback._setup()
      expect(playback._hls.config.someHlsjsOption).to.be.equal('value')
      expect(playback._hls.config).not.to.include.keys('hlsMinimumDvrSize')
    })

    it('should use hlsjsConfig from player options as fallback', function() {
      const options = {
        src: 'http://clappr.io/video.m3u8',
        hlsMinimumDvrSize: 1,
        hlsjsConfig: {
          someHlsjsOption: 'value'
        }
      }
      const playback = new HLS(options)
      playback._setup()
      expect(playback._hls.config.someHlsjsOption).to.be.equal('value')
      expect(playback._hls.config).not.to.include.keys('hlsMinimumDvrSize')
    })
  })

  it('should trigger a playback error if source load failed', function() {
    let resolveFn = undefined
    const promise = new Promise((resolve) => {
      resolveFn = resolve
    })
    let options = { src: 'http://clappr.io/notfound.m3u8' }
    const core = new Core({})
    const playback = new HLS(options, null, core.playerError)
    playback.on(Events.PLAYBACK_ERROR, (e) => {
      resolveFn(e)
    })
    playback.play()

    return promise.then((e) => {
      expect(e.raw.type).to.be.equal(HLSJS.ErrorTypes.NETWORK_ERROR)
      expect(e.raw.details).to.be.equal(HLSJS.ErrorDetails.MANIFEST_LOAD_ERROR)
    })
  })

  xit('levels', function() {
    let playback
    beforeEach(() => {
      const options = { src: 'http://clappr.io/foo.m3u8' }
      playback = new HLS(options)
      playback.setupHls()
      // NOTE: rather than trying to call playback.setupHls, we'll punch a new one in place
      playback.hls = {
        levels: []
      }
      playback.fillLevels()
    })

    it('supports specifying the level', () => {
      // AUTO by default (-1)
      expect(playback.currentLevel).to.equal(-1)

      // Supports other level specification. Should keep track of it
      // on itself and by proxy on the HLS.js object.
      playback.currentLevel = 0
      expect(playback.currentLevel).to.equal(0)
      expect(playback.hls.currentLevel).to.equal(0)
      playback.currentLevel = 1
      expect(playback.currentLevel).to.equal(1)
      expect(playback.hls.currentLevel).to.equal(1)
    })
  })
})
