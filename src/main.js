// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Player from './components/player'
import Utils from './base/utils'
import Events from './base/events'
import Playback from './base/playback'
import Mediator from './components/mediator'
import MediaControl from './components/media_control'
import ContainerPlugin from './base/container_plugin'
import CorePlugin from './base/core_plugin'
import UICorePlugin from './base/ui_core_plugin'
import UIContainerPlugin from './base/ui_container_plugin'
import Log from './plugins/log'

window.DEBUG = false

var Clappr = {
  Player: Player,
  Mediator: Mediator,
  Events: Events,
  MediaControl: MediaControl,
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

