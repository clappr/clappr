// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Log from 'plugins/log'
import {uniqueId} from './utils'
import execOnce from 'lodash.once'

var slice = Array.prototype.slice

var eventSplitter = /\s+/

var eventsApi = function(obj, action, name, rest) {
  if (!name) {return true}

  // Handle event maps.
  if (typeof name === 'object') {
    for (var key in name) {
      obj[action].apply(obj, [key, name[key]].concat(rest))
    }
    return false
  }

  // Handle space separated event names.
  if (eventSplitter.test(name)) {
    var names = name.split(eventSplitter)
    for (var i = 0, l = names.length; i < l; i++) {
      obj[action].apply(obj, [names[i]].concat(rest))
    }
    return false
  }

  return true
}

var triggerEvents = function(events, args) {
  var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2]
  switch (args.length) {
  case 0: while (++i < l) { (ev = events[i]).callback.call(ev.ctx) } return
  case 1: while (++i < l) { (ev = events[i]).callback.call(ev.ctx, a1) } return
  case 2: while (++i < l) { (ev = events[i]).callback.call(ev.ctx, a1, a2) } return
  case 3: while (++i < l) { (ev = events[i]).callback.call(ev.ctx, a1, a2, a3) } return
  default: while (++i < l) { (ev = events[i]).callback.apply(ev.ctx, args) } return
  }
}

/**
 * @class Events
 * @constructor
 * @module base
 */
export default class Events {
  /**
   * listen to an event indefinitely, if you want to stop you need to call `off`
   * @method on
   * @param {String} name
   * @param {Function} callback
   * @param {Object} context
   */
  on(name, callback, context) {
    if (!eventsApi(this, 'on', name, [callback, context]) || !callback) {return this}
    this._events || (this._events = {})
    var events = this._events[name] || (this._events[name] = [])
    events.push({callback: callback, context: context, ctx: context || this})
    return this
  }

  /**
   * listen to an event only once
   * @method once
   * @param {String} name
   * @param {Function} callback
   * @param {Object} context
   */
  once(name, callback, context) {
    if (!eventsApi(this, 'once', name, [callback, context]) || !callback) {return this}
    var self = this
    var once = execOnce(function() {
      self.off(name, once)
      callback.apply(this, arguments)
    })
    once._callback = callback
    return this.on(name, once, context)
  }

  /**
   * stop listening to an event
   * @method off
   * @param {String} name
   * @param {Function} callback
   * @param {Object} context
   */
  off(name, callback, context) {
    var retain, ev, events, names, i, l, j, k
    if (!this._events || !eventsApi(this, 'off', name, [callback, context])) {return this}
    if (!name && !callback && !context) {
      this._events = void 0
      return this
    }
    names = name ? [name] : Object.keys(this._events)
    // jshint maxdepth:5
    for (i = 0, l = names.length; i < l; i++) {
      name = names[i]
      events = this._events[name]
      if (events) {
        this._events[name] = retain = []
        if (callback || context) {
          for (j = 0, k = events.length; j < k; j++) {
            ev = events[j]
            if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                (context && context !== ev.context)) {
              retain.push(ev)
            }
          }
        }
        if (!retain.length) {delete this._events[name]}
      }
    }
    return this
  }

  /**
   * triggers an event given its `name`
   * @method trigger
   * @param {String} name
   */
  trigger(name) {
    var klass = this.name || this.constructor.name
    try {
      Log.debug.apply(Log, [klass].concat(Array.prototype.slice.call(arguments)))
      if (!this._events) {return this}
      var args = slice.call(arguments, 1)
      if (!eventsApi(this, 'trigger', name, args)) {return this}
      var events = this._events[name]
      var allEvents = this._events.all
      if (events) {triggerEvents(events, args)}
      if (allEvents) {triggerEvents(allEvents, arguments)}
    } catch (exception) {
      Log.error.apply(Log, [klass, 'error on event', name, 'trigger','-', exception])
    }
    return this
  }

  /**
   * stop listening an event for a given object
   * @method stopListening
   * @param {Object} obj
   * @param {String} name
   * @param {Function} callback
   */
  stopListening(obj, name, callback) {
    var listeningTo = this._listeningTo
    if (!listeningTo) {return this}
    var remove = !name && !callback
    if (!callback && typeof name === 'object') {callback = this}
    if (obj) {(listeningTo = {})[obj._listenId] = obj}
    for (var id in listeningTo) {
      obj = listeningTo[id]
      obj.off(name, callback, this)
      if (remove || Object.keys(obj._events).length === 0) {delete this._listeningTo[id]}
    }
    return this
  }
}


