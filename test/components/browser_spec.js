import Browser from '../../src/components/browser'

import {getBrowserInfo} from '../../src/components/browser'

describe('Browser', function() {
  it('checks localstorage support', function() {
    expect(Browser.hasLocalstorage).to.be.equal(true)
  })

  describe('environment information', function() {
    it('reports correctly Android WebView (prior to KitKat)', function() {
      const userAgent = 'Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30'
      const browserInfo = getBrowserInfo(userAgent)
      expect(browserInfo.name).to.be.equal('Android WebView')
      expect(browserInfo.version).to.be.equal(4)
    })

    it('reports correctly Android Chrome WebView (KitKat to Lollipop)', function() {
      const userAgent = 'Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/_BuildID_) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36'
      const browserInfo = getBrowserInfo(userAgent)
      expect(browserInfo.name).to.be.equal('Chrome')
      expect(browserInfo.version).to.be.equal(30)
    })

    it('reports correctly Android Chrome WebView (Lollipop and Above)', function() {
      const userAgent = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36'
      const browserInfo = getBrowserInfo(userAgent)
      expect(browserInfo.name).to.be.equal('Chrome')
      expect(browserInfo.version).to.be.equal(43)
    })
  })
})
