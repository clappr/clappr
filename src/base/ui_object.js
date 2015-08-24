// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import {uniqueId} from './utils'
import $ from 'clappr-zepto'
import result from 'lodash.result'
import assign from 'lodash.assign'
import BaseObject from './base_object'

var delegateEventSplitter = /^(\S+)\s*(.*)$/

/**
 * A base class to create ui object.
 * @class UIObject
 * @constructor
 * @extends BaseObject
 * @module base
 */
export default class UIObject extends BaseObject {

  /**
   * gets the tag name for the ui component
   * @method tagName
   * @return {String} tag's name
   */
  get tagName() { return 'div' }

  /**
   * it builds an ui component by:
   *  * creating an id for the component `cid`
   *  * making sure the element is created `$el`
   *  * delegating all `events` to the element
   * @method constructor
   * @param {Object} options the options object
   */
  /**
   * a unique id prefixed with `'c'`, `c1, c232`
   *
   * @property cid
   * @type String
   */
  /**
   * the dom element itself
   *
   * @property el
   * @type HTMLElement
   */
  /**
   * the dom element wrapped by $zepto
   *
   * @property $el
   * @type HTMLElement
   */
  /**
   * an implicit property which consists of an key/value, being key the
   * element's event and the value the callback for that element
   *```javascript
   * html5VideoPlayback.events = {'pause', 'pause'} //will map pause event from video tag to our function pause
   *```
   *
   * @property events
   * @type Object
   */
  constructor(options) {
    super(options)
    this.cid = uniqueId('c');
    this._ensureElement();
    this.delegateEvents();
  }

  /**
   * selects within the component.
   * @method $
   * @param {String} selector a selector to find within the component.
   * @return {HTMLElement} an element, if it exists.
   * @example
   * ```javascript
   * fullScreenBarUIComponent.$('.button-full') //will return only `.button-full` within the component
   * ```
   */
  $(selector) {
    return this.$el.find(selector)
  }

  /**
   * render the component, usually attach it to a real existent `element`
   * @method render
   * @return {UIObject} itself
   */
  render() {
    return this
  }

  /**
   * removes the ui component from DOM
   * @method remove
   * @return {UIObject} itself
   */
  remove() {
    this.$el.remove()
    this.stopListening()
    this.undelegateEvents()
    return this
  }

  /**
   * set element to `el` and `$el`
   * @method setElement
   * @param {HTMLElement} element
   * @param {Boolean} delegate whether is delegate or not
   */
  setElement(element, delegate) {
    if (this.$el) this.undelegateEvents()
    this.$el = element instanceof $ ? element : $(element)
    this.el = this.$el[0]
    if (delegate !== false) this.delegateEvents()
    return this
  }

  /**
   * delegats all the original `events` on `element` to its callbacks
   * @method delegateEvents
   * @param {Object} events
   */
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

  /**
   * undelegats all the `events`
   * @method undelegateEvents
   */
  undelegateEvents() {
    this.$el.off('.delegateEvents' + this.cid)
    return this
  }

  /**
   * ensures the creation of this ui component
   * @method _ensureElement
   * @private
   */
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

