// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The Core is responsible to manage Containers, the mediator, MediaControl
 * and the player state.
 */

var assign = require('lodash.assign')
var $ = require('clappr-zepto')

var UIObject = require('../../base/ui_object')
var ContainerFactory = require('../container_factory')
var Fullscreen = require('../../base/utils').Fullscreen
var Styler = require('../../base/styler')
var MediaControl = require('../media_control')
var PlayerInfo = require('../player_info')
var Mediator = require('../mediator')
var Events = require('../../base/events')
var Browser = require('../browser')

var find = require('lodash.find')
var isNumber = require('../../base/utils').isNumber
var requestAnimationFrame = require('../../base/utils').requestAnimationFrame
var cancelAnimationFrame = require('../../base/utils').cancelAnimationFrame

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
      'data-player': '',
      tabindex: 9999,
    }
  }

  constructor(options) {
    super(options)
    this.playerInfo = PlayerInfo.getInstance(options.playerId)
    this.options = options
    this.plugins = []
    this.containers = []
    this.createContainers(options)
    //FIXME fullscreen api sucks
    $(document).bind('fullscreenchange', () => this.exit())
    $(document).bind('MSFullscreenChange', () => this.exit())
    $(document).bind('mozfullscreenchange', () => this.exit())
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
    Mediator.trigger(Events.PLAYER_RESIZE, this.playerInfo.currentSize)
  }

  setFullscreen() {
    if(!Browser.isiOs) {
      this.$el.addClass('fullscreen')
      this.$el.removeAttr('style')
      this.playerInfo.previousSize = this.playerInfo.currentSize
      this.playerInfo.currentSize = { width: $(window).width(), height: $(window).height() }
    }
  }

  setPlayerSize() {
    this.$el.removeClass('fullscreen')
    this.playerInfo.currentSize = this.playerInfo.previousSize
    this.playerInfo.previousSize = { width: $(window).width(), height: $(window).height() }
    this.resize(this.playerInfo.currentSize)
  }

  resize(options) {
    if (!isNumber(options.height) && !isNumber(options.width))  {
      this.el.style.height = `${options.height}`;
      this.el.style.width = `${options.width}`;
    } else {
      this.el.style.height = `${options.height}px`;
      this.el.style.width = `${options.width}px`;
    }
    this.playerInfo.previousSize = this.playerInfo.currentSize
    this.playerInfo.currentSize = options
    Mediator.trigger(Events.PLAYER_RESIZE, this.playerInfo.currentSize)
  }

  enableResizeObserver() {
    var checkSizeCallback = () => {
      if (this.reqAnimFrame) cancelAnimationFrame(this.reqAnimFrame)
      if (this.previousSize.width != this.$el.width() ||
          this.previousSize.height != this.$el.height()) {
        this.playerInfo.computedSize = { width: this.$el.width(), height: this.$el.height() }
        Mediator.trigger(Events.PLAYER_RESIZE, this.playerInfo.computedSize)
      }
      this.reqAnimFrame = requestAnimationFrame(checkSizeCallback)
    }
    this.reqAnimFrame = requestAnimationFrame(checkSizeCallback)
  }

  disableResizeObserver() {
    if (this.reqAnimFrame) cancelAnimationFrame(this.reqAnimFrame)
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
    return find(this.plugins, (plugin) => plugin.name === name)
  }

  load(sources, mimeType) {
    this.options.mimeType = mimeType
    sources = sources && sources.constructor === Array ? sources : [sources.toString()];
    this.containers.forEach((container) => container.destroy())
    this.containerFactory.options = assign(this.options, {sources})
    this.containerFactory.createContainers().then((containers) => {
      this.setupContainers(containers)
    })
  }

  destroy() {
    this.disableResizeObserver()
    this.containers.forEach((container) => container.destroy())
    this.plugins.forEach((plugin) => plugin.destroy())
    this.$el.remove()
    this.mediaControl.destroy()
    $(document).unbind('fullscreenchange')
    $(document).unbind('MSFullscreenChange')
    $(document).unbind('mozfullscreenchange')
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
    this.containers = this.containers.filter((c) => c !== container)
  }

  appendContainer(container) {
    this.listenTo(container, Events.CONTAINER_DESTROYED, this.removeContainer)
    this.el.appendChild(container.render().el)
    this.containers.push(container)
  }

  setupContainers(containers) {
    containers.map(this.appendContainer.bind(this))
    this.setupMediaControl(this.getCurrentContainer())
    this.render()
    this.$el.appendTo(this.options.parentElement)
    return containers
  }

  createContainer(source, options) {
    var container = this.containerFactory.createContainer(source, options)
    this.appendContainer(container)
    return container
  }

  setupMediaControl(container) {
    if (this.mediaControl) {
      this.mediaControl.setContainer(container)
    } else {
      this.mediaControl = this.createMediaControl(assign({container: container, focusElement: this.el}, this.options))
      this.listenTo(this.mediaControl, Events.MEDIACONTROL_FULLSCREEN, this.toggleFullscreen)
      this.listenTo(this.mediaControl, Events.MEDIACONTROL_SHOW, this.onMediaControlShow.bind(this, true))
      this.listenTo(this.mediaControl, Events.MEDIACONTROL_HIDE, this.onMediaControlShow.bind(this, false))
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
    if (!this.mediacontrol) {
      return this.containers[0]
    }
    return this.mediaControl.container
  }

  getPlaybackType() {
    return this.getCurrentContainer().getPlaybackType()
  }

  toggleFullscreen() {
    if (!Fullscreen.isFullscreen()) {
      Fullscreen.requestFullscreen(this.el)
      if(!Browser.isiOs) {
        this.$el.addClass('fullscreen')
      }
    } else {
      Fullscreen.cancelFullscreen()
      if(!Browser.isiOs) {
        this.$el.removeClass('fullscreen nocursor')
      }
    }
    this.mediaControl.show()
  }

  showMediaControl(event) {
    this.mediaControl.show(event)
  }

  hideMediaControl(event) {
    this.mediaControl.hide(this.options.hideMediaControlDelay)
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

    this.options.width = this.options.width || this.$el.width()
    this.options.height = this.options.height || this.$el.height()
    var size = {width: this.options.width, height: this.options.height}
    this.playerInfo.previousSize = this.playerInfo.currentSize = this.playerInfo.computedSize = size
    this.updateSize()

    this.previousSize = { width: this.$el.width(), height: this.$el.height() }

    this.enableResizeObserver()

    return this
  }
}

module.exports = Core
