// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Playback from 'base/playback'
import Events from 'base/events'
import find from 'lodash.find'
import HTML5Video from 'playbacks/html5_video'

export default class HTML5Audio extends HTML5Video {
  get name() { return 'html5_audio' }
  get tagName() { return 'audio' }

  durationChange() {
    this.settings.left = ["playpause", "position", "duration"]
    this.settings.seekEnabled = this.isSeekEnabled()
    this.trigger(Events.PLAYBACK_SETTINGSUPDATE)
  }
  
  getPlaybackType() {
    return 'aod'
  }

  stalled() {
    if (this.el.readyState < this.el.HAVE_FUTURE_DATA) {
      this.trigger(Events.PLAYBACK_BUFFERING, this.name)
    }
  }

  timeUpdated() {
    this.trigger(Events.PLAYBACK_TIMEUPDATE, this.el.currentTime, this.el.duration, this.name)
  }
}

HTML5Audio.canPlay = function(resource, mimeType) {
  var mimetypes = {
    'wav': ['audio/wav'],
    'mp3': ['audio/mp3', 'audio/mpeg;codecs="mp3"'],
    'aac': ['audio/mp4;codecs="mp4a.40.5"'],
    'oga': ['audio/ogg']
  }
  var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || []
  if ((resourceParts.length > 1) && (mimetypes[resourceParts[1]] !== undefined)) {
    var a = document.createElement('audio')
    return !!find(mimetypes[resourceParts[1]], (ext) => { return !!a.canPlayType(ext).replace(/no/, '') })
  } else if (mimeType && !/m3u8/.test(resourceParts[1])) {
    var a = document.createElement('audio')
    return !!a.canPlayType(mimeType).replace(/no/, '')
  }
  return false
}
