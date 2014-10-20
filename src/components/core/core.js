// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The Core is responsible to manage Containers, the mediator, MediaControl
 * and the player state.
 */

var _ = require('underscore')
var $ = require('jquery')

var UIObject = require('../../base/ui_object')
var ContainerFactory = require('../container_factory')
var Fullscreen = require('../../base/utils').Fullscreen
var Styler = require('../../base/styler')
var MediaControl = require('../media_control')
var PlayerInfo = require('../player_info')
var Mediator = require('../mediator')

class Core extends UIObject {
  get events() {
    return {
      'webkitfullscreenchange': 'exit',
      'mousemove': 'showMediaControl',
      'mouseleave': 'hideMediaControl'
    }
  }

  get attributes() {
    return {
      'data-player': ''
    }
  }

  constructor(options) {
    super(options)
    PlayerInfo.options = options
    this.options = options
    this.plugins = []
    this.containers = []
    this.createContainers(options)
    //FIXME fullscreen api sucks
    document.addEventListener('fullscreenchange', () => this.exit())
    document.addEventListener('MSFullscreenChange', () => this.exit())
    document.addEventListener('mozfullscreenchange', () => this.exit())
    $(window).resize(() => this.updateSize())
  }

  createContainers(options) {
    this.defer = $.Deferred()
    this.defer.promise(this)
    this.containerFactory = new ContainerFactory(options, options.loader)
    this.containerFactory
      .createContainers()
      .then((containers) => this.setupContainers(containers))
      .then((containers) => this.resolveOnContainersReady(containers))
  }

  updateSize() {
    if (Fullscreen.isFullscreen()) {
      this.setFullscreen()
    } else {
      this.setPlayerSize()
    }
    Mediator.trigger('player:resize')
  }

  setFullscreen() {
    this.$el.addClass('fullscreen')
    this.$el.removeAttr('style')
    PlayerInfo.currentSize = { width: $(window).width(), height: $(window).height() }
  }

  resize(height, width) {
    var size = { width: width, height: height }
    this.$el.css(size)
    PlayerInfo.currentSize = size
    Mediator.trigger('player:resize', size)
  }

  setPlayerSize() {
    var hasStretchParams = !!this.options.stretchWidth && !!this.options.stretchHeight
    var canStretch = this.options.stretchWidth <= $(window).width() && this.options.stretchHeight <= ($(window).height() * 0.73)
    var width, height
    if (hasStretchParams && canStretch) {
      [width, height] = [this.options.stretchWidth, this.options.stretchHeight]
    } else {
      [width, height] = [this.options.width, this.options.height]
    }
    this.$el.css({ width: width, height: height })
    this.$el.removeClass('fullscreen')
    PlayerInfo.currentSize = { width: width, height: height }
  }

  resolveOnContainersReady(containers) {
    $.when.apply($, containers).done(() =>this.defer.resolve(this))
  }

  addPlugin(plugin) {
    this.plugins.push(plugin)
  }

  hasPlugin(name) {
    return !!this.getPlugin(name)
  }

  getPlugin(name) {
    return _(this.plugins).find((plugin) => plugin.name === name)
  }

  load(sources) {
    sources = _.isString(sources) ? [sources]: sources;
    _(this.containers).each((container) => container.destroy())
    this.containerFactory.options = _(this.options).extend({sources})
    this.containerFactory.createContainers().then((containers) => this.setupContainers(containers))
  }

  destroy() {
    _(this.containers).each((container) => container.destroy())
    this.$el.remove()
  }

  exit() {
    this.updateSize()
    this.mediaControl.show()
  }

  setMediaControlContainer(container) {
    this.mediaControl.setContainer(container)
    this.mediaControl.render()
  }

  disableMediaControl() {
    this.mediaControl.disable()
    this.$el.removeClass('nocursor')
  }

  enableMediaControl() {
    this.mediaControl.enable()
  }

  removeContainer(container) {
    this.stopListening(container)
    this.containers = _.without(this.containers, container)
  }

  appendContainer(container) {
    this.listenTo(container, 'container:destroyed', this.removeContainer)
    this.el.appendChild(container.render().el)
    this.containers.push(container)
  }

  prependContainer(container) {
    this.listenTo(container, 'container:destroyed', this.removeContainer)
    this.$el.append(container.render().el)
    this.containers.unshift(container)
  }

  setupContainers(containers) {
    _.map(containers, this.appendContainer, this)
    this.setupMediaControl(this.getCurrentContainer())
    this.render()
    this.$el.appendTo(this.options.parentElement)
    return containers
  }

  createContainer(source) {
    var container = this.containerFactory.createContainer(source)
    this.appendContainer(container)
    return container
  }

  setupMediaControl(container) {
    if (this.mediaControl) {
      this.mediaControl.setContainer(container)
    } else {
      this.mediaControl = this.createMediaControl(_.extend({container: container}, this.options))
      this.listenTo(this.mediaControl, 'mediacontrol:fullscreen', this.toggleFullscreen)
      this.listenTo(this.mediaControl, 'mediacontrol:show', this.onMediaControlShow.bind(this, true))
      this.listenTo(this.mediaControl, 'mediacontrol:hide', this.onMediaControlShow.bind(this, false))
    }
  }

  createMediaControl(options) {
    if(options.mediacontrol && options.mediacontrol.external) {
      return new options.mediacontrol.external(options);
    } else {
      return new MediaControl(options);
    }
  }

  getCurrentContainer() {
    return this.containers[0]
  }

  toggleFullscreen() {
    if (!Fullscreen.isFullscreen()) {
      Fullscreen.requestFullscreen(this.el)
      this.$el.addClass('fullscreen')
    } else {
      Fullscreen.cancelFullscreen()
      this.$el.removeClass('fullscreen nocursor')
    }
    this.mediaControl.show()
  }

  showMediaControl(event) {
    this.mediaControl.show(event)
  }

  hideMediaControl(event) {
    this.mediaControl.hide(event)
  }

  onMediaControlShow(showing) {
    if (showing)
      this.$el.removeClass('nocursor')
    else if (Fullscreen.isFullscreen())
      this.$el.addClass('nocursor')
  }

  render() {
    var style = Styler.getStyleFor('core')
    //FIXME
    //this.$el.empty()
    this.$el.append(style)
    this.$el.append(this.mediaControl.render().el)

    this.$el.ready(() => {
      this.options.width = this.options.width || this.$el.width()
      this.options.height = this.options.height || this.$el.height()
      this.updateSize()
    })

    return this
  }
}

module.exports = Core
