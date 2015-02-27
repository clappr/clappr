var Player = require('../src/components/player');

describe('Player', () => {
  describe('constructor', () => {
    it('persists config by default', () => {
      var player = new Player({source: '/playlist.m3u8'})
      expect(player.options.persistConfig).to.be.equal(true);
    });

    it('can set persists config', () => {
      var player = new Player({source: '/playlist.m3u8', persistConfig: false})
      expect(player.options.persistConfig).to.be.equal(false);
    });

    it('should normalize sources', () => {
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
  });
});
