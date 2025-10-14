import { Container, Playback } from '@clappr/core'

import GoogleAnalytics from './google_analytics'

const FakePlayback = Playback

describe('GoogleAnalytics', function () {
  beforeEach(function () {
    localStorage.clear()
  })

  afterEach(function () {
    jest.restoreAllMocks()
    delete window._gaq
    delete window._gat
  })

  describe('constructor without gaAccount', function () {
    it('no trackerName by default', function () {
      const fakePlayback = new FakePlayback()
      const container = new Container({ playback: fakePlayback })
      const gaControl = new GoogleAnalytics(container)

      expect(gaControl.trackerName).toBeUndefined()
    })
  })

  describe('constructor with gaAccount', function () {
    beforeEach(function () {
      window._gaq = []
    })

    it('trackerName equals to Clappr. by default', function () {
      const fakePlayback = new FakePlayback()
      const container = new Container({ playback: fakePlayback, gaAccount: 'UA-XXXXX-X' })
      const gaControl = new GoogleAnalytics(container)

      expect(gaControl.trackerName).toBe('Clappr.')
    })

    it('tracks data with Clappr. as trackerName', function () {
      const fakePlayback = new FakePlayback()
      const container = new Container({ playback: fakePlayback, gaAccount: 'UA-XXXXX-X' })
      const gaControl = new GoogleAnalytics(container)

      gaControl.push(['Video', 'Play', 'video.mp4'])

      expect(window._gaq[0][0]).toBe('Clappr._trackEvent')
      expect(window._gaq[0][1]).toBe('Video')
      expect(window._gaq[0][2]).toBe('Play')
      expect(window._gaq[0][3]).toBe('video.mp4')
    })
  })

  describe('constructor with gaAccount, gaDomainName and gaTrackerName', function () {
    beforeEach(function () {
      window._gat = {}
      window._gaq = []
    })

    it('trackerName equals to gaTrackerName parameter', function () {
      const fakePlayback = new FakePlayback()
      const options = { playback: fakePlayback, gaAccount: 'UA-XXXXX-X', gaTrackerName: 'MyPlayerInstance', gaDomainName: 'some.domain.com' }
      const container = new Container(options)
      const gaControl = new GoogleAnalytics(container)

      expect(gaControl.trackerName).toBe('MyPlayerInstance.')
    })

    it('sets the account to gaAccount value', function () {
      const fakePlayback = new FakePlayback()
      const options = { playback: fakePlayback, gaAccount: 'UA-XXXXX-X', gaTrackerName: 'MyPlayerInstance', gaDomainName: 'some.domain.com' }
      const container = new Container(options)
      const gaControl = new GoogleAnalytics(container) // eslint-disable-line no-unused-vars

      expect(window._gaq[0][0]).toBe('MyPlayerInstance._setAccount')
      expect(window._gaq[0][1]).toBe('UA-XXXXX-X')
    })

    it('sets the domain name to gaDomainName value', function () {
      const fakePlayback = new FakePlayback()
      const options = { playback: fakePlayback, gaAccount: 'UA-XXXXX-X', gaTrackerName: 'MyPlayerInstance', gaDomainName: 'some.domain.com' }
      const container = new Container(options)
      const gaControl = new GoogleAnalytics(container) // eslint-disable-line no-unused-vars

      expect(window._gaq[1][0]).toBe('MyPlayerInstance._setDomainName')
      expect(window._gaq[1][1]).toBe('some.domain.com')
    })

    it('tracks data with gaTrackerName parameter as trackerName', function () {
      const fakePlayback = new FakePlayback()
      const options = { playback: fakePlayback, gaAccount: 'UA-XXXXX-X', gaTrackerName: 'MyPlayerInstance', gaDomainName: 'some.domain.com' }
      const container = new Container(options)
      const gaControl = new GoogleAnalytics(container)
      gaControl.push(['Video', 'Play', 'video.mp4'])

      expect(window._gaq[2][0]).toBe('MyPlayerInstance._trackEvent')
      expect(window._gaq[2][1]).toBe('Video')
      expect(window._gaq[2][2]).toBe('Play')
      expect(window._gaq[2][3]).toBe('video.mp4')
    })
  })
})
