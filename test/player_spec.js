var Player = require('../src/components/player')

describe('Player', function() {
  describe('constructor', function() {
    it('uses default assets url as default baseUrl', function() {
      var player = new Player({source: '/playlist.m3u8'})
      expect(player.options.baseUrl).to.be.equal('http://cdn.clappr.io/latest')
    })

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
      var normalizedSources = player.normalizeSources({sources: ["http://test.mp4"]})
      expect(normalizedSources).to.have.length(1)
      expect(normalizedSources[0]).to.be.equal('http://test.mp4')

      normalizedSources = player.normalizeSources({source: "http://test.mp4"})
      expect(normalizedSources).to.have.length(1)
      expect(normalizedSources[0]).to.be.equal('http://test.mp4')

      normalizedSources = player.normalizeSources({sources: []})
      expect(normalizedSources).to.have.length(1)
      expect(normalizedSources[0]).to.be.equal('no.op')
    })
  })
})
