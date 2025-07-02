// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Log from '../../components/log/log'
import { uniqueId } from '../../utils/utils'

const slice = Array.prototype.slice

const eventSplitter = /\s+/

const eventsApi = function (targetObject, actionMethod, eventName, additionalArgs) {
  if (!eventName) return true

  // Handle event maps.
  if (typeof eventName === 'object') {
    for (const eventKey in eventName)
      targetObject[actionMethod].apply(targetObject, [eventKey, eventName[eventKey]].concat(additionalArgs))

    return false
  }

  // Handle space separated event names.
  if (eventSplitter.test(eventName)) {
    const eventNames = eventName.split(eventSplitter)
    for (let nameIndex = 0, totalNames = eventNames.length; nameIndex < totalNames; nameIndex++)
      targetObject[actionMethod].apply(targetObject, [eventNames[nameIndex]].concat(additionalArgs))

    return false
  }

  return true
}

const triggerEvents = function (eventHandlers, eventArgs, sourceClassName, eventName) {
  let currentHandler,
    handlerIndex = -1
  const totalHandlers = eventHandlers.length,
    firstArg = eventArgs[0],
    secondArg = eventArgs[1],
    thirdArg = eventArgs[2]
  executeHandlers()

  function executeHandlers() {
    try {
      switch (eventArgs.length) {
      /* eslint-disable curly */
      case 0:
        while (++handlerIndex < totalHandlers) {
          (currentHandler = eventHandlers[handlerIndex]).callback.call(currentHandler.ctx)
        }
        return
      case 1:
        while (++handlerIndex < totalHandlers) {
          (currentHandler = eventHandlers[handlerIndex]).callback.call(currentHandler.ctx, firstArg)
        }
        return
      case 2:
        while (++handlerIndex < totalHandlers) {
          (currentHandler = eventHandlers[handlerIndex]).callback.call(currentHandler.ctx, firstArg, secondArg)
        }
        return
      case 3:
        while (++handlerIndex < totalHandlers) {
          (currentHandler = eventHandlers[handlerIndex]).callback.call(
            currentHandler.ctx,
            firstArg,
            secondArg,
            thirdArg
          )
        }
        return
      default:
        while (++handlerIndex < totalHandlers) {
          (currentHandler = eventHandlers[handlerIndex]).callback.apply(currentHandler.ctx, eventArgs)
        }
        return
      }
    } catch (handlerException) {
      Log.error.apply(Log, [sourceClassName, 'error on event', eventName, 'trigger', '-', handlerException])
      executeHandlers()
    }
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
  on(eventName, callback, context) {
    if (!eventsApi(this, 'on', eventName, [callback, context]) || !callback) return this
    this._events || (this._events = {})
    const eventHandlers = this._events[eventName] || (this._events[eventName] = [])
    eventHandlers.push({ callback: callback, context: context, ctx: context || this })
    return this
  }

  /**
   * listen to an event only once
   * @method once
   * @param {String} name
   * @param {Function} callback
   * @param {Object} context
   */
  once(eventName, callback, context) {
    let onceWrapper
    if (!eventsApi(this, 'once', eventName, [callback, context]) || !callback) return this
    const removeListener = () => this.off(eventName, onceWrapper)
    onceWrapper = function () {
      removeListener(eventName, onceWrapper)
      callback.apply(this, arguments)
    }
    onceWrapper._callback = callback
    return this.on(eventName, onceWrapper, context)
  }

  /**
   * stop listening to an event
   * @method off
   * @param {String} name
   * @param {Function} callback
   * @param {Object} context
   */
  off(eventName, callback, context) {
    let retainedHandlers, currentHandler, eventHandlers, eventNames, nameIndex, totalNames, handlerIndex, totalHandlers
    if (!this._events || !eventsApi(this, 'off', eventName, [callback, context])) return this
    if (!eventName && !callback && !context) {
      this._events = void 0
      return this
    }
    eventNames = eventName ? [eventName] : Object.keys(this._events)
    // jshint maxdepth:5
    for (nameIndex = 0, totalNames = eventNames.length; nameIndex < totalNames; nameIndex++) {
      eventName = eventNames[nameIndex]
      eventHandlers = this._events[eventName]
      if (eventHandlers) {
        this._events[eventName] = retainedHandlers = []
        if (callback || context) {
          for (handlerIndex = 0, totalHandlers = eventHandlers.length; handlerIndex < totalHandlers; handlerIndex++) {
            currentHandler = eventHandlers[handlerIndex]
            if (
              (callback && callback !== currentHandler.callback && callback !== currentHandler.callback._callback) ||
              (context && context !== currentHandler.context)
            )
              retainedHandlers.push(currentHandler)
          }
        }
        if (!retainedHandlers.length) delete this._events[eventName]
      }
    }
    return this
  }

  /**
   * triggers an event given its `name`
   * @method trigger
   * @param {String} name
   */
  trigger(eventName) {
    const sourceClassName = this.name || this.constructor.name
    Log.debug.apply(Log, [sourceClassName].concat(Array.prototype.slice.call(arguments)))
    if (!this._events) return this
    const eventArguments = slice.call(arguments, 1)
    if (!eventsApi(this, 'trigger', eventName, eventArguments)) return this
    const specificEventHandlers = this._events[eventName]
    const allEvents = this._events.all
    if (specificEventHandlers) triggerEvents(specificEventHandlers, eventArguments, sourceClassName, eventName)
    if (allEvents) triggerEvents(allEvents, arguments, sourceClassName, eventName)
    return this
  }

  /**
   * stop listening an event for a given object
   * @method stopListening
   * @param {Object} obj
   * @param {String} name
   * @param {Function} callback
   */
  stopListening(targetObject, eventName, callback) {
    let listeningToObjects = this._listeningTo
    if (!listeningToObjects) return this
    const removeAll = !eventName && !callback
    if (!callback && typeof eventName === 'object') callback = this
    if (targetObject) (listeningToObjects = {})[targetObject._listenId] = targetObject
    for (const listenerId in listeningToObjects) {
      targetObject = listeningToObjects[listenerId]
      targetObject.off(eventName, callback, this)
      if (removeAll || Object.keys(targetObject._events).length === 0) delete this._listeningTo[listenerId]
    }
    return this
  }

  static register(eventName) {
    Events.Custom || (Events.Custom = {})
    let property = typeof eventName === 'string' && eventName.toUpperCase().trim()

    if (property && !Events.Custom[property]) {
      Events.Custom[property] = property
        .toLowerCase()
        .split('_')
        .map((value, index) => (index === 0 ? value : (value = value[0].toUpperCase() + value.slice(1))))
        .join('')
    } else Log.error('Events', 'Error when register event: ' + eventName)
  }

  static listAvailableCustomEvents() {
    Events.Custom || (Events.Custom = {})
    return Object.keys(Events.Custom).filter((property) => typeof Events.Custom[property] === 'string')
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
Events.prototype.listenTo = function (targetObject, eventName, callback) {
  const listeningToObjects = this._listeningTo || (this._listeningTo = {})
  const listenerId = targetObject._listenId || (targetObject._listenId = uniqueId('l'))
  listeningToObjects[listenerId] = targetObject
  if (!callback && typeof eventName === 'object') callback = this
  targetObject.on(eventName, callback, this)
  return this
}

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
Events.prototype.listenToOnce = function (targetObject, eventName, callback) {
  const listeningToObjects = this._listeningTo || (this._listeningTo = {})
  const listenerId = targetObject._listenId || (targetObject._listenId = uniqueId('l'))
  listeningToObjects[listenerId] = targetObject
  if (!callback && typeof eventName === 'object') callback = this
  targetObject.once(eventName, callback, this)
  return this
}

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
Events.PLAYER_ERROR = 'playererror'
/**
 * Fired when there is an error
 *
 * @event ERROR
 * @param {Object} error
 * the error with the following format `{code, description, level, raw, origin, scope}`
 * @param {String} [options.code]
 * error's code: code to identify error in the following format: origin:code
 * @param {String} [options.description]
 * error's description: description of the error
 * @param {String} [options.level]
 * error's level: FATAL or WARN.
 * @param {String} [options.origin]
 * error's origin. Example: hls, html5, etc
 * @param {String} [options.scope]
 * error's scope. Example: playback, container, etc
 * @param {String} [options.raw]
 * raw error: the initial error received
 */
Events.ERROR = 'error'
/**
 * Fired when the time is updated on player
 *
 * @event PLAYER_TIMEUPDATE
 * @param {Object} progress Data
 * progress object
 * @param {Number} [progress.current]
 * current time (in seconds)
 * @param {Number} [progress.total]
 * total time (in seconds)
 */
Events.PLAYER_TIMEUPDATE = 'timeupdate'
/**
 * Fired when player updates its volume
 *
 * @event PLAYER_VOLUMEUPDATE
 * @param {Number} volume the current volume
 */
Events.PLAYER_VOLUMEUPDATE = 'volumeupdate'

/**
 * Fired when subtitle is available
 *
 * @event PLAYER_SUBTITLE_AVAILABLE
 */
Events.PLAYER_SUBTITLE_AVAILABLE = 'subtitleavailable'

// Playback Events
/** Fired when picture-in-picture mode is entered
 *
 * @event PLAYBACK_PIP_ENTER
 */
Events.PLAYBACK_PIP_ENTER = 'playback:picture-in-picture:enter'
/** Fired when picture-in-picture mode is exited
 *
 * @event PLAYBACK_PIP_EXIT
 */
Events.PLAYBACK_PIP_EXIT = 'playback:picture-in-picture:exit'
/**
 * Fired when the playback is downloading the media
 *
 * @event PLAYBACK_PROGRESS
 * @param progress {Object}
 * Data progress object
 * @param [progress.start] {Number}
 * start position of buffered content at current position
 * @param [progress.current] {Number}
 * end position of buffered content at current position
 * @param [progress.total] {Number}
 * total content to be downloaded
 * @param buffered {Array}
 * array of buffered segments ({start, end}). [Only for supported playbacks]
 */
Events.PLAYBACK_PROGRESS = 'playback:progress'
/**
 * Fired when the time is updated on playback
 *
 * @event PLAYBACK_TIMEUPDATE
 * @param {Object} progress Data
 * progress object
 * @param {Number} [progress.current]
 * current time (in seconds)
 * @param {Number} [progress.total]
 * total time (in seconds)
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
 * Fired when the media for a playback is seeking.
 *
 * @event PLAYBACK_SEEK
 */
Events.PLAYBACK_SEEK = 'playback:seek'
/**
 * Fired when the media for a playback is seeked.
 *
 * @event PLAYBACK_SEEKED
 */
Events.PLAYBACK_SEEKED = 'playback:seeked'
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
/**
 *  Fired when a fragment has been appended into buffer
 *
 * @event PLAYBACK_FRAGMENT_BUFFERED
 * @param {Object} data Data
 *
 */
Events.PLAYBACK_FRAGMENT_BUFFERED = 'playback:fragment:buffered'
// TODO doc
Events.PLAYBACK_LEVEL_SWITCH = 'playback:level:switch'
/**
 * Fired when subtitle is available on playback for display
 *
 * @event PLAYBACK_SUBTITLE_AVAILABLE
 */
Events.PLAYBACK_SUBTITLE_AVAILABLE = 'playback:subtitle:available'
/**
 * Fired when playback subtitle track has changed
 *
 * @event CONTAINER_SUBTITLE_CHANGED
 * @param {Object} track Data
 * track object
 * @param {Number} [track.id]
 * selected track id
 */
Events.PLAYBACK_SUBTITLE_CHANGED = 'playback:subtitle:changed'

/**
 * Fired when audio tracks are available to be used on the playback
 * @event PLAYBACK_AUDIO_AVAILABLE
 * @param {import('../playback/playback').AudioTrack[]} tracks - list of available audio tracks
 */
Events.PLAYBACK_AUDIO_AVAILABLE = 'playback:audio:available'

/**
 * Fired whenever the current audio track has changed
 * @event PLAYBACK_AUDIO_CHANGED
 * @param {import('../playback/playback').AudioTrack} track - audio track active after change
 */
Events.PLAYBACK_AUDIO_CHANGED = 'playback:audio:changed'

/**
 * Fired when the playback was resized.
 *
 * @event PLAYBACK_RESIZE
 */
Events.PLAYBACK_RESIZE = 'playback:resize'

// Core Events
/**
 * Fired when the containers are created
 *
 * @event CORE_CONTAINERS_CREATED
 */
Events.CORE_CONTAINERS_CREATED = 'core:containers:created'
/**
 * Fired when the active container changed
 *
 * @event CORE_ACTIVE_CONTAINER_CHANGED
 */
Events.CORE_ACTIVE_CONTAINER_CHANGED = 'core:active:container:changed'

/**
 * Fired before options are changed in core
 *
 * @event CORE_OPTIONS_WILL_CHANGE
 * @param {Object} current options before change
 */
Events.CORE_OPTIONS_WILL_CHANGE = 'core:options:will:change'

/**
 * Fired when the options were changed for the core
 *
 * @event CORE_OPTIONS_CHANGE
 * @param {Object} new options provided to configure() method
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
 * @event CORE_FULLSCREEN
 * @param {Boolean} whether or not the player is on fullscreen mode
 */
Events.CORE_FULLSCREEN = 'core:fullscreen'
/**
 * Fired when core updates size
 *
 * @event CORE_RESIZE
 * @param {Object} currentSize an object with the current size
 */
Events.CORE_RESIZE = 'core:resize'
/**
 * Fired when the screen orientation has changed.
 * This event is trigger only for mobile devices.
 *
 * @event CORE_SCREEN_ORIENTATION_CHANGED
 * @param {Object} screen An object with screen orientation
 * screen object
 * @param {Object} [screen.event]
 * window resize event object
 * @param {String} [screen.orientation]
 * screen orientation (ie: 'landscape' or 'portrait')
 */
Events.CORE_SCREEN_ORIENTATION_CHANGED = 'core:screen:orientation:changed'
/**
 * Fired when occurs mouse move event on core element
 *
 * @event CORE_MOUSE_MOVE
 * @param {Object} event a DOM event
 */
Events.CORE_MOUSE_MOVE = 'core:mousemove'
/**
 * Fired when occurs mouse leave event on core element
 *
 * @event CORE_MOUSE_LEAVE
 * @param {Object} event a DOM event
 */
Events.CORE_MOUSE_LEAVE = 'core:mouseleave'

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

/**
 * Fired when the container was resized.
 *
 * Some fullscreen modes won't trigger this resize since they don't affect the container, only the playback contents.
 *
 * @event CONTAINER_RESIZE
 */
Events.CONTAINER_RESIZE = 'container:resize'

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
 * Fired when subtitle is available on container for display
 *
 * @event CONTAINER_SUBTITLE_AVAILABLE
 */
Events.CONTAINER_SUBTITLE_AVAILABLE = 'container:subtitle:available'
/**
 * Fired when subtitle track has changed
 *
 * @event CONTAINER_SUBTITLE_CHANGED
 * @param {Object} track Data
 * track object
 * @param {Number} [track.id]
 * selected track id
 */
Events.CONTAINER_SUBTITLE_CHANGED = 'container:subtitle:changed'

/**
 * Fired when audio tracks are available to be used on the container
 * @event CONTAINER_AUDIO_AVAILABLE
 * @param {import('../playback/playback').AudioTrack[]} tracks - list of available audio tracks
 */
Events.CONTAINER_AUDIO_AVAILABLE = 'container:audio:available'

/**
 * Fired whenever the current audio track has changed
 * @event CONTAINER_AUDIO_CHANGED
 * @param {import('../playback/playback').AudioTrack} track - audio track active after change
 */
Events.CONTAINER_AUDIO_CHANGED = 'container:audio:changed'

/**
 * Fired when the time is updated on container
 *
 * @event CONTAINER_TIMEUPDATE
 * @param {Object} progress Data
 * progress object
 * @param {Number} [progress.current]
 * current time (in seconds)
 * @param {Number} [progress.total]
 * total time (in seconds)
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
Events.CONTAINER_MOUSE_UP = 'container:mouseup'
Events.CONTAINER_MOUSE_DOWN = 'container:mousedown'

/**
 *  Fired when the container enters on Picture-in-Picture mode
 * @event CONTAINER_PIP_ENTER
 */
Events.CONTAINER_PIP_ENTER = 'container:picture-in-picture:enter'
/**
 * Fired when the container exits from Picture-in-Picture mode
 * @event CONTAINER_PIP_EXIT
 */
Events.CONTAINER_PIP_EXIT = 'container:picture-in-picture:exit'

/**
 * Fired when the container seeks the video
 *
 * @event CONTAINER_SEEK
 * @param {Number} time the current time in seconds
 */
Events.CONTAINER_SEEK = 'container:seek'
/**
 * Fired when the container was finished the seek video
 *
 * @event CONTAINER_SEEKED
 * @param {Number} time the current time in seconds
 */
Events.CONTAINER_SEEKED = 'container:seeked'
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
 * Fired before options are changed in container
 *
 * @event CONTAINER_OPTIONS_WILL_CHANGE
 * @param {Object} current options before change
 */
Events.CONTAINER_OPTIONS_WILL_CHANGE = 'container:options:will:change'

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
/**
 * Fired when the options were changed for the mediacontrol
 *
 * @event MEDIACONTROL_OPTIONS_CHANGE
 */
Events.MEDIACONTROL_OPTIONS_CHANGE = 'mediacontrol:options:change'
