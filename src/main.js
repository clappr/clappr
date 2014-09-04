// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('./base/base_object')
var CoreFactory = require('./components/core_factory')
var Loader = require('./components/loader')
var Mediator = require('./components/mediator')


class Player extends BaseObject {
  constructor(options) {
    super(options);
    window.p = this
    options.displayType || (options.displayType = 'pip')
    this.options = options
    this.loader = new Loader(this.options)
    this.coreFactory = new CoreFactory(this, this.loader)
    options.height || (options.height = 360);
    options.width || (options.width = 640);
  }

  attachTo(element) {
    this.options.parentElement = element
    this.core = this.coreFactory.create()
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
    this.core.mediaControl.container.volume(volume);
  }

  mute() {
    this.core.mediaControl.container.volume(0);
  }

  unmute() {
    this.core.mediaControl.container.volume(100);
  }

  isPlaying() {
    return this.core.mediaControl.container.isPlaying();
  }
}


global.DEBUG = false

window.Clappr = { Player: Player, Mediator: Mediator }

module.exports = window.Clappr
