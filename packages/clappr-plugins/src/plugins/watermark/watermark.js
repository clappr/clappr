// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { Events, UIContainerPlugin, template, Styler } from '@clappr/core'

import watermarkHTML from './public/watermark.html'
import watermarkStyle from './public/watermark.scss'

export default class WaterMarkPlugin extends UIContainerPlugin {
  get name() { return 'watermark' }
  get supportedVersion() { return { min: CLAPPR_CORE_VERSION } }
  get template() { return template(watermarkHTML) }

  constructor(container) {
    super(container)
    this.configure()
  }

  bindEvents() {
    this.listenTo(this.container, Events.CONTAINER_PLAY, this.onPlay)
    this.listenTo(this.container, Events.CONTAINER_STOP, this.onStop)
    this.listenTo(this.container, Events.CONTAINER_OPTIONS_CHANGE, this.configure)
  }

  configure() {
    this.position = this.options.position || 'bottom-right'
    if (this.options.watermark) {
      this.imageUrl = this.options.watermark
      this.imageLink = this.options.watermarkLink
      this.render()
    } else { this.$el.remove() }
  }

  onPlay() {
    if (!this.hidden) { this.$el.show() }
  }

  onStop() {
    this.$el.hide()
  }

  render() {
    this.$el.hide()
    const style = Styler.getStyleFor(watermarkStyle, { baseUrl: this.options.baseUrl })
    const templateOptions = { position: this.position, imageUrl: this.imageUrl, imageLink: this.imageLink }
    this.$el.html(this.template(templateOptions))
    this.$el.append(style[0])
    this.container.$el.append(this.$el)
    return this
  }
}
