// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import {isNumber,Fullscreen} from 'base/utils'

import Events from 'base/events'
import Styler from 'base/styler'
import UIObject from 'base/ui_object'
import Browser from 'components/browser'
import ContainerFactory from 'components/container_factory'
import MediaControl from 'components/media_control'
import Mediator from 'components/mediator'
import PlayerInfo from 'components/player_info'

import find from 'lodash.find'
import $ from 'clappr-zepto'

import coreStyle from './public/style.scss'

/**
 * The Core is responsible to manage Containers, the mediator, MediaControl
 * and the player state.
 * @class Core
 * @constructor
 * @extends UIObject
 * @module components
 */
export default class Core extends UIObject {
  get events() {
    return {
      'webkitfullscreenchange': 'handleFullscreenChange',
      'mousemove': 'showMediaControl',
      'mouseleave': 'hideMediaControl'
    }
  }

  get attributes() {
    return {
      'data-player': '',
      tabindex: 9999
    }
  }

  /**
   * checks if the core is ready.
   * @property isReady
   * @type {Boolean} `true` if the core is ready, otherwise `false`
   */
  get isReady() {
    return !!this.ready
  }

  constructor(options) {
    super(options)
    this.playerInfo = PlayerInfo.getInstance(options.playerId)
    this.firstResize = true
    this.options = options
    this.plugins = []
    this.containers = []
    this.setupMediaControl(null)
    //FIXME fullscreen api sucks
    this._boundFullscreenHandler = () => this.handleFullscreenChange()
    $(document).bind('fullscreenchange', this._boundFullscreenHandler)
    $(document).bind('MSFullscreenChange', this._boundFullscreenHandler)
    $(document).bind('mozfullscreenchange', this._boundFullscreenHandler)
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
  }

  setFullscreen() {
    if(!Browser.isiOS) {
      this.$el.addClass('fullscreen')
      this.$el.removeAttr('style')
      this.playerInfo.previousSize = { width: this.options.width, height: this.options.height }
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
      this.el.style.height = `${options.height}`
      this.el.style.width = `${options.width}`
    } else {
      this.el.style.height = `${options.height}px`
      this.el.style.width = `${options.width}px`
    }
    this.playerInfo.previousSize = { width: this.options.width, height: this.options.height }
    this.options.width = options.width
    this.options.height = options.height
    this.playerInfo.currentSize = options
    this.triggerResize(this.playerInfo.currentSize)
  }

  enableResizeObserver() {
    var checkSizeCallback = () => {
      if (this.playerInfo.computedSize.width != this.el.clientWidth ||
          this.playerInfo.computedSize.height != this.el.clientHeight) {
        this.playerInfo.computedSize = { width: this.el.clientWidth, height: this.el.clientHeight }
        this.triggerResize(this.playerInfo.computedSize)
      }
    }
    this.resizeObserverInterval = setInterval(checkSizeCallback, 500)
  }

  triggerResize(newSize) {
    var thereWasChange = this.firstResize || this.oldHeight !== newSize.height || this.oldWidth !== newSize.width
    if (thereWasChange) {
      Mediator.trigger(`${this.options.playerId}:${Events.PLAYER_RESIZE}`, newSize)
      this.oldHeight = newSize.height
      this.oldWidth = newSize.width
      this.firstResize = false
    }
  }

  disableResizeObserver() {
    if (this.resizeObserverInterval) clearInterval(this.resizeObserverInterval)
  }

  resolveOnContainersReady(containers) {
    $.when.apply($, containers).done(() => {
      this.defer.resolve(this)
      this.ready = true
      this.trigger(Events.CORE_READY)
    })
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
    sources = sources && sources.constructor === Array ? sources : [sources]
    this.containers.forEach((container) => container.destroy())
    this.mediaControl.container = null
    this.containerFactory.options = $.extend(this.options, {sources})
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
    $(document).unbind('fullscreenchange', this._boundFullscreenHandler)
    $(document).unbind('MSFullscreenChange', this._boundFullscreenHandler)
    $(document).unbind('mozfullscreenchange', this._boundFullscreenHandler)
  }

  handleFullscreenChange() {
    this.trigger(Events.CORE_FULLSCREEN, Fullscreen.isFullscreen())
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
    this.containers.push(container)
  }

  setupContainers(containers) {
    containers.map(this.appendContainer.bind(this))
    this.trigger(Events.CORE_CONTAINERS_CREATED)
    this.renderContainers()
    this.setupMediaControl(this.getCurrentContainer())
    this.render()
    this.$el.appendTo(this.options.parentElement)
    return this.containers
  }

  renderContainers() {
    this.containers.map((container) => this.el.appendChild(container.render().el))
  }

  createContainer(source, options) {
    var container = this.containerFactory.createContainer(source, options)
    this.appendContainer(container)
    this.el.appendChild(container.render().el)
    return container
  }

  setupMediaControl(container) {
    if (this.mediaControl) {
      this.mediaControl.setContainer(container)
    } else {
      this.mediaControl = this.createMediaControl($.extend({container: container, focusElement: this.el}, this.options))
      this.listenTo(this.mediaControl, Events.MEDIACONTROL_FULLSCREEN, this.toggleFullscreen)
      this.listenTo(this.mediaControl, Events.MEDIACONTROL_SHOW, this.onMediaControlShow.bind(this, true))
      this.listenTo(this.mediaControl, Events.MEDIACONTROL_HIDE, this.onMediaControlShow.bind(this, false))
    }
  }

  createMediaControl(options) {
    if(options.mediacontrol && options.mediacontrol.external) {
      return new options.mediacontrol.external(options).render()
    } else {
      return new MediaControl(options).render()
    }
  }

  getCurrentContainer() {
    if (!this.mediaControl || !this.mediaControl.container) {
      return this.containers[0]
    }
    return this.mediaControl.container
  }

  getCurrentPlayback() {
    var container = this.getCurrentContainer()
    return container && container.playback
  }

  getPlaybackType() {
    var container = this.getCurrentContainer()
    return container && container.getPlaybackType()
  }

  toggleFullscreen() {
    if (!Fullscreen.isFullscreen()) {
      Fullscreen.requestFullscreen(this.el)
      if(!Browser.isiOS) {
        this.$el.addClass('fullscreen')
      }
    } else {
      Fullscreen.cancelFullscreen()
      if(!Browser.isiOS) {
        this.$el.removeClass('fullscreen nocursor')
      }
    }
    this.mediaControl.show()
  }

  showMediaControl(event) {
    this.mediaControl.show(event)
  }

  hideMediaControl() {
    this.mediaControl.hide(this.options.hideMediaControlDelay)
  }

  onMediaControlShow(showing) {
    this.getCurrentContainer().trigger(showing?Events.CONTAINER_MEDIACONTROL_SHOW:Events.CONTAINER_MEDIACONTROL_HIDE)

    if (showing)
      this.$el.removeClass('nocursor')
    else if (Fullscreen.isFullscreen())
      this.$el.addClass('nocursor')
  }

  /**
   * enables to configure the container after its creation
   * @method configure
   * @param {Object} options all the options to change in form of a javascript object
   */
  configure(options) {
    this.options = $.extend(this.options, options)
    var sources = options.source || options.sources

    if (sources) {
      this.load(sources, options.mimeType || this.options.mimeType)
    } else {
      this.trigger(Events.CORE_OPTIONS_CHANGE)

      this.containers.forEach((container) => {
        container.configure(this.options)
      })
    }
  }

  render() {
    var style = Styler.getStyleFor(coreStyle, {baseUrl: this.options.baseUrl})
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
