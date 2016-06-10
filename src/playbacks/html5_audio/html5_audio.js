// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Events from 'base/events'
import Playback from 'base/playback'
import HTML5Video from 'playbacks/html5_video'

export default class HTML5Audio extends HTML5Video {
  get name() { return 'html5_audio' }
  get tagName() { return 'audio' }

  updateSettings() {
    this.settings.left = ['playpause', 'position', 'duration']
    this.settings.seekEnabled = this.isSeekEnabled()
    this.trigger(Events.PLAYBACK_SETTINGSUPDATE)
  }

  getPlaybackType() {
    return Playback.AOD
  }
}

HTML5Audio.canPlay = function(resourceUrl, mimeType) {
  var mimetypes = {
    'wav': ['audio/wav'],
    'mp3': ['audio/mp3', 'audio/mpeg;codecs="mp3"'],
    'aac': ['audio/mp4;codecs="mp4a.40.5"'],
    'oga': ['audio/ogg']
  }
  return HTML5Video._canPlay('audio', mimetypes, resourceUrl, mimeType)
}
