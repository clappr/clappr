import Browser from '../../src/components/browser'

import { getBrowserData, getBrowserInfo, getDevice, getOsData } from '../../src/components/browser/browser'

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

    it('reports correctly operational system data', function() {
      Browser.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36'
      const osData = getOsData()
      expect(osData.name).to.be.equal('Mac OS X Sierra')
      expect(osData.majorVersion).to.be.equal(10)
      expect(osData.minorVersion).to.be.equal(12)
    })

    it('reports correctly browser data', function() {
      Browser.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36'
      const browserData = getBrowserData()
      expect(browserData.group).to.be.equal('Chrome')
      expect(browserData.majorVersion).to.be.equal(66)
      expect(browserData.minorVersion).to.be.equal(0)
      expect(browserData.fullVersion).to.be.equal('66.0.3359.139')
    })

    it('reports correctly device name', function() {
      Browser.userAgent = 'Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Mobile Safari/537.36'
      Browser.isMobile = true
      const device = getDevice()
      expect(device).to.be.equal('Pixel 2 XL Build/OPD1.170816.004')
    })
  })
})
