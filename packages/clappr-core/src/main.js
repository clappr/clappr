// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Player from './components/player'
import Utils from './utils'
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
import Log from './components/log'
import HTML5Audio from './playbacks/html5_audio'
import HTML5Video from './playbacks/html5_video'
import HTMLImg from './playbacks/html_img'
import NoOp from './playbacks/no_op'
import Styler from './base/styler'
import template from './base/template'
import Strings from './plugins/strings'
import SourcesPlugin from './plugins/sources'

import $ from 'clappr-zepto'

const version = VERSION

// Built-in Plugins/Playbacks

Loader.registerPlugin(Strings)
Loader.registerPlugin(SourcesPlugin)

Loader.registerPlayback(NoOp)
Loader.registerPlayback(HTMLImg)
Loader.registerPlayback(HTML5Audio)
Loader.registerPlayback(HTML5Video)

export {
  Player,
  Events,
  Browser,
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
  version,
  template,
  $
}

export default {
  Player,
  Events,
  Browser,
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
  version,
  template,
  $
}
