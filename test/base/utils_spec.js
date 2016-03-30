import * as utils from '../../src/base/utils'

var pushUrl = function(path) {
  window.history.pushState({},"", path)
}

describe('Utils', function() {
  it('creates unique id for a given prefix', function() {
    expect(utils.uniqueId("a")).to.not.be.equal(utils.uniqueId("a"))
  });

  it('converts seconds to time string format', function() {
    expect(utils.formatTime(1)).to.be.equal("00:01")
    expect(utils.formatTime(10)).to.be.equal("00:10")
    expect(utils.formatTime(60 * 10 + 15)).to.be.equal("10:15")
    expect(utils.formatTime(60 * 60 * 12)).to.be.equal("12:00:00")
    expect(utils.formatTime(60 * 60 * 24)).to.be.equal("1:00:00:00")
    expect(utils.formatTime(60 * 60 * 27)).to.be.equal("1:03:00:00")
  });

  it('should convert querystring seek regex in seconds', function() {

    pushUrl("/some/path/?t=1h10m30s")
    expect(utils.seekStringToSeconds()).to.equal(4230)

    pushUrl("/some/path/?t=40s")
    expect(utils.seekStringToSeconds()).to.equal(40)

    pushUrl("/some/path/?t=40s&stretch=false")
    expect(utils.seekStringToSeconds()).to.equal(40)

    pushUrl("/some/path/?t=30m5s")
    expect(utils.seekStringToSeconds()).to.equal(1805)

    pushUrl("/some/path/?t=1m")
    expect(utils.seekStringToSeconds()).to.equal(60)

    pushUrl("/some/path/?t=1h10s")
    expect(utils.seekStringToSeconds()).to.equal(3610)

    pushUrl("/some/path/?autoPlay=true&t=5m5s")
    expect(utils.seekStringToSeconds()).to.equal(305)

    pushUrl("/some/path/")
    expect(utils.seekStringToSeconds()).to.equal(0)

    pushUrl("/some/path/videos-1h/")
    expect(utils.seekStringToSeconds()).to.equal(0)

    pushUrl("/video/business/media/100000003661916/destroying.html?playlistId=1194811622182#t=6000&cview=true")
    expect(utils.seekStringToSeconds()).to.equal(6000);

    pushUrl("/video/business/media/100000003661916/destroying.html?playlistId=1194811622182#t=6000s&cview=true")
    expect(utils.seekStringToSeconds()).to.equal(6000);

    pushUrl("/video/business/media/100000003661916/destroying.html?playlistId=1194811622182#t=10m10s&cview=true")
    expect(utils.seekStringToSeconds()).to.equal(610);

    pushUrl("/video/business/media/100000003661916/destroying.html?playlistId=1194811622182#t=1h20m10s&cview=true")
    expect(utils.seekStringToSeconds()).to.equal(4810);

    pushUrl("/video/business/media/100000003661916/destroying.html?playlistId=1194811622182#t=6000s")
    expect(utils.seekStringToSeconds()).to.equal(6000);

    pushUrl("/video/business/media/100000003661916/destroying.html?playlistId=1194811622182#t=6000")
    expect(utils.seekStringToSeconds()).to.equal(6000);

    pushUrl("/video/business/media/100000003661916/destroying.html?playlistId=1194811622182&t=5m5s")
    expect(utils.seekStringToSeconds()).to.equal(305);

    pushUrl("/video/business/media/100000003661916/destroying.html?t=5m5s")
    expect(utils.seekStringToSeconds()).to.equal(305);

    pushUrl("/video/business/media/100000003661916/destroying.html?playlistId=1194811622182#t=5m5s")
    expect(utils.seekStringToSeconds()).to.equal(305);

    pushUrl("/video/business/media/100000003661916/destroying.html?playlistId=1194811622182&t=1h10m30s")
    expect(utils.seekStringToSeconds()).to.equal(4230);

    pushUrl("/video/business/media/100000003661916/destroying.html?playlistId=1194811622182&t=1m")
    expect(utils.seekStringToSeconds()).to.equal(60);

    pushUrl("/video/business/media/100000003661916/destroying.html?playlistId=1194811622182&t=40s")
    expect(utils.seekStringToSeconds()).to.equal(40);

    pushUrl("/video/business/media/100000003661916/destroying.html?playlistId=1194811622182&t=40s&more=here")
    expect(utils.seekStringToSeconds()).to.equal(40);

    pushUrl("/video/business/media/100000003661916/destroying.html?playlistId=1194811622182&t=30m5s")
    expect(utils.seekStringToSeconds()).to.equal(1805);

    pushUrl("/video/business/media/100000003661916/destroying.html?playlistId=1194811622182&t=5m5s")
    expect(utils.seekStringToSeconds()).to.equal(305);

    pushUrl("/video/business/media/100000003661916/destroying.html?playlistId=1194811622182")
    expect(utils.seekStringToSeconds()).to.equal(0);
  })

  describe('Config', function() {
    beforeEach(function() {
      localStorage.removeItem("clappr.localhost.volume")
    })

    it('restores default volume', function() {
      expect(utils.Config.restore('volume')).to.be.equal(100)
    })

    it('restores a persisted volume', function() {
      utils.Config.persist('volume', 42)
      expect(utils.Config.restore('volume')).to.be.equal(42)
    })

    it('returns undefined for unknown key', function() {
      expect(utils.Config.restore('unknown.key.CAFE')).to.be.equal(undefined)
    })
  })
})
