// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import {uniqueId} from './utils'
import $ from 'clappr-zepto'
import result from 'lodash.result'
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
   * the dom element wrapped by `$`
   *
   * @property $el
   * @type HTMLElement
   */

  /**
   * gets the tag name for the ui component
   * @method tagName
   * @default div
   * @return {String} tag's name
   */
  get tagName() { return 'div' }
  /**
   * a literal object mapping element's events to methods
   * @property events
   * @type Object
   * @example
   *
   *```javascript
   *
   * class MyButton extends UIObject {
   *   constructor(options) {
   *     super(options)
   *     this.myId = 0
   *   }
   *   get events() { return { 'click': 'myClick' } }
   *   myClick(){ this.myId = 42 }
   * }
   *
   * // when you click on MyButton the method `myClick` will be called
   *```
   */
  get events() { return {} }
  /**
   * a literal object mapping attributes and values to the element
   * element's attribute name and the value the attribute value
   * @property attributes
   * @type Object
   * @example
   *
   *```javascript
   *
   * class MyButton extends UIObject {
   *    constructor(options) { super(options) }
   *    get attributes() { return { class: 'my-button'} }
   * }
   *
   * // MyButton.el.className will be 'my-button'
   * ```
   */
  get attributes() { return {} }

  /**
   * it builds an ui component by:
   *  * creating an id for the component `cid`
   *  * making sure the element is created `$el`
   *  * delegating all `events` to the element
   * @method constructor
   * @param {Object} options the options object
   */
  constructor(options) {
    super(options)
    this.cid = uniqueId('c')
    this._ensureElement()
    this.delegateEvents()
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
   * @return {UIObject} itself
   */
  setElement(element, delegate) {
    if (this.$el) {this.undelegateEvents()}
    this.$el = element instanceof $ ? element : $(element)
    this.el = this.$el[0]
    if (delegate !== false) {this.delegateEvents()}
    return this
  }

  /**
   * delegates all the original `events` on `element` to its callbacks
   * @method delegateEvents
   * @param {Object} events
   * @return {UIObject} itself
   */
  delegateEvents(events) {
    if (!(events || (events = result(this, 'events')))) {return this}
    this.undelegateEvents()
    for (var key in events) {
      var method = events[key]
      if ((method && method.constructor !== Function)) {method = this[events[key]]}
      if (!method) {continue}

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
   * @return {UIObject} itself
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
      var attrs = $.extend({}, result(this, 'attributes'))
      if (this.id) {attrs.id = result(this, 'id')}
      if (this.className) {attrs['class'] = result(this, 'className')}
      var $el = $('<' + result(this, 'tagName') + '>').attr(attrs)
      this.setElement($el, false)
    } else {
      this.setElement(result(this, 'el'), false)
    }
  }
}
