// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Playback = require('../../base/playback')
var Styler = require('../../base/styler')

class HTMLImg extends Playback {
  get name() { return 'html_img' }
  get tagName() { return 'img' }
  get attributes() {
    return {
      'data-html-img': ''
    }
  }

  getPlaybackType() {
    return null
  }

  constructor(params) {
    super(params)
    this.el.src = params.src
  }

  render() {
    var style = Styler.getStyleFor(this.name)
    this.$el.append(style)
    return this
  }
 }

HTMLImg.canPlay = function(resource) {
  return !!resource.match(/(.*).(png|jpg|jpeg|gif|bmp)/)
}

module.exports = HTMLImg
