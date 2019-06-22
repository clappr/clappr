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
import PlayerError from './components/error'
import Loader from './components/loader'
import Mediator from './components/mediator'
import PlayerInfo from './components/player_info'
import HTML5Audio from './playbacks/html5_audio'
import HTML5Video from './playbacks/html5_video'
import HTMLImg from './playbacks/html_img'
import Log from './plugins/log'
import Styler from './base/styler'
import Vendor from './vendor'
import template from './base/template'

import $ from 'clappr-zepto'

const version = VERSION

export default {
  Player,
  Mediator,
  Events,
  Browser,
  PlayerInfo,
  ContainerPlugin,
  UIContainerPlugin,
  CorePlugin,
  UICorePlugin,
  Playback,
  Container,
  Core,
  PlayerError,
  Loader,
  BaseObject,
  UIObject,
  Utils,
  HTML5Audio,
  HTML5Video,
  HTMLImg,
  Log,
  Styler,
  Vendor,
  version,
  template,
  $
}
