// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIPlugin = require('../../base/ui_plugin');
var Styler = require('../../base/styler');

var PosterPlugin = UIPlugin.extend({
  name: 'poster',
  tagName: 'img',
  attributes: {
    'data-poster': ''
  },
  events: {
    'click': 'clicked'
  },
  initialize: function(options) {
    PosterPlugin.super('initialize').call(this, options);
    this.options = options;
    if (this.options.disableControlsOnPoster)
      this.container.disableMediaControl();
    this.el.src = options.poster || 'assets/default.png';
    this.render();
  },
  bindEvents: function() {
    this.listenTo(this.container, 'container:play', this.onPlay);
    this.listenTo(this.container, 'container:stop', this.onStop);
    this.listenTo(this.container, 'container:ended', this.onStop);
  },
  onPlay: function() {
    this.$el.hide();
    if (this.options.disableControlsOnPoster) {
      this.container.enableMediaControl();
    }
  },
  onStop: function() {
    this.$el.show();
    if (this.options.disableControlsOnPoster) {
      this.container.disableMediaControl();
    }
  },
  render: function() {
    var style = Styler.getStyleFor(this.name);
    this.container.$el.append(style);
    this.container.$el.append(this.el);
    return this;
  },
  clicked: function() {
    this.container.play();
  }
});

module.exports = PosterPlugin;
