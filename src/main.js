// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Player from './components/player'
import Utils from './base/utils'
import Events from './base/events'
import Playback from './base/playback'
import ContainerPlugin from './base/container_plugin'
import CorePlugin from './base/core_plugin'
import UICorePlugin from './base/ui_core_plugin'
import UIContainerPlugin from './base/ui_container_plugin'
import BaseObject from './base/base_object'
import UIObject from './base/ui_object'
import Browser from './components/browser'
import Container from './components/container'
import Core from './components/core'
import Loader from './components/loader'
import Mediator from './components/mediator'
import MediaControl from './components/media_control'
import PlayerInfo from './components/player_info'
import Log from './plugins/log'
import Styler from './base/styler'
import Vendor from './vendor'
import template from './base/template'

import HTML5Video from './playbacks/html5_video'
import NoOp from './playbacks/no_op'

import $ from 'clappr-zepto'

const version = VERSION

export default Player

export {
  Player,
  version,
  template,
  Log,
  Vendor,
  Styler,
  $,

  HTML5Video,
  NoOp,

  Mediator,
  Events,
  Browser,
  PlayerInfo,
  MediaControl,
  ContainerPlugin,
  UIContainerPlugin,
  CorePlugin,
  UICorePlugin,
  Playback,
  Container,
  Core,
  Loader,
  BaseObject,
  UIObject,
  Utils
}
