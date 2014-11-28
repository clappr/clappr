// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('base_object')
var $ = require('jquery')
var Player = require('../player')

class IframePlayer extends BaseObject {
  constructor(options) {
    super(options)
    this.options = options
    this.createIframe()
  }

  createIframe() {
    this.iframe = document.createElement("iframe")
    this.iframe.setAttribute("frameborder", 0)
    this.iframe.setAttribute("id", this.uniqueId)
    this.iframe.setAttribute("allowfullscreen", true)
    this.iframe.setAttribute("scrolling", "no")
    this.iframe.setAttribute("src", "http://cdn.clappr.io/latest/assets/iframe.htm" + this.buildQueryString())
    this.iframe.setAttribute('width', this.options.width)
    this.iframe.setAttribute('height', this.options.height)
  }

  attachTo(element) {
    element.appendChild(this.iframe)
  }

  addEventListeners() {
    this.iframe.contentWindow.addEventListener("fullscreenchange", () => this.updateSize())
    this.iframe.contentWindow.addEventListener("webkitfullscreenchange", () => this.updateSize())
    this.iframe.contentWindow.addEventListener("mozfullscreenchange", () => this.updateSize())
  }

  buildQueryString() {
    var result = ""
    for (var param in this.options) {
        result += !!result? "&" : "?"
        result += encodeURIComponent(param) + "=" + encodeURIComponent(this.options[param])
      }
    return result
  }
}

module.exports = IframePlayer

