// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Log from 'plugins/log'
import {uniqueId} from './utils'
import execOnce from 'lodash.once'

var slice = Array.prototype.slice

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
    if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this
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
    if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this
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
    if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this
    if (!name && !callback && !context) {
      this._events = void 0
      return this
    }
    names = name ? [name] : Object.keys(this._events)
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
        if (!retain.length) delete this._events[name]
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
    try {
      var klass = this.name || this.constructor.name
      Log.debug.apply(Log, [klass].concat(Array.prototype.slice.call(arguments)))
      if (!this._events) return this
      var args = slice.call(arguments, 1)
      if (!eventsApi(this, 'trigger', name, args)) return this
      var events = this._events[name]
      var allEvents = this._events.all
      if (events) triggerEvents(events, args)
      if (allEvents) triggerEvents(allEvents, arguments)
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
    if (!listeningTo) return this
    var remove = !name && !callback
    if (!callback && typeof name === 'object') callback = this
    if (obj) (listeningTo = {})[obj._listenId] = obj
    for (var id in listeningTo) {
      obj = listeningTo[id]
      obj.off(name, callback, this)
      if (remove || Object.keys(obj._events).length === 0) delete this._listeningTo[id]
    }
    return this
  }
}

var eventSplitter = /\s+/

var eventsApi = function(obj, action, name, rest) {
  if (!name) return true

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
    case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return
    case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return
    case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return
    case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return
    default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return
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
    if (!callback && typeof name === 'object') callback = this
    obj[listenMethods[method]](name, callback, this)
    return this
  }
});

// PLAYER EVENTS
/**
 * Fired when player resizes
 *
 * @event PLAYER_RESIZE
 * @param {Object} currentSize an object with the current size
 */
Events.PLAYER_RESIZE = 'resize'
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
 * @param {Number} percent a percentagem of seek
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
 * Fired when player updates its execution
 *
 * @event PLAYER_TIMEUPDATE
 * @param {Number} postion the current position (in seconds)
 * @param {Number} duration the total duration (in seconds)
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
Events.PLAYBACK_PROGRESS = 'playback:progress'
Events.PLAYBACK_TIMEUPDATE = 'playback:timeupdate'
Events.PLAYBACK_READY = 'playback:ready'
Events.PLAYBACK_BUFFERING = 'playback:buffering'
Events.PLAYBACK_BUFFERFULL = 'playback:bufferfull'
Events.PLAYBACK_SETTINGSUPDATE = 'playback:settingsupdate'
Events.PLAYBACK_LOADEDMETADATA = 'playback:loadedmetadata'
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
Events.PLAYBACK_PLAYBACKSTATE = 'playback:playbackstate'
Events.PLAYBACK_DVR = 'playback:dvr'
Events.PLAYBACK_MEDIACONTROL_DISABLE = 'playback:mediacontrol:disable'
Events.PLAYBACK_MEDIACONTROL_ENABLE = 'playback:mediacontrol:enable'
Events.PLAYBACK_ENDED = 'playback:ended'
Events.PLAYBACK_PLAY = 'playback:play'
Events.PLAYBACK_PAUSE = 'playback:pause'
Events.PLAYBACK_ERROR = 'playback:error'
Events.PLAYBACK_STATS_ADD = 'playback:stats:add'
Events.PLAYBACK_FRAGMENT_LOADED = 'playback:fragment:loaded'
Events.PLAYBACK_LEVEL_SWITCH = 'playback:level:switch'

// Container Events
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
Events.CONTAINER_READY = 'container:ready'
Events.CONTAINER_ERROR = 'container:error'
Events.CONTAINER_LOADEDMETADATA = 'container:loadedmetadata'
Events.CONTAINER_TIMEUPDATE = 'container:timeupdate'
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
Events.CONTAINER_SEEK = 'container:seek'
Events.CONTAINER_VOLUME = 'container:volume'
Events.CONTAINER_FULLSCREEN = 'container:fullscreen'
Events.CONTAINER_STATE_BUFFERING = 'container:state:buffering'
Events.CONTAINER_STATE_BUFFERFULL = 'container:state:bufferfull'
Events.CONTAINER_SETTINGSUPDATE = 'container:settingsupdate'
Events.CONTAINER_HIGHDEFINITIONUPDATE = 'container:highdefinitionupdate'
Events.CONTAINER_MEDIACONTROL_DISABLE = 'container:mediacontrol:disable'
Events.CONTAINER_MEDIACONTROL_ENABLE = 'container:mediacontrol:enable'
Events.CONTAINER_STATS_ADD = 'container:stats:add'

// MediaControl Events
Events.MEDIACONTROL_RENDERED = 'mediacontrol:rendered'
Events.MEDIACONTROL_FULLSCREEN = 'mediacontrol:fullscreen'
Events.MEDIACONTROL_SHOW = 'mediacontrol:show'
Events.MEDIACONTROL_HIDE = 'mediacontrol:hide'
Events.MEDIACONTROL_MOUSEMOVE_SEEKBAR = 'mediacontrol:mousemove:seekbar'
Events.MEDIACONTROL_MOUSELEAVE_SEEKBAR = 'mediacontrol:mouseleave:seekbar'
Events.MEDIACONTROL_PLAYING = 'mediacontrol:playing'
Events.MEDIACONTROL_NOTPLAYING = 'mediacontrol:notplaying'
Events.MEDIACONTROL_CONTAINERCHANGED = 'mediacontrol:containerchanged'
