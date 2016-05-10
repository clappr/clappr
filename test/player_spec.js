import Player from '../src/components/player'
import Events from '../src/base/events'

describe('Player', function() {
  describe('constructor', function() {

    it('has unique sequential id', function() {
      var player1 = new Player({source: '/playlist.m3u8', baseUrl: 'http://cdn.clappr.io/latest'})
      var player2 = new Player({source: '/playlist.m3u8', baseUrl: 'http://cdn.clappr.io/latest'})
      var player3 = new Player({source: '/playlist.m3u8', baseUrl: 'http://cdn.clappr.io/latest'})

      var p1Id = player1.options.playerId
      var p2Id = player2.options.playerId
      var p3Id = player3.options.playerId

      expect(p2Id).to.be.above(p1Id)
      expect(p3Id).to.be.above(p2Id)
    })

    it('uses the baseUrl passed from initialization', function() {
      var player = new Player({source: '/playlist.m3u8', baseUrl: 'http://cdn.clappr.io/latest'})
      expect(player.options.baseUrl).to.be.equal('http://cdn.clappr.io/latest')
    })

    it('persists config by default', function() {
      var player = new Player({source: '/playlist.m3u8'})
      expect(player.options.persistConfig).to.be.equal(true)
    })

    it('can set persists config', function() {
      var player = new Player({source: '/playlist.m3u8', persistConfig: false})
      expect(player.options.persistConfig).to.be.equal(false)
    })

    it('should normalize sources', function() {
      var player = new Player({source: '/playlist.m3u8', persistConfig: false})
      var normalizedSources = player._normalizeSources({sources: ["http://test.mp4"]})
      expect(normalizedSources).to.have.length(1)
      expect(normalizedSources[0]).to.be.equal('http://test.mp4')

      normalizedSources = player._normalizeSources({source: "http://test.mp4"})
      expect(normalizedSources).to.have.length(1)
      expect(normalizedSources[0]).to.be.equal('http://test.mp4')

      normalizedSources = player._normalizeSources({sources: []})
      expect(normalizedSources).to.have.length(1)
      expect(JSON.stringify(normalizedSources[0])).to.be.equal(JSON.stringify({source: "", mimeType: ""}))
    })

    it('should trigger error events', function() {
      var player = new Player({source: '/video.mp4', persistConfig: false})
      var element = document.createElement('div')
      var onError = sinon.spy()
      player.on(Events.PLAYER_ERROR, onError)
      player.attachTo(element)
      // some playbacks don't have an error() method. e.g flash
      if (player.core.getCurrentContainer().playback.error) {
        player.core.getCurrentContainer().playback.error()
        expect(onError).called.once
      }
    })
  })
})
