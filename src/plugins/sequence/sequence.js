// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('../../base/base_object');
var SequenceContainer = require('./sequence_container');
var _ = require('underscore');
var Utils = require('../../base/utils');

var Sequence = BaseObject.extend({
  initialize: function(core) {
    this.core = core;
    this.sequenceContainer = new SequenceContainer(this.core.containers);
    this.core.mediaControl.setContainer(this.sequenceContainer);
  },
  getExternalInterface: function() {
    return {};
  }
});

module.exports = Sequence;
