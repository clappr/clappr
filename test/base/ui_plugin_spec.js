// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIPlugin = require('../spec_helper').UIPlugin;
var Container = require('../spec_helper').Container;
var HTML5Playback = require('../spec_helper').HTML5VideoPlayback;

describe('UIPlugin', function() {
  beforeEach(function() {
    this.container = new Container({playback: new HTML5Playback({src: 'foo.mp4'})});
  });

  describe('default behavior', function() {
    var clicked = sinon.spy();
    var TestPlugin = UIPlugin.extend({ events: { 'click':'clicked' }, clicked: clicked });

    beforeEach(function() {
      this.plugin = new UIPlugin({container: this.container});
    });

    it('type is ui', function() {
      expect(this.plugin.type).to.equal('ui');
    });

    it('is a UIObject', function() {
      expect(this.plugin.tagName).to.equal('div');
      expect(this.plugin.el).to.not.be.undefined;
      expect(this.plugin.$el).to.not.be.undefined;
    });

    it('handle events', function() {
      var plugin = new TestPlugin({container: this.container});
      plugin.$el.click();
      expect(clicked.called).to.be.true;
    });

    it('#enable', function() {
      var spy = sinon.spy();
      this.plugin.$el = {show: spy};
      this.plugin.enable();
      expect(spy.called).to.be.true;
    });

    it('#disable', function() {
      var spy = sinon.spy();
      this.plugin.$el = {hide: spy};
      this.plugin.disable();
      expect(spy.called).to.be.true;
    });
  });
});
