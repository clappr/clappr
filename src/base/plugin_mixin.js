// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var PluginMixin = {
  initialize: function() {
    this.bindEvents();
  },
  enable: function() {
    this.bindEvents();
  },
  disable: function() {
    this.stopListening();
  }
};

module.exports = PluginMixin;

