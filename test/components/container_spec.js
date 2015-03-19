var Container = require('../../src/components/container');
var FakePlayback = require('../../src/base/playback');
var Events = require('../../src/base/events');

describe('Container', function() {
  beforeEach(() => {
    this.playback = new FakePlayback();
    this.container = new Container({playback: this.playback});
  });

  it('uses settings from playback', () => {
    expect(this.container.settings).to.deep.equal((new FakePlayback).settings);
  });

  it('gets playback type', () => {
    expect(this.container.getPlaybackType()).to.equal('no_op');
  });

  it('listens to playback:progress event', () => {
    sinon.spy(this.container, 'progress');
    this.container.bindEvents();
    this.playback.trigger(Events.PLAYBACK_PROGRESS);
    assert.ok(this.container.progress.calledOnce);
  });

  it('listens to playback:timeupdate event', () => {
    sinon.spy(this.container, 'timeUpdated');
    this.container.bindEvents();
    this.playback.trigger(Events.PLAYBACK_TIMEUPDATE);
    assert.ok(this.container.timeUpdated.calledOnce);
  });

  it('listens to playback:ready event', () => {
    sinon.spy(this.container, 'ready');
    this.container.bindEvents();
    this.playback.trigger(Events.PLAYBACK_READY);
    assert.ok(this.container.isReady);
    assert.ok(this.container.ready.calledOnce);
  });

  it('listens to playback:buffering event', () => {
    sinon.spy(this.container, 'buffering');
    this.container.bindEvents();
    this.playback.trigger(Events.PLAYBACK_BUFFERING);
    assert.ok(this.container.buffering.calledOnce);
  });

  it('listens to playback:bufferfull event', () => {
    sinon.spy(this.container, 'bufferfull');
    this.container.bindEvents();
    this.playback.trigger(Events.PLAYBACK_BUFFERFULL);
    assert.ok(this.container.bufferfull.calledOnce);
  });

  it('listens to playback:settingsupdate event', () => {
    sinon.spy(this.container, 'settingsUpdate');
    this.container.bindEvents();
    this.playback.trigger(Events.PLAYBACK_SETTINGSUPDATE);
    assert.ok(this.container.settingsUpdate.calledOnce);
  });

  it('listens to playback:loadedmetadata event', () => {
    sinon.spy(this.container, 'loadedMetadata');
    this.container.bindEvents();
    this.playback.trigger(Events.PLAYBACK_LOADEDMETADATA);
    assert.ok(this.container.loadedMetadata.calledOnce);
  });

  it('listens to playback:highdefinitionupdate event', () => {
    sinon.spy(this.container, 'highDefinitionUpdate');
    this.container.bindEvents();
    this.playback.trigger(Events.PLAYBACK_HIGHDEFINITIONUPDATE);
    assert.ok(this.container.highDefinitionUpdate.calledOnce);
  });

  it('listens to playback:mediacontrol:disable event', () => {
    sinon.spy(this.container, 'disableMediaControl');
    this.container.bindEvents();
    this.playback.trigger(Events.PLAYBACK_MEDIACONTROL_DISABLE);
    assert.ok(this.container.disableMediaControl.calledOnce);
  });

  it('listens to playback:mediacontrol:enable event', () => {
    sinon.spy(this.container, 'enableMediaControl');
    this.container.bindEvents();
    this.playback.trigger(Events.PLAYBACK_MEDIACONTROL_ENABLE);
    assert.ok(this.container.enableMediaControl.calledOnce);
  });

  it('listens to playback:ended event', () => {
    sinon.spy(this.container, 'ended');
    this.container.bindEvents();
    this.playback.trigger(Events.PLAYBACK_ENDED);
    assert.ok(this.container.ended.calledOnce);
  });

  it('listens to playback:play event', () => {
    sinon.spy(this.container, 'playing');
    this.container.bindEvents();
    this.playback.trigger(Events.PLAYBACK_PLAY);
    assert.ok(this.container.playing.calledOnce);
  });
});
