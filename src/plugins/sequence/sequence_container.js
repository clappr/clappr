var BaseObject = require('../../base/base_object');
var _ = require('underscore');

var SequenceContainer = BaseObject.extend({
  name: 'SequenceContainer',
  initialize: function(containers) {
    this.containers = containers;
    this.plugins = [];
    this.containersRange = [];
    this.currentContainer = 0;
    this.checkpoint = 0;
    this.duration = 0;
    _.each(this.containers, this._setupContainers, this);
    this.containersToSetup = this.containers.length;
    this._bindChildEvents(this.getCurrentContainer());
    this.getCurrentContainer().$el.show();
    this.settings = this.getCurrentContainer().settings;
  },
  _bindChildEvents: function(container) {
    this.listenTo(container, 'container:ended', this.playNextContainer);
    this.listenTo(container, 'container:timeupdate', this.timeUpdateProxy);
    this.listenTo(container, 'container:progress', this.progressProxy);
  },
  _setupContainers: function(container) {
    container.$el.hide();
    this._injectInChildPlugins(container.plugins);
    this.listenTo(container, 'container:loadedmetadata', this._setupDuration);
  },
  _injectInChildPlugins: function(plugins) {
    _.each(plugins, function(plugin) {
      plugin.stopListening();
      plugin.container = this;
      plugin.bindEvents();
    }, this);
  },
  _setupDuration: function(duration) {
    this.duration += duration;
    this.trigger('container:timeupdate', 0, this.duration);
    if(--this.containersToSetup === 0) {
      this._setupSeek();
    }
  },
  _setupSeek: function() {
    _.each(this.containers, function(container) {
      var containerDuration = container.playback.getDuration();
      var totalPercent = (containerDuration * 100)  / this.duration;
      this.containersRange.push(totalPercent);
    }, this);
  },
  getPlaybackType: function() {
    return this.getCurrentContainer().getPlaybackType();
  },
  length: function() {
    return this.containers.length;
  },
  playNextContainer: function() {
    this.getCurrentContainer().$el.hide();
    this.stopListening(this.getCurrentContainer());
    var nextContainer = this.getNextContainer();
    this.trigger('container:next', this.currentContainer);
    this._bindChildEvents(nextContainer);
    if(this.currentContainer === 0) {
      this.checkpoint = 0;
      nextContainer.$el.show();
      this.trigger('container:ended');
      nextContainer.stop();
    } else {
      nextContainer.play();
      this.trigger('container:play');
      this.trigger('container:settingsupdate');
      this.trigger('container:timeupdate', this.checkpoint, this.duration);
      nextContainer.$el.show();
    }
  },
  timeUpdateProxy: function(position, duration) {
    this.trigger('container:timeupdate', position + this.checkpoint, this.duration, this.name);
  },
  progressProxy: function(startPosition, endPosition, duration) {
    this.trigger('container:progress', startPosition, endPosition, this.duration, this.name);
  },
  getCurrentContainer: function() {
    return this.containers[this.currentContainer];
  },
  getNextContainer: function() {
    this.checkpoint += this.getCurrentContainer().playback.getDuration();
    this.currentContainer = ++this.currentContainer % this.containers.length;
    var nextContainer = this.containers[this.currentContainer];
    this.settings = nextContainer.settings;
    return nextContainer;
  },
  play: function() {
    this.getCurrentContainer().playback.play();
    this.trigger('container:play', this.name);
  },
  setVolume: function(value) {
    this.trigger('container:volume', value, this.name);
    this.getCurrentContainer().setVolume(value);
  },
  pause: function() {
    this.getCurrentContainer().pause();
    this.trigger('container:pause', this.name);
  },
  stop: function() {
    this.getCurrentContainer().stop();
    this.trigger('container:stop', this.name);
  },
  playing: function() {
    this.trigger('container:playing', this.name);
  },
  progress: function(startPosition, endPosition, duration) {
    this.trigger('container:progress', startPosition, endPosition, duration);
  },
  _matchContainerIndex: function(percent) {
    var total = 0;
    for(var i = 0, l = this.containers.length; i < l; i++) {
      total += this.containersRange[i];
      if(total >= percent) {
        return i;
      }
    }
    return this.containers.length - 1;
  },
  jumpToContainer: function(index) {
    if(index === 0) {
      this.seekToContainer(index, 0);
    } else {
      var value = _.reduce(this.containersRange.slice(0, index), function(total, percent) { return total + percent });
      this.seekToContainer(index, value);
    }
  },
  setCurrentTime: function(time) {
    var containerIndex = this._matchContainerIndex(time);
    this.seekToContainer(containerIndex, time);
  },
  seekToContainer: function(containerIndex, time) {
    if(containerIndex === 0) {
      this.checkpoint = 0;
    } else {
      var slice = this.containers.slice(0, containerIndex);
      this.checkpoint = _.reduce(slice, function(duration, container) {
        return duration + container.playback.getDuration();
      }, 0);
      var pastRange = _.reduce(this.containersRange.slice(0, containerIndex), function(total, percent) {
        return percent + total;
      }, 0);
      time = time - pastRange;
    }
    var containerSeek = time * 100 / this.containersRange[containerIndex];
    var currentContainer = this.getCurrentContainer();
    currentContainer.$el.hide();
    this.stopListening(currentContainer);
    currentContainer.stop();
    this.currentContainer = containerIndex;
    var newContainer = this.containers[containerIndex];
    this.listenTo(newContainer, 'container:ended', this.playNextContainer);
    this.listenTo(newContainer, 'container:timeupdate', this.timeUpdateProxy);
    this.listenTo(newContainer, 'container:progress', this.progressProxy);
    newContainer.play();
    this.trigger('container:settingsupdate');
    this.trigger('container:play');
    newContainer.setCurrentTime(containerSeek);
    newContainer.$el.show();
  },
  settingsUpdate: function() {
    this.settings = this.getCurrentContainer().settings;
    this.trigger('container:settingsupdate');
  },
  isPlaying: function() {
    return this.getCurrentContainer().isPlaying();
  },
  render: function() {
    this.el = _.map(this.containers, function(container) {
      return container.render().el;
    });
    return this;
  }
});

module.exports = SequenceContainer;