/**
 * listen to an event indefinitely for a given `obj`
 * @method listenTo
 * @param {Object} obj
 * @param {String} name
 * @param {Function} callback
 * @param {Object} context
 * @example
 * ```javascript
 * this.listenTo(this.core.playback, Events.PLAYBACK_PAUSE, this.callback)
 * ```
 */
/**
 * listen to an event once for a given `obj`
 * @method listenToOnce
 * @param {Object} obj
 * @param {String} name
 * @param {Function} callback
 * @param {Object} context
 * @example
 * ```javascript
 * this.listenToOnce(this.core.playback, Events.PLAYBACK_PAUSE, this.callback)
 * ```
 */
var listenMethods = {listenTo: 'on', listenToOnce: 'once'}

Object.keys(listenMethods).forEach(function(method) {
  Events.prototype[method] = function(obj, name, callback) {
    var listeningTo = this._listeningTo || (this._listeningTo = {})
    var id = obj._listenId || (obj._listenId = uniqueId('l'))
    listeningTo[id] = obj
    if (!callback && typeof name === 'object') {callback = this}
    obj[listenMethods[method]](name, callback, this)
    return this
  }
})

// PLAYER EVENTS
/**
 * Fired when the player is ready on startup
 *
 * @event PLAYER_READY
 */
Events.PLAYER_READY = 'ready'
/**
 * Fired when player resizes
 *
 * @event PLAYER_RESIZE
 * @param {Object} currentSize an object with the current size
 */
Events.PLAYER_RESIZE = 'resize'
/**
 * Fired when player changes its fullscreen state
 *
 * @event PLAYER_FULLSCREEN
 * @param {Boolean} whether or not the player is on fullscreen mode
 */
Events.PLAYER_FULLSCREEN = 'fullscreen'
/**
 * Fired when player starts to play
 *
 * @event PLAYER_PLAY
 */
Events.PLAYER_PLAY = 'play'
/**
 * Fired when player pauses
 *
 * @event PLAYER_PAUSE
 */
Events.PLAYER_PAUSE = 'pause'
/**
 * Fired when player stops
 *
 * @event PLAYER_STOP
 */
Events.PLAYER_STOP = 'stop'
/**
 * Fired when player ends the video
 *
 * @event PLAYER_ENDED
 */
Events.PLAYER_ENDED = 'ended'
/**
 * Fired when player seeks the video
 *
 * @event PLAYER_SEEK
 * @param {Number} time the current time in seconds
 */
Events.PLAYER_SEEK = 'seek'
/**
 * Fired when player receives an error
 *
 * @event PLAYER_ERROR
 * @param {Object} error the error
 */
Events.PLAYER_ERROR = 'error'
/**
 * Fired when the time is updated on player
 *
 * @event PLAYER_TIMEUPDATE
 * @param {Object} progress Data
 * progress object
 * @param {Number} [progress.current]
 * current time
 * @param {Number} [progress.total]
 * total time
 */
Events.PLAYER_TIMEUPDATE = 'timeupdate'
/**
 * Fired when player updates its volume
 *
 * @event PLAYER_VOLUMEUPDATE
 * @param {Number} volume the current volume
 */
Events.PLAYER_VOLUMEUPDATE = 'volumeupdate'

// Playback Events
/**
 * Fired when the playback is downloading the media
 *
 * @event PLAYBACK_PROGRESS
 * @param {Object} progress Data
 * progress object
 * @param {Number} [progress.start]
 * initial downloaded content
 * @param {Number} [progress.current]
 * current dowloaded content
 * @param {Number} [progress.total]
 * total content to be downloaded
 */
Events.PLAYBACK_PROGRESS = 'playback:progress'
/**
 * Fired when the time is updated on playback
 *
 * @event PLAYBACK_TIMEUPDATE
 * @param {Object} progress Data
 * progress object
 * @param {Number} [progress.current]
 * current time
 * @param {Number} [progress.total]
 * total time
 */
Events.PLAYBACK_TIMEUPDATE = 'playback:timeupdate'
/**
 * Fired when playback is ready
 *
 * @event PLAYBACK_READY
 */
Events.PLAYBACK_READY = 'playback:ready'
/**
 * Fired when the playback starts having to buffer because
 * playback can currently not be smooth.
 *
 * This corresponds to the playback `buffering` property being
 * `true`.
 *
 * @event PLAYBACK_BUFFERING
 */
