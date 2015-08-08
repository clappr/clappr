// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Player = require('./components/player')
var Mediator = require('./components/mediator')
var Events = require('./base/events')
var ContainerPlugin = require('./base/container_plugin')
var UIContainerPlugin = require('./base/ui_container_plugin')
var CorePlugin = require('./base/core_plugin')
var UICorePlugin = require('./base/ui_core_plugin')
var Playback = require('./base/playback')
var Utils = require('./base/utils')
var Log = require('./plugins/log')

window.DEBUG = false

var Clappr = {
  Player: Player,
  Mediator: Mediator,
  Events: Events,
  ContainerPlugin: ContainerPlugin,
  UIContainerPlugin: UIContainerPlugin,
  CorePlugin: CorePlugin,
  UICorePlugin: UICorePlugin,
  Playback: Playback,
  Utils: Utils,
  Log: Log,
  version:  "__VERSION__"
}

export {
    Player,
    Mediator,
    Events,
    MediaControl,
    ContainerPlugin,
    UIContainerPlugin,
    CorePlugin,
    UICorePlugin,
    Playback,
    Utils,
    Log,
}

export default Clappr

