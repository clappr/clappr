// Copyright 2015 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Playback from 'base/playback'
import Styler from 'base/styler'
import template from 'base/template'
import Browser from 'components/browser'

import $ from 'clappr-zepto'

import flashHTML from './public/flash.html'
import flashStyle from './public/flash.scss'

var IE_CLASSID = "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"

var objectIE = '<object type="application/x-shockwave-flash" id="<%= cid %>" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" data-hls="" width="100%" height="100%"><param name="movie" value="<%= swfPath %>"> <param name="quality" value="autohigh"> <param name="swliveconnect" value="true"> <param name="allowScriptAccess" value="always"> <param name="bgcolor" value="#001122"> <param name="allowFullScreen" value="false"> <param name="wmode" value="transparent"> <param name="tabindex" value="1"> <param name=FlashVars value="playbackId=<%= playbackId %>&callback=<%= callbackName %>" /> </object>'

export default class BaseFlashPlayback extends Playback {
  get tagName() { return 'object' }
  get swfPath() { return '' }
  get wmode() { return 'transparent' }
  get template() { return template(flashHTML) }
  get attributes() {
    return {
      class: 'clappr-flash-playback',
      type: 'application/x-shockwave-flash',
      width: '100%',
      height: '100%',
      'data-flash-playback': this.name
    }
  }

  setElement(element) {
    this.$el = element
    this.el = element[0]
  }

  setupFirefox() {
    var $el = this.$('embed')
    $el.attr('data-flash-playback', this.name)
    $el.addClass(this.attributes.class)
    this.setElement($el)
  }

  render() {
    this.$el.html(this.template({
      cid: this.cid,
      swfPath: this.swfPath,
      baseUrl: this.baseUrl,
      playbackId: this.uniqueId,
      wmode: this.wmode,
      callbackName: `window.Clappr.flashlsCallbacks.${this.cid}`}))
    if (Browser.isIE) {
      this.$('embed').remove()
      if(Browser.isLegacyIE) {
        this.$el.attr('classid', IE_CLASSID)
      }
    } else if (Browser.isFirefox) {
      this.setupFirefox()
    }
    this.el.id = this.cid
    var style = Styler.getStyleFor(flashStyle)
    this.$el.append(style)
    return this
  }
}