Events.PLAYBACK_BUFFERING = 'playback:buffering'
/**
 * Fired when the playback has enough in the buffer to be
 * able to play smoothly, after previously being unable to
 * do this.
 *
 * This corresponds to the playback `buffering` property being
 * `false`.
 *
 * @event PLAYBACK_BUFFERFULL
 */
Events.PLAYBACK_BUFFERFULL = 'playback:bufferfull'
/**
 * Fired when playback changes any settings (volume, seek and etc)
 *
 * @event PLAYBACK_SETTINGSUPDATE
 */
Events.PLAYBACK_SETTINGSUPDATE = 'playback:settingsupdate'
/**
 * Fired when playback loaded its metadata
 *
 * @event PLAYBACK_LOADEDMETADATA
 * @param {Object} metadata Data
 * settings object
 * @param {Number} [metadata.duration]
 * the playback duration
 * @param {Object} [metadata.data]
 * extra meta data
 */
Events.PLAYBACK_LOADEDMETADATA = 'playback:loadedmetadata'
/**
 * Fired when playback updates its video quality
 *
 * @event PLAYBACK_HIGHDEFINITIONUPDATE
 * @param {Boolean} isHD
 * true when is on HD, false otherwise
 */
Events.PLAYBACK_HIGHDEFINITIONUPDATE = 'playback:highdefinitionupdate'
/**
 * Fired when playback updates its bitrate
 *
 * @event PLAYBACK_BITRATE
 * @param {Object} bitrate Data
 * bitrate object
 * @param {Number} [bitrate.bandwidth]
 * bitrate bandwidth when it's available
 * @param {Number} [bitrate.width]
 * playback width (ex: 720, 640, 1080)
 * @param {Number} [bitrate.height]
 * playback height (ex: 240, 480, 720)
 * @param {Number} [bitrate.level]
 * playback level when it's available, it could be just a map for width (0 => 240, 1 => 480, 2 => 720)
 */
Events.PLAYBACK_BITRATE = 'playback:bitrate'
/**
 * Fired when the playback has its levels
 *
 * @event PLAYBACK_LEVELS_AVAILABLE
 * @param {Array} levels
 * the ordered levels, each one with the following format `{id: 1, label: '500kbps'}` ps: id should be a number >= 0
 * @param {Number} initial
 * the initial level otherwise -1 (AUTO)
 */
Events.PLAYBACK_LEVELS_AVAILABLE = 'playback:levels:available'
/**
 * Fired when the playback starts to switch level
 *
 * @event PLAYBACK_LEVEL_SWITCH_START
 *
 */
Events.PLAYBACK_LEVEL_SWITCH_START = 'playback:levels:switch:start'
/**
 * Fired when the playback ends the level switch
 *
 * @event PLAYBACK_LEVEL_SWITCH_END
 *
 */
Events.PLAYBACK_LEVEL_SWITCH_END = 'playback:levels:switch:end'

/**
 * Fired when playback internal state changes
 *
 * @event PLAYBACK_PLAYBACKSTATE
 * @param {Object} state Data
 * state object
 * @param {String} [state.type]
 * the playback type
 */
Events.PLAYBACK_PLAYBACKSTATE = 'playback:playbackstate'
/**
 * Fired when DVR becomes enabled/disabled.
 *
 * @event PLAYBACK_DVR
 * @param {boolean} state true if dvr enabled
 */
Events.PLAYBACK_DVR = 'playback:dvr'
// TODO doc
Events.PLAYBACK_MEDIACONTROL_DISABLE = 'playback:mediacontrol:disable'
// TODO doc
Events.PLAYBACK_MEDIACONTROL_ENABLE = 'playback:mediacontrol:enable'
/**
 * Fired when the media for a playback ends.
 *
 * @event PLAYBACK_ENDED
 * @param {String} name the name of the playback
 */
Events.PLAYBACK_ENDED = 'playback:ended'
/**
 * Fired when user requests `play()`
 *
 * @event PLAYBACK_PLAY_INTENT
 */
Events.PLAYBACK_PLAY_INTENT = 'playback:play:intent'
/**
 * Fired when the media for a playback starts playing.
 * This is not necessarily when the user requests `play()`
 * The media may have to buffer first.
 * I.e. `isPlaying()` might return `true` before this event is fired,
 * because `isPlaying()` represents the intended state.
 *
 * @event PLAYBACK_PLAY
 */
