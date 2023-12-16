// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { Events, UIContainerPlugin, template, Styler } from '@clappr/core'

import spinnerHTML from './public/spinner.html'
import spinnerStyle from './public/spinner.scss'

export default class SpinnerThreeBouncePlugin extends UIContainerPlugin {
  get name() { return 'spinner' }
  get supportedVersion() { return { min: CLAPPR_CORE_VERSION } }
  get attributes() {
    return {
      'data-spinner':'',
      'class': 'spinner-three-bounce'
    }
  }

  constructor(container) {
    super(container)
    this.template = template(spinnerHTML)
    this.showTimeout = null
    this.listenTo(this.container, Events.CONTAINER_STATE_BUFFERING, this.onBuffering)
    this.listenTo(this.container, Events.CONTAINER_STATE_BUFFERFULL, this.onBufferFull)
    this.listenTo(this.container, Events.CONTAINER_STOP, this.onStop)
    this.listenTo(this.container, Events.CONTAINER_ENDED, this.onStop)
    this.listenTo(this.container, Events.CONTAINER_ERROR, this.onStop)
    this.render()
  }

  onBuffering() {
    this.show()
  }

  onBufferFull() {
    this.hide()
  }

  onStop() {
    this.hide()
  }

  show() {
    if (this.showTimeout === null)
      this.showTimeout = setTimeout(() => this.$el.show(), 300)

  }

  hide() {
    if (this.showTimeout !== null) {
      clearTimeout(this.showTimeout)
      this.showTimeout = null
    }
    this.$el.hide()
  }

  render() {
    const style = Styler.getStyleFor(spinnerStyle, { baseUrl: this.options.baseUrl })
    this.$el.html(this.template())
    this.$el.append(style[0])
    this.container.$el.append(this.$el)
    this.$el.hide()
    if (this.container.buffering)
      this.onBuffering()

    return this
  }
}
