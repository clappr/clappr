// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var $ = require('clappr-zepto')
var uniqueId = require('./utils').uniqueId
var result = require('lodash.result')
var assign = require('lodash.assign')
var BaseObject = require('./base_object')

var delegateEventSplitter = /^(\S+)\s*(.*)$/

class UIObject extends BaseObject {

  get tagName() { return 'div' }

  constructor(options) {
    super(options)
    this.cid = uniqueId('c');
    this._ensureElement();
    this.delegateEvents();
  }

  $(selector) {
    return this.$el.find(selector)
  }

  render() {
    return this
  }

  remove() {
    this.$el.remove()
    this.stopListening()
    return this
  }

  setElement(element, delegate) {
    if (this.$el) this.undelegateEvents()
    this.$el = element instanceof $ ? element : $(element)
    this.el = this.$el[0]
    if (delegate !== false) this.delegateEvents()
    return this
  }

  delegateEvents(events) {
    if (!(events || (events = result(this, 'events')))) return this
    this.undelegateEvents()
    for (var key in events) {
      var method = events[key]
      if ((method && method.constructor !== Function)) method = this[events[key]]
      if (!method) continue

      var match = key.match(delegateEventSplitter)
      var eventName = match[1], selector = match[2]
      //method = _.bind(method, this)
      eventName += '.delegateEvents' + this.cid
      if (selector === '') {
        this.$el.on(eventName, method.bind(this))
      } else {
        this.$el.on(eventName, selector, method.bind(this))
      }
    }
    return this
  }

  undelegateEvents() {
    this.$el.off('.delegateEvents' + this.cid)
    return this
  }

  _ensureElement() {
    if (!this.el) {
      var attrs = assign({}, result(this, 'attributes'))
      if (this.id) attrs.id = result(this, 'id')
      if (this.className) attrs['class'] = result(this, 'className')
      var $el = $('<' + result(this, 'tagName') + '>').attr(attrs)
      this.setElement($el, false)
    } else {
      this.setElement(result(this, 'el'), false)
    }
  }
}

module.exports = UIObject
