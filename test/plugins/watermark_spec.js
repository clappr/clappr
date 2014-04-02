// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Player = require('../spec_helper');

describe('WaterMarkPlugin', function() {
  beforeEach(function() {
    this.container = new Player.Container({playback: new Player.FakePlayback()});
    this.plugin = new Player.WaterMarkPlugin({container: this.container});
  });

  describe('#bindEvents', function() {
    beforeEach(function() {
      this.plugin.onPlay = sinon.spy();
      this.plugin.onStop = sinon.spy();
      //re-bind events to use the spied callbacks
      this.plugin.bindEvents();
    });

    it('container:play event', function() {
      this.container.play();
      expect(this.plugin.onPlay.called).to.be.true;
    });

    it('container:stop event', function() {
      this.container.stop();
      expect(this.plugin.onStop.called).to.be.true;
    });

    it('#disable', function() {
      this.plugin.disable();
      this.container.stop();
      expect(this.plugin.onStop.called).to.be.false;
    });

    it('#enable', function() {
      this.plugin.disable();
      this.plugin.enable();
      this.container.play();
      expect(this.plugin.onPlay.called).to.be.true;
    });
  });

});

