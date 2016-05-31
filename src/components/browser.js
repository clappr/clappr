// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
import mocks from 'base/mocks'


var hasLocalstorage = function(){
  try {
    mocks.window.localStorage.setItem('clappr', 'clappr')
    mocks.window.localStorage.removeItem('clappr')
    return true
  } catch(e) {
    return false
  }
}

var hasFlash = function() {
  try {
    var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
    return !!fo;
  } catch (e) {
    return !!(mocks.window.navigator.mimeTypes && mocks.window.navigator.mimeTypes['application/x-shockwave-flash'] !== undefined &&
        mocks.window.navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin);
  }
}


var browserInfo = null;

var getBrowserInfo = function() {
  if (browserInfo) {
    return browserInfo
  }
  browserInfo = (() => {
    var ua = mocks.window.navigator.userAgent
    var parts = ua.match(/\b(playstation 4|nx|opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
    var extra
    if (/trident/i.test(parts[1])) {
      extra = /\brv[ :]+(\d+)/g.exec(ua) || []
      return { name: 'IE', version: parseInt(extra[1] || '') }
    } else if (parts[1] === 'Chrome' ) {
      extra = ua.match(/\bOPR\/(\d+)/)
      if (extra != null) {
        return { name:'Opera', version: parseInt(extra[1]) }
      }
    }
    parts = parts[2] ? [parts[1], parts[2]] : [mocks.window.navigator.appName, mocks.window.navigator.appVersion, '-?']

    if ((extra = ua.match(/version\/(\d+)/i))) {
      parts.splice(1, 1, extra[1])
    }
    return { name: parts[0], version: parseInt(parts[1]) }
  })()
  return browserInfo
}


var Browser = {
  get isSafari() {return /safari/i.test(mocks.window.navigator.userAgent) && mocks.window.navigator.userAgent.indexOf('Chrome') === -1},
  get isChrome() {return /chrome/i.test(mocks.window.navigator.userAgent)},
  get isFirefox() {return /firefox/i.test(mocks.window.navigator.userAgent)},
  get isLegacyIE() {return !!(mocks.window.ActiveXObject)},
  get isIE() {return Browser.isLegacyIE || /trident.*rv:1\d/i.test(mocks.window.navigator.userAgent)},
  get isIE11() {return /trident.*rv:11/i.test(mocks.window.navigator.userAgent)},
  get isChromecast() {return Browser.isChrome && /CrKey/i.test(mocks.window.navigator.userAgent)},
  get isMobile() {return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|IEMobile|Opera Mini/i.test(mocks.window.navigator.userAgent)},
  get isiOS() {return /iPad|iPhone|iPod/i.test(mocks.window.navigator.userAgent)},
  get isAndroid() {return /Android/i.test(mocks.window.navigator.userAgent)},
  get isWindowsPhone() {return /Windows Phone/i.test(mocks.window.navigator.userAgent)},
  get isWin8App() {return /MSAppHost/i.test(mocks.window.navigator.userAgent)},
  get isWiiU() {return /WiiU/i.test(mocks.window.navigator.userAgent)},
  get isPS4() {return /PlayStation 4/i.test(mocks.window.navigator.userAgent)},
  get hasLocalstorage() {return hasLocalstorage()},
  get hasFlash() {return hasFlash()},
  get name() {return getBrowserInfo().name},
  get version() {return getBrowserInfo().version}
}

export default Browser
