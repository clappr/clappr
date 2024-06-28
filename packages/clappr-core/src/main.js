// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Player from './components/player/player'
import Utils from './utils/utils'
import Events from './base/events/events'
import Playback from './base/playback/playback'
import ContainerPlugin from './base/container_plugin/container_plugin'
import CorePlugin from './base/core_plugin/core_plugin'
import UICorePlugin from './base/ui_core_plugin/ui_core_plugin'
import UIContainerPlugin from './base/ui_container_plugin/ui_container_plugin'
import BaseObject from './base/base_object/base_object'
import UIObject from './base/ui_object/ui_object'
import Browser from './components/browser/browser'
import Container from './components/container/container'
import Core from './components/core/core'
import PlayerError from './components/error/error'
import Loader from './components/loader/loader'
import Log from './components/log/log'
import HTML5Audio from './playbacks/html5_audio/html5_audio'
import HTML5Video from './playbacks/html5_video/html5_video'
import HTMLImg from './playbacks/html_img/html_img'
import NoOp from './playbacks/no_op/no_op'
import Styler from './base/styler/styler'
import template from './base/template'
import Strings from './plugins/strings/strings'
import SourcesPlugin from './plugins/sources/sources'

import $ from 'clappr-zepto'

/** @constant
    @type {string}
    @default
*/
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
