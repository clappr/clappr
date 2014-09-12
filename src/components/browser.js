// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

class Browser {
}

Browser.isSafari = (!!navigator.userAgent.match(/safari/i) && navigator.userAgent.indexOf('Chrome') === -1)
Browser.isChrome = !!(navigator.userAgent.match(/chrome/i))
Browser.isFirefox = !!(navigator.userAgent.match(/firefox/i))
Browser.isLegacyIE = !!(window.ActiveXObject)
Browser.isMobile = !!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
Browser.isWin8App = !!(/MSAppHost/i.test(navigator.userAgent))


module.exports = Browser
