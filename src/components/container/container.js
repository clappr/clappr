// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * Container is responsible for the video rendering and state
 */

var UIObject = require('ui_object');
var Styler = require('../../base/styler');
var _ = require('underscore');
var Events = require('../../base/events')

class Container extends UIObject {
  get name() { return 'Container' }
  get attributes() { return { class: 'container', 'data-container': '' } }
  get events() { return {'click': 'clicked'} }

  constructor(options) {
    super(options);
    this.playback = options.playback;
    this.settings = this.playback.settings;
    this.isReady = false;
    this.mediaControlDisabled = false;
    this.plugins = [this.playback];
    this.bindEvents();
  }

  bindEvents() {
    this.listenTo(this.playback, Events.PLAYBACK_PROGRESS, this.progress);
    this.listenTo(this.playback, Events.PLAYBACK_TIMEUPDATE, this.timeUpdated);
    this.listenTo(this.playback, Events.PLAYBACK_READY, this.ready);
    this.listenTo(this.playback, Events.PLAYBACK_BUFFERING, this.buffering);
    this.listenTo(this.playback, Events.PLAYBACK_BUFFERFULL, this.bufferfull);
    this.listenTo(this.playback, Events.PLAYBACK_SETTINGSUPDATE, this.settingsUpdate);
    this.listenTo(this.playback, Events.PLAYBACK_LOADEDMETADATA, this.loadedMetadata);
    this.listenTo(this.playback, Events.PLAYBACK_HIGHDEFINITIONUPDATE, this.highDefinitionUpdate);
    this.listenTo(this.playback, Events.PLAYBACK_BITRATE, this.updateBitrate);
    this.listenTo(this.playback, Events.PLAYBACK_PLAYBACKSTATE, this.playbackStateChanged);
    this.listenTo(this.playback, Events.PLAYBACK_DVR, this.playbackDvrStateChanged);
    this.listenTo(this.playback, Events.PLAYBACK_MEDIACONTROL_DISABLE, this.disableMediaControl);
    this.listenTo(this.playback, Events.PLAYBACK_MEDIACONTROL_ENABLE, this.enableMediaControl);
    this.listenTo(this.playback, Events.PLAYBACK_ENDED, this.ended);
    this.listenTo(this.playback, Events.PLAYBACK_PLAY, this.playing);
    this.listenTo(this.playback, Events.PLAYBACK_ERROR, this.error);
  }

  with(klass) {
    _.extend(this, klass);
    return this;
  }

  playbackStateChanged() {
    this.trigger(Events.CONTAINER_PLAYBACKSTATE);
  }

  playbackDvrStateChanged(dvrInUse) {
    this.settings = this.playback.settings
    this.dvrInUse = dvrInUse
    this.trigger(Events.CONTAINER_PLAYBACKDVRSTATECHANGED, dvrInUse)
  }

  updateBitrate(newBitrate) {
    this.trigger(Events.CONTAINER_BITRATE, newBitrate)
  }

  statsReport(metrics) {
    this.trigger(Events.CONTAINER_STATS_REPORT, metrics)
  }

  getPlaybackType() {
    return this.playback.getPlaybackType()
  }

  isDvrEnabled() {
    return !!this.playback.dvrEnabled
  }

  isDvrInUse() {
    return !!this.dvrInUse
  }

  destroy() {
    this.trigger(Events.CONTAINER_DESTROYED, this, this.name);
    this.playback.destroy();
    _(this.plugins).each((plugin) => plugin.destroy())
    this.$el.remove();
  }

  setStyle(style) {
    this.$el.css(style);
  }

  animate(style, duration) {
    return this.$el.animate(style, duration).promise();
  }

  ready() {
    this.isReady = true;
    this.trigger(Events.CONTAINER_READY, this.name);
  }

  isPlaying() {
    return this.playback.isPlaying();
  }

  getDuration() {
    return this.playback.getDuration();
  }

  error(errorObj) {
    this.$el.append(errorObj.render().el)
    this.trigger(Events.CONTAINER_ERROR, {error: errorObj, container: this}, this.name);
  }

  loadedMetadata(duration) {
    this.trigger(Events.CONTAINER_LOADEDMETADATA, duration);
  }

  timeUpdated(position, duration) {
    this.trigger(Events.CONTAINER_TIMEUPDATE, position, duration, this.name);
  }

  progress(startPosition, endPosition, duration) {
    this.trigger(Events.CONTAINER_PROGRESS, startPosition, endPosition, duration, this.name);
  }

  playing() {
    this.trigger(Events.CONTAINER_PLAY, this.name);
  }

  play() {
    this.playback.play();
  }

  stop() {
    this.trigger(Events.CONTAINER_STOP, this.name);
    this.playback.stop();
  }

  pause() {
    this.trigger(Events.CONTAINER_PAUSE, this.name);
    this.playback.pause();
  }

  ended() {
    this.trigger(Events.CONTAINER_ENDED, this, this.name);
  }

  clicked() {
    this.trigger(Events.CONTAINER_CLICK, this, this.name);
  }

  setCurrentTime(time) {
    this.trigger(Events.CONTAINER_SEEK, time, this.name);
    this.playback.seek(time);
  }

  setVolume(value) {
    this.trigger(Events.CONTAINER_VOLUME, value, this.name);
    this.playback.volume(value);
  }

  fullscreen() {
    this.trigger(Events.CONTAINER_FULLSCREEN, this.name);
  }

  buffering() {
    this.trigger(Events.CONTAINER_STATE_BUFFERING, this.name);
  }

  bufferfull() {
    this.trigger(Events.CONTAINER_STATE_BUFFERFULL, this.name);
  }

  addPlugin(plugin) {
    this.plugins.push(plugin);
  }

  hasPlugin(name) {
    return !!this.getPlugin(name);
  }

  getPlugin(name) {
    return _(this.plugins).find(function(plugin) { return plugin.name === name });
  }

  settingsUpdate() {
    this.settings = this.playback.settings;
    this.trigger(Events.CONTAINER_SETTINGSUPDATE);
  }

  highDefinitionUpdate() {
    this.trigger(Events.CONTAINER_HIGHDEFINITIONUPDATES);
  }

  isHighDefinitionInUse() {
    return this.playback.isHighDefinitionInUse()
  }

  disableMediaControl() {
    this.mediaControlDisabled = true;
    this.trigger(Events.CONTAINER_MEDIACONTROL_DISABLE);
  }

  enableMediaControl() {
    this.mediaControlDisabled = false;
    this.trigger(Events.CONTAINER_MEDIACONTROL_ENABLE);
  }

  render() {
    var style = Styler.getStyleFor('container');
    this.$el.append(style);
    this.$el.append(this.playback.render().el);
    return this;
  }
}

module.exports = Container;
