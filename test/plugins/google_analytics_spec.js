import GoogleAnalytics from 'plugins/google_analytics'
import Container from 'components/container'
import FakePlayback from 'base/playback'

describe('GoogleAnalytics', function() {
  describe('constructor without gaAccount', function() {
    it('no trackerName by default', function() {
      var fakePlayback = new FakePlayback()
      var container = new Container({playback: fakePlayback})
      var gaControl = new GoogleAnalytics(container)

      expect(gaControl.trackerName).to.not.exist
    })
  })

  describe('constructor with gaAccount', function() {
    beforeEach(function() {
      window._gaq = []
    })
    it('trackerName equals to Clappr. by default', function() {
      var fakePlayback = new FakePlayback()
      var container = new Container({playback: fakePlayback, gaAccount: "UA-XXXXX-X"})
      var gaControl = new GoogleAnalytics(container)

      expect(gaControl.trackerName).to.equal("Clappr.")
    })
    it('tracks data with Clappr. as trackerName', function() {
      var fakePlayback = new FakePlayback()
      var container = new Container({playback: fakePlayback, gaAccount: "UA-XXXXX-X"})
      var gaControl = new GoogleAnalytics(container)

      gaControl.push(["Video", "Play", "video.mp4"])

      expect(window._gaq[0][0]).to.equal("Clappr._trackEvent")
      expect(window._gaq[0][1]).to.equal("Video")
      expect(window._gaq[0][2]).to.equal("Play")
      expect(window._gaq[0][3]).to.equal("video.mp4")
    })
  })

  describe('constructor with gaAccount, gaDomainName and gaTrackerName', function() {
    beforeEach(function() {
      window._gat = {}
      window._gaq = []
    })
    it('trackerName equals to gaTrackerName parameter', function() {
      var fakePlayback = new FakePlayback()
      var options = {playback: fakePlayback, gaAccount: "UA-XXXXX-X", gaTrackerName: "MyPlayerInstance", gaDomainName: "some.domain.com"}
      var container = new Container(options)
      var gaControl = new GoogleAnalytics(container)

      expect(gaControl.trackerName).to.equal("MyPlayerInstance.")
    })
    it('sets the account to gaAccount value', function() {
      var fakePlayback = new FakePlayback()
      var options = {playback: fakePlayback, gaAccount: "UA-XXXXX-X", gaTrackerName: "MyPlayerInstance", gaDomainName: "some.domain.com"}
      var container = new Container(options)
      var gaControl = new GoogleAnalytics(container)

      expect(window._gaq[0][0]).to.equal("MyPlayerInstance._setAccount")
      expect(window._gaq[0][1]).to.equal("UA-XXXXX-X")
    })
    it('sets the domain name to gaDomainName value', function() {
      var fakePlayback = new FakePlayback()
      var options = {playback: fakePlayback, gaAccount: "UA-XXXXX-X", gaTrackerName: "MyPlayerInstance", gaDomainName: "some.domain.com"}
      var container = new Container(options)
      var gaControl = new GoogleAnalytics(container)

      expect(window._gaq[1][0]).to.equal("MyPlayerInstance._setDomainName")
      expect(window._gaq[1][1]).to.equal("some.domain.com")
    })
    it('tracks data with gaTrackerName parameter as trackerName', function() {
      var fakePlayback = new FakePlayback()
      var options = {playback: fakePlayback, gaAccount: "UA-XXXXX-X", gaTrackerName: "MyPlayerInstance", gaDomainName: "some.domain.com"}
      var container = new Container(options)
      var gaControl = new GoogleAnalytics(container)
      gaControl.push(["Video", "Play", "video.mp4"])

      expect(window._gaq[2][0]).to.equal("MyPlayerInstance._trackEvent")
      expect(window._gaq[2][1]).to.equal("Video")
      expect(window._gaq[2][2]).to.equal("Play")
      expect(window._gaq[2][3]).to.equal("video.mp4")
    })
  })
})
