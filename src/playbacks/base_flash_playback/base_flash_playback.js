// Copyright 2015 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Playback from 'base/playback'
import template from 'base/template'
import Browser from 'components/browser'

import $ from 'clappr-zepto'

import flashHTML from './public/flash.html'

var IE_CLASSID = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"

var objectIE = '<object type="application/x-shockwave-flash" id="<%= cid %>" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" data-hls="" width="100%" height="100%"><param name="movie" value="<%= swfPath %>"> <param name="quality" value="autohigh"> <param name="swliveconnect" value="true"> <param name="allowScriptAccess" value="always"> <param name="bgcolor" value="#001122"> <param name="allowFullScreen" value="false"> <param name="wmode" value="transparent"> <param name="tabindex" value="1"> <param name=FlashVars value="playbackId=<%= playbackId %>&callback=<%= callbackName %>" /> </object>'

export default class BaseFlashPlayback extends Playback {
  get tagName() { return 'object' }
  get template() { return template(flashHTML) }
  get attributes() {
    return {
      'type': 'application/x-shockwave-flash',
      'width': '100%',
      'height': '100%'
    }
  }

  setElement(element) {
    this.$el = element
    this.el = element[0]
  }

  setupFirefox() {
    var $el = this.$('embed')
    $el.attr('data-hls', '')
    this.setElement($el)
  }

  setupIE(swfPath) {
    this.setElement($(template(objectIE)({cid: this.cid, swfPath: swfPath, baseUrl: this.baseUrl, playbackId: this.uniqueId, callbackName: `window.Clappr.flashlsCallbacks.${this.cid}`})))
    if (this.attributes.class) {
      this.$el.addClass(this.attributes.class)
    }
  }

  renderFlashElement(swfPath) {
    if(Browser.isLegacyIE) {
      this.setupIE(swfPath)
    } else {
      this.$el.html(this.template({cid: this.cid, swfPath: swfPath, baseUrl: this.baseUrl, playbackId: this.uniqueId, callbackName: `window.Clappr.flashlsCallbacks.${this.cid}`}))
      if(Browser.isFirefox) {
        this.setupFirefox()
      } else if (Browser.isIE) {
        this.$('embed').remove()
      }
    }
    this.el.id = this.cid
  }
}
