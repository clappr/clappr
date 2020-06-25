import Browser from './browser'

import { getBrowserData, getBrowserInfo, getDevice, getOsData } from './browser'

describe('Browser', function() {
  test('checks localstorage support', () => {
    expect(Browser.hasLocalstorage).toEqual(true)
  })

  describe('environment information', () => {
    test('reports correctly Android WebView (prior to KitKat)', () => {
      const userAgent = 'Mozilla/5.0 (Linux; U; Android 4.1.1; en-gb; Build/KLP) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30'
      const browserInfo = getBrowserInfo(userAgent)
      expect(browserInfo.name).toEqual('Android WebView')
      expect(browserInfo.version).toEqual(4)
    })

    test('reports correctly Android Chrome WebView (KitKat to Lollipop)', () => {
      const userAgent = 'Mozilla/5.0 (Linux; Android 4.4; Nexus 5 Build/_BuildID_) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36'
      const browserInfo = getBrowserInfo(userAgent)
      expect(browserInfo.name).toEqual('Chrome')
      expect(browserInfo.version).toEqual(30)
    })

    test('reports correctly Android Chrome WebView (Lollipop and Above)', () => {
      const userAgent = 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36'
      const browserInfo = getBrowserInfo(userAgent)
      expect(browserInfo.name).toEqual('Chrome')
      expect(browserInfo.version).toEqual(43)
    })

    test('reports correctly operational system data', () => {
      Browser.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36'
      const osData = getOsData()
      expect(osData.name).toEqual('Mac OS X Sierra')
      expect(osData.majorVersion).toEqual(10)
      expect(osData.minorVersion).toEqual(12)
    })

    test('reports correctly browser data', () => {
      Browser.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36'
      const browserData = getBrowserData()
      expect(browserData.group).toEqual('Chrome')
      expect(browserData.majorVersion).toEqual(66)
      expect(browserData.minorVersion).toEqual(0)
      expect(browserData.fullVersion).toEqual('66.0.3359.139')
    })

    describe('device', () => {
      test('reports correctly android devices', () => {
        const userAgent = 'Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Mobile Safari/537.36'
        const device = getDevice(userAgent)
        expect(device).toEqual('Pixel 2 XL Build/OPD1.170816.004')
      })

      test('reports correctly iPhone devices', function () {
        const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
        const device = getDevice(userAgent)
        expect(device).toEqual('iPhone')
      })

      test('reports full platform string if no separator is found', function () {
        const userAgent = 'Mozilla/5.0 (CrKey armv7l 1.5.16041) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.0 Safari/537.36'
        const device = getDevice(userAgent)
        expect(device).toEqual('CrKey armv7l 1.5.16041')
      })

      test('reports empty string for missing platform detail', () => {
        const userAgent = 'AppleTV6,2/11.1'
        const device = getDevice(userAgent)
        expect(device).toEqual('')
      })
    })
  })
})
