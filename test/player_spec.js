import Player from '../src/components/player'
import Events from '../src/base/events'

describe('Player', function() {
  describe('constructor', function() {

    it('has unique sequential id', function() {
      const player1 = new Player({source: '/playlist.m3u8', baseUrl: 'http://cdn.clappr.io/latest'})
      const player2 = new Player({source: '/playlist.m3u8', baseUrl: 'http://cdn.clappr.io/latest'})
      const player3 = new Player({source: '/playlist.m3u8', baseUrl: 'http://cdn.clappr.io/latest'})

      const p1Id = player1.options.playerId
      const p2Id = player2.options.playerId
      const p3Id = player3.options.playerId

      expect(p2Id).to.be.above(p1Id)
      expect(p3Id).to.be.above(p2Id)
    })

    it('uses the baseUrl passed from initialization', function() {
      const player = new Player({source: '/playlist.m3u8', baseUrl: 'http://cdn.clappr.io/latest'})
      expect(player.options.baseUrl).to.be.equal('http://cdn.clappr.io/latest')
    })

    it('persists config by default', function() {
      const player = new Player({source: '/playlist.m3u8'})
      expect(player.options.persistConfig).to.be.equal(true)
    })

    it('can set persists config', function() {
      const player = new Player({source: '/playlist.m3u8', persistConfig: false})
      expect(player.options.persistConfig).to.be.equal(false)
    })

    it('gets plugins by name', function() {
      const player = new Player({source: '/playlist.m3u8', persistConfig: false})
      const plugin = {name: 'fake'}
      player.core = {plugins: [plugin], mediaControl: {container: {plugins: []}}}
      assert.equal(plugin, player.getPlugin('fake'))
    })

    it('should normalize sources', function() {
      const player = new Player({source: '/playlist.m3u8', persistConfig: false})
      let normalizedSources = player._normalizeSources({sources: ['http://test.mp4']})
      expect(normalizedSources).to.have.length(1)
      expect(normalizedSources[0]).to.be.equal('http://test.mp4')

      normalizedSources = player._normalizeSources({source: 'http://test.mp4'})
      expect(normalizedSources).to.have.length(1)
      expect(normalizedSources[0]).to.be.equal('http://test.mp4')

      normalizedSources = player._normalizeSources({sources: []})
      expect(normalizedSources).to.have.length(1)
      expect(JSON.stringify(normalizedSources[0])).to.be.equal(JSON.stringify({source: '', mimeType: ''}))
    })

    it('should trigger error events', function() {
      const player = new Player({source: '/video.mp4', persistConfig: false})
      const element = document.createElement('div')
      const onError = sinon.spy()
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
