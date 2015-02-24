var utils = require('../src/base/utils');

describe('Utils', () => {
  it('should convert querystring seek regex in seconds', () => {

    var url = 'http://globotv.globo.com/rede-globo/globo-esporte/v/brasil-usa-col/3735973/?t=1h10m30s'
    expect(utils.seekStringToSeconds(url)).to.equal(4230);

    url = 'http://globotv.globo.com/rede-globo/globo-esporte/v/brasil-usa-col/3735973/?t=40s'
    expect(utils.seekStringToSeconds(url)).to.equal(40);

    url = 'http://globotv.globo.com/rede-globo/globo-esporte/v/brasil-usa-col/3735973/?t=40s&stretch=false'
    expect(utils.seekStringToSeconds(url)).to.equal(40);

    url = 'http://globotv.globo.com/rede-globo/globo-esporte/v/brasil-usa-col/3735973/?t=30m5s'
    expect(utils.seekStringToSeconds(url)).to.equal(1805);

    url = 'http://globotv.globo.com/rede-globo/globo-esporte/v/brasil-usa-col/3735973/?t=1m'
    expect(utils.seekStringToSeconds(url)).to.equal(60);

    url = 'http://globotv.globo.com/rede-globo/globo-esporte/v/brasil-usa-col/3735973/?t=1h10s'
    expect(utils.seekStringToSeconds(url)).to.equal(3610);

    url = 'http://globo.com/rede-globo/globo-esporte/v/brasil-usa-col/3735973/?autoPlay=true&t=5m5s'
    expect(utils.seekStringToSeconds(url)).to.equal(305);

    url = 'http://globo.com/rede-globo/globo-esporte/v/brasil-usa-col/3735973/'
    expect(utils.seekStringToSeconds(url)).to.equal(0);
  });

  describe('Config', () => {
    beforeEach(() => {
      localStorage.removeItem("clappr.localhost.volume")
    });

    it('restores default volume', () => {
      expect(utils.Config.restore('volume')).to.be.equal(100)
    });

    it('restores a persisted volume', () => {
      utils.Config.persist('volume', 42)
      expect(utils.Config.restore('volume')).to.be.equal(42)
    });

    it('returns undefined for unknown key', () => {
      expect(utils.Config.restore('unknown.key.CAFE')).to.be.equal(undefined)
    });
  });
})


