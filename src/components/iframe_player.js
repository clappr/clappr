// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('base_object')
var $ = require('jquery')
var Player = require('./player')

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
    this.iframe.setAttribute("src", "about:blank")
    this.iframe.setAttribute('width', this.options.width)
    this.iframe.setAttribute('height', this.options.height)
  }

  getIframeContent() {
    return '<style>body {margin:0}</style>' +
      '<div id="wrapper" style="border: 0px;border-radius: 0px;width: 100%;height: 100%"></div>'
  }

  attachTo(element) {
    element.appendChild(this.iframe)
    $('iframe#' + this.uniqueId).ready(function () {
      this.iframe.contentDocument.body.innerHTML = this.getIframeContent()
      var wrapper = this.iframe.contentDocument.getElementById('wrapper')
      this.player = new Player(this.options)
      this.player.attachTo(wrapper)
      this.addEventListeners()
    }.bind(this))
  }

  addEventListeners() {
    this.iframe.contentWindow.addEventListener("fullscreenchange", () => this.updateSize())
    this.iframe.contentWindow.addEventListener("webkitfullscreenchange", () => this.updateSize())
    this.iframe.contentWindow.addEventListener("mozfullscreenchange", () => this.updateSize())
  }

  updateSize() {
    var doc = this.iframe.contentDocument
    window.iframeFullScreen = doc.webkitIsFullScreen || doc.mozFullScreen || !!doc.msFullscreenElement
    this.iframe.contentWindow.player.core.updateSize()
  }
}

module.exports = IframePlayer

