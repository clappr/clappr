// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIObject = require('../../base/ui_object');
var Styler = require('../../base/styler');
var JST = require('../../base/jst');

var WaterMarkPlugin = UIObject.extend({
  pluginName: 'watermark',
  initialize: function(options) {
    this.template = JST[this.pluginName];
    this.listenTo(this.container, 'container:play', this.onPlay);
    this.listenTo(this.container, 'container:stop', this.onStop);
    this.position = options.position? options.position: "bottom-right";
    this.imageUrl = options.imageUrl;
    this.render();
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
    var style = Styler.getStyleFor(this.pluginName);
    this.container.$el.append(style);
    this.container.$el.append(this.$el);
    return this;
  }
});

module.exports = WaterMarkPlugin;

