// Copyright 2015 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Playback from '../../base/playback'
import template from '../../base/template'
import Browser from '../../components/browser'

import flashHTML from './public/flash.html'
import './public/flash.scss'

const IE_CLASSID = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000'

export default class BaseFlashPlayback extends Playback {
  get tagName() { return 'object' }
  get swfPath() { return '' }
  get wmode() { return 'transparent' }
  get template() { return template(flashHTML) }
  get attributes() {
    let type = 'application/x-shockwave-flash'

    if (Browser.isLegacyIE)
      type = ''


    return {
      class: 'clappr-flash-playback',
      type: type,
      width: '100%',
      height: '100%',
      data: this.swfPath,
      'data-flash-playback': this.name
    }
  }

  setElement(element) {
    this.$el = element
    this.el = element[0]
  }

  render() {
    this.$el.attr('data', this.swfPath)
    this.$el.html(this.template({
      cid: this.cid,
      swfPath: this.swfPath,
      baseUrl: this.baseUrl,
      playbackId: this.uniqueId,
      wmode: this.wmode,
      callbackName: `window.Clappr.flashlsCallbacks.${this.cid}` })
    )

    if (Browser.isIE) {
      this.$('embed').remove()

      if (Browser.isLegacyIE)
        this.$el.attr('classid', IE_CLASSID)

    }

    this.el.id = this.cid

    return this
  }
}
