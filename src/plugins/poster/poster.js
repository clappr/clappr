// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIObject = require('../../base/ui_object');
var Styler = require('../../base/styler');

var PosterPlugin = UIObject.extend({
  attributes: {
    'data-poster': ''
  },
  tagName: 'img',
  initialize: function(options) {
    this.listenTo(this.container, 'container:play', this.onPlay);
    this.listenTo(this.container, 'container:stop', this.onStop);
    this.el.src = options.poster || 'assets/default.png';
    this.render();
  },
  onPlay: function() {
    this.$el.hide();
  },
  onStop: function() {
    this.$el.show();
  },
  render: function() {
    var style = Styler.getStyleFor('poster');
    this.container.$el.append(style);
    this.container.$el.append(this.el);
    return this;
  }
});

module.exports = PosterPlugin;
