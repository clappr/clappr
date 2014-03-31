// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIPlugin = require('../../base/ui_plugin');
var Styler = require('../../base/styler');
var JST = require('../../base/jst');

var WaterMarkPlugin = UIPlugin.extend({
  name: 'watermark',
  type: 'ui',
  initialize: function(options) {
//    WaterMarkPlugin.super('initialize').call(this, options);
    this.template = JST[this.name];
    this.position = options.position || "bottom-right";
    this.imageUrl = options.imageUrl || 'assets/watermark.png';
    this.render();
  },
  bindEvents: function() {
    this.listenTo(this.container, 'container:play', this.onPlay);
    this.listenTo(this.container, 'container:stop', this.onStop);
  },
  onPlay: function() {
    this.$el.show();
  },
  onStop: function() {
    this.$el.hide();
  },
  render: function() {
    this.$el.hide();
    var templateOptions = {position: this.position, imageUrl: this.imageUrl};
    this.$el.html(this.template(templateOptions));
    var style = Styler.getStyleFor(this.name);
    this.container.$el.append(style);
    this.container.$el.append(this.$el);
    return this;
  }
});

module.exports = WaterMarkPlugin;

