import HLS from 'playbacks/hls'

xit('HLS playback', () => {
  let playback

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
