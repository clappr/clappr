// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Plugin = require('../spec_helper').Plugin;
var Container = require('../spec_helper').Container;

describe('Plugin', function() {
  beforeEach(function() {
    this.container = new Container();
  });

  describe('default behavior', function() {
    var clicked = sinon.spy();
    var TestPlugin = Plugin.extend({ events: { 'click':'clicked' }, clicked: clicked });

    beforeEach(function() {
      this.plugin = new Plugin({container: this.container});
    });

    it('type is ui', function() {
      expect(this.plugin.type).to.equal('ui');
    });

    it('is a UIObject', function() {
      expect(this.plugin.tagName).to.equal('div');
      expect(this.plugin.el).to.exists;
      expect(this.plugin.$el).to.exists;
    });

    it('handle events', function() {
      var plugin = new TestPlugin({container: this.container});
      plugin.$el.click();
      expect(clicked.called).to.be.true;
    });
  });

  describe('when not a UI plugin', function() {
    var initialize = sinon.spy();
    var TestPlugin = Plugin.extend({initialize: initialize, type: 'stats'});

    beforeEach(function() {
      this.plugin = new TestPlugin({container: this.container});
    });

    it('behaves as a BaseObject', function() {
      expect(initialize.called).to.be.true;
      expect(this.plugin.on).to.exists;
      expect(this.plugin.listenTo).to.exists;
      expect(this.plugin.off).to.exists;
      expect(this.plugin.once).to.exists;
    });
  });
});
