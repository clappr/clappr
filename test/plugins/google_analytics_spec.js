var GoogleAnalytics = require('../../src/plugins/google_analytics')
var gaControl

describe('GoogleAnalytics', function() {
  describe('constructor without gaAccount', function() {
    it('no trackerName by default', function() {
      gaControl = new GoogleAnalytics({})
      expect(gaControl.trackerName).to.not.exist
    })
  })

  describe('constructor with gaAccount', function() {
    beforeEach(function() {
      window._gaq = []
      gaControl = new GoogleAnalytics({gaAccount: "UA-XXXXX-X"})
    })
    it('trackerName equals to Clappr. by default', function() {
      expect(gaControl.trackerName).to.equal("Clappr.")
    })
    it('tracks data with Clappr. as trackerName', function() {
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
      gaControl = new GoogleAnalytics({gaAccount: "UA-XXXXX-X", gaTrackerName: "MyPlayerInstance", gaDomainName: "some.domain.com"})
    })
    it('trackerName equals to gaTrackerName parameter', function() {
      expect(gaControl.trackerName).to.equal("MyPlayerInstance.")
    })
    it('sets the account to gaAccount value', function() {
      expect(window._gaq[0][0]).to.equal("MyPlayerInstance._setAccount")
      expect(window._gaq[0][1]).to.equal("UA-XXXXX-X")
    })
    it('sets the domain name to gaDomainName value', function() {
      expect(window._gaq[1][0]).to.equal("MyPlayerInstance._setDomainName")
      expect(window._gaq[1][1]).to.equal("some.domain.com")
    })
    it('tracks data with gaTrackerName parameter as trackerName', function() {
      gaControl.push(["Video", "Play", "video.mp4"])
      expect(window._gaq[2][0]).to.equal("MyPlayerInstance._trackEvent")
      expect(window._gaq[2][1]).to.equal("Video")
      expect(window._gaq[2][2]).to.equal("Play")
      expect(window._gaq[2][3]).to.equal("video.mp4")
    })
  })
})
