// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var $ = require('jquery');
var _ = require('underscore');
var extend = require('./utils').extend;
var BaseObject = require('./base_object');

var UIObject = function(options) {
  this.cid = _.uniqueId('c');
  options || (options = {});
  _.extend(this, _.pick(options, viewOptions));
  this._ensureElement();
  this.initialize.apply(this, arguments);
  this.delegateEvents();
};

var delegateEventSplitter = /^(\S+)\s*(.*)$/;

var viewOptions = ['container', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

_.extend(UIObject.prototype, BaseObject.prototype, {

  tagName: 'div',

  $: function(selector) {
    return this.$el.find(selector);
  },

  initialize: function(){},

  render: function() {
    return this;
  },

  remove: function() {
    this.$el.remove();
    this.stopListening();
    return this;
  },

  setElement: function(element, delegate) {
    if (this.$el) this.undelegateEvents();
    this.$el = element instanceof $ ? element : $(element);
    this.el = this.$el[0];
    if (delegate !== false) this.delegateEvents();
    return this;
  },

  delegateEvents: function(events) {
    if (!(events || (events = _.result(this, 'events')))) return this;
    this.undelegateEvents();
    for (var key in events) {
      var method = events[key];
      if (!_.isFunction(method)) method = this[events[key]];
      if (!method) continue;

      var match = key.match(delegateEventSplitter);
      var eventName = match[1], selector = match[2];
      method = _.bind(method, this);
      eventName += '.delegateEvents' + this.cid;
      if (selector === '') {
        this.$el.on(eventName, method);
      } else {
        this.$el.on(eventName, selector, method);
      }
    }
    return this;
  },

  undelegateEvents: function() {
    this.$el.off('.delegateEvents' + this.cid);
    return this;
  },

  _ensureElement: function() {
    if (!this.el) {
      var attrs = _.extend({}, _.result(this, 'attributes'));
      if (this.id) attrs.id = _.result(this, 'id');
      if (this.className) attrs['class'] = _.result(this, 'className');
      var $el = $('<' + _.result(this, 'tagName') + '>').attr(attrs);
      this.setElement($el, false);
    } else {
      this.setElement(_.result(this, 'el'), false);
    }
  }
});

UIObject.extend = extend;

module.exports = UIObject;
