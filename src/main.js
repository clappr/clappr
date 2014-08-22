// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('./base/base_object')
var CoreFactory = require('./components/core_factory')
var Loader = require('./components/loader')
var Mediator = require('./components/mediator')


class Player extends BaseObject {
  initialize(params) {
    window.p = this
    params.displayType || (params.displayType = 'pip')
    this.params = params
    this.loader = new Loader(this.params)
    this.coreFactory = new CoreFactory(this, this.loader)
  }

  attachTo(element) {
    this.params.parentElement = element
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

window.WP3 = { Player: Player, Mediator: Mediator }

module.exports = window.WP3
