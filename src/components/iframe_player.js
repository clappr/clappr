// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('base_object')
var $ = require('jquery')

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
    this.iframe.setAttribute("src", this.createBlob())
  }

  insertPlayer() {
    $('#' + this.uniqueId).css({width: this.options.width, height: this.options.height})
    $('#' + this.uniqueId).ready(function () {
      this.iframe.contentWindow.addEventListener("fullscreenchange", () => this.updateSize())
      this.iframe.contentWindow.addEventListener("webkitfullscreenchange", () => this.updateSize())
      this.iframe.contentWindow.addEventListener("mozfullscreenchange", () => this.updateSize())
    }.bind(this))
  }

  getIframeContent() {
    return '<style>body { margin: 0 }</style>' +
    '<div id="wrapper" style="border: 0px;border-radius: 0px;width: 100%;height: 100%"></div>' +
    '<scr' + 'ipt>' + 
        'window.player = new parent.Clappr.Player('+ JSON.stringify(this.options) + ');' +
        'window.player.attachTo(document.getElementById("wrapper"));' +
    '</scr' + 'ipt>'
  }

  createBlob() {
    var blob
    try {
      blob = new Blob([this.getIframeContent()], {type: 'text/html'})
    } catch (e) {
      window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder
      blob = new BlobBuilder()
      blob.append(this.getIframeContent())
      blob = blob.getBlob()
    }
    return URL.createObjectURL(blob)
  }

  attachTo(element) {
    element.appendChild(this.iframe)
    this.insertPlayer()
  }

  updateSize() {
    var doc = this.iframe.contentDocument
    window.iframeFullScreen = doc.webkitIsFullScreen || doc.mozFullScreen || !!doc.msFullscreenElement
    this.iframe.contentWindow.player.core.updateSize()
  }
}

module.exports = IframePlayer

