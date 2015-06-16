// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIContainerPlugin = require('../../base/ui_container_plugin')
var Styler = require('../../base/styler')
var JST = require('../../base/jst')
var Events = require('../../base/events')

class WaterMarkPlugin extends UIContainerPlugin {
  get name() { return 'watermark' }

  constructor(options) {
    super(options)
    this.template = JST[this.name]
    this.position = options.position || "bottom-right"
    if (options.watermark) {
      this.imageUrl = options.watermark
      this.render()
    } else {
      this.$el.remove()
    }
  }

  bindEvents() {
    this.listenTo(this.container, Events.CONTAINER_PLAY, this.onPlay)
    this.listenTo(this.container, Events.CONTAINER_STOP, this.onStop)
  }

  onPlay() {
    if (!this.hidden)
      this.$el.show()
  }

  onStop() {
    this.$el.hide()
  }

  render() {
    this.$el.hide()
    var templateOptions = {position: this.position, imageUrl: this.imageUrl}
    this.$el.html(this.template(templateOptions))
    var style = Styler.getStyleFor(this.name)
    this.container.$el.append(style)
    this.container.$el.append(this.$el)
    return this
  }
}

module.exports = WaterMarkPlugin