Events.PLAYBACK_PLAY = 'playback:play'
/**
 * Fired when the media for a playback pauses.
 *
 * @event PLAYBACK_PAUSE
 */
Events.PLAYBACK_PAUSE = 'playback:pause'
/**
 * Fired when the media for a playback is stopped.
 *
 * @event PLAYBACK_STOP
 */
Events.PLAYBACK_STOP = 'playback:stop'
/**
 * Fired if an error occurs in the playback.
 *
 * @event PLAYBACK_ERROR
 * @param {Object} error An object containing the error details
 * @param {String} name Playback name
 */
Events.PLAYBACK_ERROR = 'playback:error'
// TODO doc
Events.PLAYBACK_STATS_ADD = 'playback:stats:add'
// TODO doc
Events.PLAYBACK_FRAGMENT_LOADED = 'playback:fragment:loaded'
// TODO doc
Events.PLAYBACK_LEVEL_SWITCH = 'playback:level:switch'

/**
 * Fired when the options were changed for the core
 *
 * @event CORE_OPTIONS_CHANGE
 */
Events.CORE_OPTIONS_CHANGE = 'core:options:change'
/**
 * Fired after creating containers, when the core is ready
 *
 * @event CORE_READY
 */
Events.CORE_READY = 'core:ready'
/**
 * Fired when the fullscreen state change
 *
 * @param {Boolean} whether or not the player is on fullscreen mode
 * @event CORE_READY
 */
Events.CORE_FULLSCREEN = 'core:fullscreen'

// Container Events
/**
 * Fired when the container internal state changes
 *
 * @event CONTAINER_PLAYBACKSTATE
 * @param {Object} state Data
 * state object
 * @param {String} [state.type]
 * the playback type
 */
Events.CONTAINER_PLAYBACKSTATE = 'container:playbackstate'
Events.CONTAINER_PLAYBACKDVRSTATECHANGED = 'container:dvr'
/**
 * Fired when the container updates its bitrate
 *
 * @event CONTAINER_BITRATE
 * @param {Object} bitrate Data
 * bitrate object
 * @param {Number} [bitrate.bandwidth]
 * bitrate bandwidth when it's available
 * @param {Number} [bitrate.width]
 * playback width (ex: 720, 640, 1080)
 * @param {Number} [bitrate.height]
 * playback height (ex: 240, 480, 720)
 * @param {Number} [bitrate.level]
 * playback level when it's available, it could be just a map for width (0 => 240, 1 => 480, 2 => 720)
 */
Events.CONTAINER_BITRATE = 'container:bitrate'
Events.CONTAINER_STATS_REPORT = 'container:stats:report'
Events.CONTAINER_DESTROYED = 'container:destroyed'
/**
 * Fired when the container is ready
 *
 * @event CONTAINER_READY
 */
Events.CONTAINER_READY = 'container:ready'
Events.CONTAINER_ERROR = 'container:error'
/**
 * Fired when the container loaded its metadata
 *
 * @event CONTAINER_LOADEDMETADATA
 * @param {Object} metadata Data
 * settings object
 * @param {Number} [metadata.duration]
 * the playback duration
 * @param {Object} [metadata.data]
 * extra meta data
 */
Events.CONTAINER_LOADEDMETADATA = 'container:loadedmetadata'
/**
 * Fired when the time is updated on container
 *
 * @event CONTAINER_TIMEUPDATE
 * @param {Object} progress Data
 * progress object
 * @param {Number} [progress.current]
 * current time
 * @param {Number} [progress.total]
 * total time
 */
Events.CONTAINER_TIMEUPDATE = 'container:timeupdate'
/**
 * Fired when the container is downloading the media
 *
 * @event CONTAINER_PROGRESS
 * @param {Object} progress Data
 * progress object
 * @param {Number} [progress.start]
 * initial downloaded content
 * @param {Number} [progress.current]
 * current dowloaded content
 * @param {Number} [progress.total]
 * total content to be downloaded
 */
Events.CONTAINER_PROGRESS = 'container:progress'
Events.CONTAINER_PLAY = 'container:play'
Events.CONTAINER_STOP = 'container:stop'
Events.CONTAINER_PAUSE = 'container:pause'
Events.CONTAINER_ENDED = 'container:ended'
Events.CONTAINER_CLICK = 'container:click'
Events.CONTAINER_DBLCLICK = 'container:dblclick'
Events.CONTAINER_CONTEXTMENU = 'container:contextmenu'
Events.CONTAINER_MOUSE_ENTER = 'container:mouseenter'
Events.CONTAINER_MOUSE_LEAVE = 'container:mouseleave'
/**
 * Fired when the container seeks the video
 *
 * @event CONTAINER_SEEK
 * @param {Number} time the current time in seconds
 */
