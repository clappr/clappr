// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

class Browser {
}

Browser.isSafari = (!!navigator.userAgent.match(/safari/i) && navigator.userAgent.indexOf('Chrome') === -1)
Browser.isChrome = !!(navigator.userAgent.match(/chrome/i))
Browser.isFirefox = !!(navigator.userAgent.match(/firefox/i))
Browser.isLegacyIE = !!(window.ActiveXObject)
Browser.isIE = Browser.isLegacyIE || !!(navigator.userAgent.match(/trident.*rv:1\d/i))
Browser.isIE11 = !!(navigator.userAgent.match(/trident.*rv:11/i))
Browser.isMobile = !!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|IEMobile|Opera Mini/i.test(navigator.userAgent))
Browser.isWin8App = !!(/MSAppHost/i.test(navigator.userAgent))

module.exports = Browser
