import Config from '../../src/base/utils'

var MediaControl = require('../../src/components/media_control');
var FakePlayback = require('../../src/base/playback');
var Container = require('../../src/components/container');

describe('MediaControl', function() {
  beforeEach(function() {
    this.playback = new FakePlayback();
    this.container = new Container({playback: this.playback});
    this.mediaControl = new MediaControl({container: this.container});
    localStorage.removeItem("clappr.localhost.volume")
  });

  describe('#constructor', function() {
    it('can be built muted', function() {
      var mediaControl = new MediaControl({mute: true, container: this.container});
      expect(mediaControl.mute).to.be.equal(true);
      expect(mediaControl.currentVolume).to.be.equal(0);
    });

    it('restores saved volume', function() {
      utils.Config.persist('volume', 42)
      var mediaControl = new MediaControl({persistConfig: true, container: this.container});

      expect(mediaControl.currentVolume).to.be.equal(42)
    });
  });

  describe('#setVolume', function() {
    it('sets the volume', function() {
      sinon.spy(this.container, 'setVolume');
      sinon.spy(this.mediaControl, 'setVolumeLevel');

      this.mediaControl.setVolume(42)

      expect(this.mediaControl.currentVolume).to.be.equal(42)
      expect(this.mediaControl.mute).to.be.equal(false)
      expect(this.container.setVolume).called.once;
      expect(this.mediaControl.setVolumeLevel).called.once;
    });

    it('limits volume to an integer between 0 and 100', function() {
      this.mediaControl.setVolume(1000)
      expect(this.mediaControl.currentVolume).to.be.equal(100)

      this.mediaControl.setVolume(101)
      expect(this.mediaControl.currentVolume).to.be.equal(100)

      this.mediaControl.setVolume(481)
      expect(this.mediaControl.currentVolume).to.be.equal(100)

      this.mediaControl.setVolume(-1)
      expect(this.mediaControl.currentVolume).to.be.equal(0)

      this.mediaControl.setVolume(0)
      expect(this.mediaControl.currentVolume).to.be.equal(0)
    })

    it('mutes when volume is 0 or less than 0', function() {
      this.mediaControl.setVolume(10)
      expect(this.mediaControl.mute).to.be.equal(false)

      this.mediaControl.setVolume(0)
      expect(this.mediaControl.mute).to.be.equal(true)
    });

    it('persists volume when persistence is on', function() {
      // expected to be default value (100)
      expect(utils.Config.restore("volume")).to.be.equal(100)

      var mediacontrol = new MediaControl({persistConfig: true, container: this.container});
      mediacontrol.setVolume(78)

      expect(utils.Config.restore("volume")).to.be.equal(78)
    })
  });

  it('persists volume when persistence is on', function() {
    // expected to be default value (100)
    expect(utils.Config.restore("volume")).to.be.equal(100)

    var mediacontrol = new MediaControl({persistConfig: true, container: this.container});
    mediacontrol.setVolume(78)

    expect(utils.Config.restore("volume")).to.be.equal(78)
  })
});