Events.CONTAINER_SEEK = 'container:seek'
Events.CONTAINER_VOLUME = 'container:volume'
Events.CONTAINER_FULLSCREEN = 'container:fullscreen'
/**
 * Fired when container is buffering
 *
 * @event CONTAINER_STATE_BUFFERING
 */
Events.CONTAINER_STATE_BUFFERING = 'container:state:buffering'
/**
 * Fired when the container filled the buffer
 *
 * @event CONTAINER_STATE_BUFFERFULL
 */
Events.CONTAINER_STATE_BUFFERFULL = 'container:state:bufferfull'
/**
 * Fired when the container changes any settings (volume, seek and etc)
 *
 * @event CONTAINER_SETTINGSUPDATE
 */
Events.CONTAINER_SETTINGSUPDATE = 'container:settingsupdate'
/**
 * Fired when container updates its video quality
 *
 * @event CONTAINER_HIGHDEFINITIONUPDATE
 * @param {Boolean} isHD
 * true when is on HD, false otherwise
 */
Events.CONTAINER_HIGHDEFINITIONUPDATE = 'container:highdefinitionupdate'

/**
 * Fired when the media control shows
 *
 * @event CONTAINER_MEDIACONTROL_SHOW
 */
Events.CONTAINER_MEDIACONTROL_SHOW = 'container:mediacontrol:show'
/**
 * Fired when the media control hides
 *
 * @event CONTAINER_MEDIACONTROL_HIDE
 */
Events.CONTAINER_MEDIACONTROL_HIDE = 'container:mediacontrol:hide'

Events.CONTAINER_MEDIACONTROL_DISABLE = 'container:mediacontrol:disable'
Events.CONTAINER_MEDIACONTROL_ENABLE = 'container:mediacontrol:enable'
Events.CONTAINER_STATS_ADD = 'container:stats:add'
/**
 * Fired when the options were changed for the container
 *
 * @event CONTAINER_OPTIONS_CHANGE
 */
Events.CONTAINER_OPTIONS_CHANGE = 'container:options:change'

// MediaControl Events
Events.MEDIACONTROL_RENDERED = 'mediacontrol:rendered'
/**
 * Fired when the player enters/exit on fullscreen
 *
 * @event MEDIACONTROL_FULLSCREEN
 */
Events.MEDIACONTROL_FULLSCREEN = 'mediacontrol:fullscreen'
/**
 * Fired when the media control shows
 *
 * @event MEDIACONTROL_SHOW
 */
Events.MEDIACONTROL_SHOW = 'mediacontrol:show'
/**
 * Fired when the media control hides
 *
 * @event MEDIACONTROL_HIDE
 */
Events.MEDIACONTROL_HIDE = 'mediacontrol:hide'
/**
 * Fired when mouse enters on the seekbar
 *
 * @event MEDIACONTROL_MOUSEMOVE_SEEKBAR
 * @param {Object} event
 * the javascript event
 */
Events.MEDIACONTROL_MOUSEMOVE_SEEKBAR = 'mediacontrol:mousemove:seekbar'
/**
 * Fired when mouse leaves the seekbar
 *
 * @event MEDIACONTROL_MOUSELEAVE_SEEKBAR
 * @param {Object} event
 * the javascript event
 */
Events.MEDIACONTROL_MOUSELEAVE_SEEKBAR = 'mediacontrol:mouseleave:seekbar'
/**
 * Fired when the media is being played
 *
 * @event MEDIACONTROL_PLAYING
 */
Events.MEDIACONTROL_PLAYING = 'mediacontrol:playing'
/**
 * Fired when the media is not being played
 *
 * @event MEDIACONTROL_NOTPLAYING
 */
Events.MEDIACONTROL_NOTPLAYING = 'mediacontrol:notplaying'
/**
 * Fired when the container was changed
 *
 * @event MEDIACONTROL_CONTAINERCHANGED
 */
Events.MEDIACONTROL_CONTAINERCHANGED = 'mediacontrol:containerchanged'

// Core Events
Events.CORE_CONTAINERS_CREATED = 'core:containers:created'
