// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Events from '../../base/events/events'
import Playback from '../../base/playback/playback'
import HTML5Video from '../html5_video/html5_video'

// TODO: remove this playback and change HTML5Video to HTML5Playback (breaking change, only after 0.3.0)
export default class HTML5Audio extends HTML5Video {
  get name() { return 'html5_audio' }
  get supportedVersion() { return { min: VERSION } }
  get tagName() { return 'audio' }

  get isAudioOnly() {
    return true
  }

  updateSettings() {
    this.settings.left = ['playpause', 'position', 'duration']
    this.settings.seekEnabled = this.isSeekEnabled()
    this.trigger(Events.PLAYBACK_SETTINGSUPDATE)
  }

  getPlaybackType() {
    return Playback.AOD
  }
}

HTML5Audio.canPlay = function (resourceUrl, mimeType) {
  const mimetypes = {
    'wav': ['audio/wav'],
    'mp3': ['audio/mp3', 'audio/mpeg;codecs="mp3"'],
    'aac': ['audio/mp4;codecs="mp4a.40.5"'],
    'oga': ['audio/ogg']
  }
  return HTML5Video._canPlay('audio', mimetypes, resourceUrl, mimeType)
}
