// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var execOnce = require('lodash.once')
var uniqueId = require('./utils').uniqueId
var Log = require('../plugins/log').getInstance()

var slice = Array.prototype.slice

class Events {
  on(name, callback, context) {
    if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this
    this._events || (this._events = {})
    var events = this._events[name] || (this._events[name] = [])
    events.push({callback: callback, context: context, ctx: context || this})
    return this
  }

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

  trigger(name) {
    var klass = this.constructor.name
    if (this.hasOwnProperty(name)) {
      klass = this.name
    }
    Log.debug.apply(Log, [klass].concat(Array.prototype.slice.call(arguments)))
    if (!this._events) return this
    var args = slice.call(arguments, 1)
    if (!eventsApi(this, 'trigger', name, args)) return this
    var events = this._events[name]
    var allEvents = this._events.all
    if (events) triggerEvents(events, args)
    if (allEvents) triggerEvents(allEvents, arguments)
    return this
  }

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
Events.PLAYER_RESIZE = 'resize'
Events.PLAYER_PLAY = 'play'
Events.PLAYER_PAUSE = 'pause'
Events.PLAYER_STOP = 'stop'
Events.PLAYER_ENDED = 'ended'
Events.PLAYER_SEEK = 'seek'
Events.PLAYER_ERROR = 'error'
Events.PLAYER_TIMEUPDATE = 'timeupdate'

// Playback Events
Events.PLAYBACK_PROGRESS = 'playback:progress'
Events.PLAYBACK_TIMEUPDATE = 'playback:timeupdate'
Events.PLAYBACK_READY = 'playback:ready'
Events.PLAYBACK_BUFFERING = 'playback:buffering'
Events.PLAYBACK_BUFFERFULL = 'playback:bufferfull'
Events.PLAYBACK_SETTINGSUPDATE = 'playback:settingsupdate'
Events.PLAYBACK_LOADEDMETADATA = 'playback:loadedmetadata'
Events.PLAYBACK_HIGHDEFINITIONUPDATE = 'playback:highdefinitionupdate'
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

// Container Events
Events.CONTAINER_PLAYBACKSTATE = 'container:playbackstate'
Events.CONTAINER_PLAYBACKDVRSTATECHANGED = 'container:dvr'
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

module.exports = Events
