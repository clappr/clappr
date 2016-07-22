import HLS from 'playbacks/hls'

describe('HLS playback', () => {
  let playback

  it('should be able to identify it can play resources independently of the file extension case', function() {
    expect(HLS.canPlay('/relative/video.m3u8')).to.be.true
    expect(HLS.canPlay('/relative/VIDEO.M3U8')).to.be.true
  })

  it('should ensure it does not create an audio tag if audioOnly is not set', function() {
    let options = { src: 'http://example.com/video.m3u8' },
      playback = new HLS(options)
    expect(playback.tagName).to.be.equal('video')
    options = { src: 'http://example.com/video.m3u8', mimeType: 'application/x-mpegurl' }
    playback = new HLS(options)
    expect(playback.tagName).to.be.equal('video')
  })

  it('should play on an audio tag if audioOnly is set', function() {
    let options = { src: 'http://example.com/video.m3u8', playback: { audioOnly: true } },
      playback = new HLS(options)
    expect(playback.tagName).to.be.equal('audio')
  })

  xit('levels', function() {
    beforeEach(() => {
      const options = {src: 'http://example.com/foo.m3u8'}
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
