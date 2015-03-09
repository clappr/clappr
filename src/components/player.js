// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('base_object')
var CoreFactory = require('./core_factory')
var Loader = require('./loader')
var assign = require('lodash.assign')
var PlayerInfo = require('player_info')

class Player extends BaseObject {
  constructor(options) {
    super(options)
    window.p = this
    var defaultOptions = {persistConfig: true, width: 640, height: 360, baseUrl: 'http://cdn.clappr.io/latest'}
    this.options = assign(defaultOptions, options)
    this.options.sources = this.normalizeSources(options)
    this.loader = new Loader(this.options.plugins || {})
    this.coreFactory = new CoreFactory(this, this.loader)
    PlayerInfo.currentSize = {width: options.width, height: options.height}
    if (this.options.parentId) {
      this.setParentId(this.options.parentId)
    }
  }

  setParentId(parentId) {
    var el = document.querySelector(parentId)
    if (el) {
      this.attachTo(el)
    }
  }

  attachTo(element) {
    this.options.parentElement = element
    this.core = this.coreFactory.create()
  }

  is(value, type) {
    return value.constructor === type
  }

  normalizeSources(options) {
    var sources = options.sources || (options.source !== undefined? [options.source.toString()] : [])
    return sources.length === 0 ? ['no.op'] : sources
  }

  resize(size) {
    this.core.resize(size);
  }

  load(sources) {
    this.core.load(sources)
  }

  destroy() {
    this.core.destroy()
  }

  play() {
    this.core.mediaControl.container.play();
  }

  pause() {
    this.core.mediaControl.container.pause();
  }

  stop() {
    this.core.mediaControl.container.stop();
  }

  seek(time) {
    this.core.mediaControl.container.setCurrentTime(time);
  }

  setVolume(volume) {
    this.core.mediaControl.container.setVolume(volume);
  }

  mute() {
    this.core.mediaControl.container.setVolume(0);
  }

  unmute() {
    this.core.mediaControl.container.setVolume(100);
  }

  isPlaying() {
    return this.core.mediaControl.container.isPlaying();
  }

  getContainerPlugin(name) {
    return this.core.mediaControl.container.getPlugin(name)
  }

  getCorePlugin(name) {
    return this.core.getPlugin(name)
  }
}

module.exports = Player

