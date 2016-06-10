// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The mediator is a singleton for handling global events.
 */

import Events from 'base/events'

var events = new Events()

export default class Mediator {
}

Mediator.on = function(name, callback, context) {
  events.on(name, callback, context)
  return
}

Mediator.once = function(name, callback, context) {
  events.once(name, callback, context)
  return
}

Mediator.off = function(name, callback, context) {
  events.off(name, callback, context)
  return
}

Mediator.trigger = function(name, ...opts) {
  events.trigger.apply(events, [name, ...opts])
  return
}

Mediator.stopListening = function(obj, name, callback) {
  events.stopListening(obj, name, callback)
  return
}
