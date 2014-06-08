//Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIPlugin = require('../../base/ui_plugin');
var Styler = require('../../base/styler');
var JST = require('../../base/jst');
var $ = require('jquery');

var PosterPlugin = UIPlugin.extend({
  name: 'poster',
  tagName: 'div',
  attributes: {
    'data-poster': ''
  },
  events: {
    'click': 'clicked'
  },
  template: JST.poster,
  initialize: function(options) {
    PosterPlugin.super('initialize').call(this, options);
    if (options.disableControlsOnPoster === undefined)
      options.disableControlsOnPoster = true;
    this.options = options;
    if (this.options.disableControlsOnPoster)
      this.container.disableMediaControl();
    this.render();
  },
  bindEvents: function() {
    this.listenTo(this.container, 'container:state:buffering', this.onBuffering);
    this.listenTo(this.container, 'container:play', this.onPlay);
    this.listenTo(this.container, 'container:stop', this.onStop);
    this.listenTo(this.container, 'container:ended', this.onStop);
    this.listenTo(this.container, 'container:pip', this.onPipStateChanged);
  },
  onBuffering: function() {
    this.hidePlayButton();
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
    if (!this.options.hidePlayButton) {
      this.showPlayButton();
    }
  },
  onPipStateChanged: function(isPip) {
    if (isPip) {
      this.hidePlayButton();
    } else if (!this.options.hidePlayButton) {
      this.showPlayButton();
    }
  },
  hidePlayButton: function() {
    this.$playButton.hide();
  },
  showPlayButton: function() {
    this.$playButton.show();
  },
  clicked: function() {
    this.container.play();
  },
  render: function() {
    var style = Styler.getStyleFor(this.name);
    this.$el.html(this.template());
    this.$el.append(style);
    this.container.$el.append(this.el);
    var imgEl = this.$el.find('img')[0];
    imgEl.src = this.options.poster || 'assets/default.png';
    this.$playButton = $(this.$el.find('.play-wrapper'));
    if (this.options.hidePlayButton)
      this.$playButton.hide();
    return this;
  }
});

module.exports = PosterPlugin;
