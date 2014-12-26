var Player = require('../src/components/player');

describe('Player', () => {
  describe('constructor', () => {
    it('persists config by default', () => {
      var player = new Player({src: '/playlist.m3u8'})
      expect(player.options.persistConfig).to.be.equal(true);
    });

    it('can set persists config', () => {
      var player = new Player({src: '/playlist.m3u8', persistConfig: false})
      expect(player.options.persistConfig).to.be.equal(false);
    });
  });
});
