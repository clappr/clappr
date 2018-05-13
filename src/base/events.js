// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Log from '../plugins/log'
import EventsConstants from '../constants/events_constants'
import {uniqueId} from './utils'

const slice = Array.prototype.slice

const eventSplitter = /\s+/

const eventsApi = function(obj, action, name, rest) {
  if (!name) {return true}

  // Handle event maps.
  if (typeof name === 'object') {
    for (const key in name) {
      obj[action].apply(obj, [key, name[key]].concat(rest))
    }
    return false
  }

  // Handle space separated event names.
  if (eventSplitter.test(name)) {
    const names = name.split(eventSplitter)
    for (let i = 0, l = names.length; i < l; i++) {
      obj[action].apply(obj, [names[i]].concat(rest))
    }
    return false
  }

  return true
}

const triggerEvents = function(events, args, klass, name) {
  let ev, i = -1
  const l = events.length, a1 = args[0], a2 = args[1], a3 = args[2]
  run()

  function run() {
    try {
      switch (args.length) {
      case 0: while (++i < l) { (ev = events[i]).callback.call(ev.ctx) } return
      case 1: while (++i < l) { (ev = events[i]).callback.call(ev.ctx, a1) } return
      case 2: while (++i < l) { (ev = events[i]).callback.call(ev.ctx, a1, a2) } return
      case 3: while (++i < l) { (ev = events[i]).callback.call(ev.ctx, a1, a2, a3) } return
      default: while (++i < l) { (ev = events[i]).callback.apply(ev.ctx, args) } return
      }
    } catch (exception) {
      Log.error.apply(Log, [klass, 'error on event', name, 'trigger','-', exception])
      run()
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
  on(name, callback, context) {
    if (!eventsApi(this, 'on', name, [callback, context]) || !callback) {return this}
    this._events || (this._events = {})
    const events = this._events[name] || (this._events[name] = [])
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
    const off = () => this.off(name, once)
    const once = function() {
      off(name, once)
      callback.apply(this, arguments)
    }
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
    let retain, ev, events, names, i, l, j, k
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
    const klass = this.name || this.constructor.name
    Log.debug.apply(Log, [klass].concat(Array.prototype.slice.call(arguments)))
    if (!this._events) {return this}
    const args = slice.call(arguments, 1)
    if (!eventsApi(this, 'trigger', name, args)) {return this}
    const events = this._events[name]
    const allEvents = this._events.all
    if (events) {triggerEvents(events, args, klass, name)}
    if (allEvents) {triggerEvents(allEvents, arguments, klass, name)}
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
    let listeningTo = this._listeningTo
    if (!listeningTo) {return this}
    const remove = !name && !callback
    if (!callback && typeof name === 'object') {callback = this}
    if (obj) {(listeningTo = {})[obj._listenId] = obj}
    for (const id in listeningTo) {
      obj = listeningTo[id]
      obj.off(name, callback, this)
      if (remove || Object.keys(obj._events).length === 0) {delete this._listeningTo[id]}
    }
    return this
  }

  static register(eventName) {
    Events.Custom || (Events.Custom = {})
    let property = typeof eventName === 'string' && eventName.toUpperCase().trim()

    if(property && !Events.Custom[property]) {
      Events.Custom[property] = property.toLowerCase().split('_').map(
        (value, index) => index == 0 ? value : value = (value[0].toUpperCase() + value.slice(1))
      ).join('')
    } else {
      Log.error('Events', 'Error when register event: ' + eventName)
    }
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
const listenMethods = {listenTo: 'on', listenToOnce: 'once'}

Object.keys(listenMethods).forEach(function(method) {
  Events.prototype[method] = function(obj, name, callback) {
    const listeningTo = this._listeningTo || (this._listeningTo = {})
    const id = obj._listenId || (obj._listenId = uniqueId('l'))
    listeningTo[id] = obj
    if (!callback && typeof name === 'object') {callback = this}
    obj[listenMethods[method]](name, callback, this)
    return this
  }
})

Object.keys(EventsConstants).forEach(function(eventKey) {
  Events[eventKey] = EventsConstants[eventKey]
})