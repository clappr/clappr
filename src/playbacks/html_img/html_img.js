// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Playback from 'base/playback'
import Styler from 'base/styler'
import imgStyle from './public/style.scss'

export default class HTMLImg extends Playback {
  get name() { return 'html_img' }
  get tagName() { return 'img' }
  get attributes() {
    return {
      'data-html-img': ''
    }
  }

  getPlaybackType() {
    return Playback.NO_OP
  }

  constructor(params) {
    super(params)
    this.el.src = params.src
  }

  render() {
    var style = Styler.getStyleFor(imgStyle)
    this.$el.append(style)
    return this
  }
 }

HTMLImg.canPlay = function(resource) {
  return !!resource.match(/(.*).(png|jpg|jpeg|gif|bmp)/)
}
