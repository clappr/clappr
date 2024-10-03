// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import $ from 'clappr-zepto'
import { Fullscreen, DomRecycler } from '../../utils/utils'
import Styler from '../../base/styler/styler'
import Events from '../../base/events/events'
import UIObject from '../../base/ui_object/ui_object'
import UICorePlugin from '../../base/ui_core_plugin/ui_core_plugin'
import Browser from '../browser/browser'
import ContainerFactory from '../container_factory/container_factory'
import PlayerError from '../error/error'
import ErrorMixin from '../../base/error_mixin/error_mixin'
import CoreStyle from './public/style.scss'
import ResetStyle from './public/optional_reset.scss'

/**
 * The Core is responsible to manage Containers and the player state.
 * @class Core
 * @constructor
 * @extends UIObject
 * @module components
 */
export default class Core extends UIObject {
  get events() {
    return {
      'webkitfullscreenchange': 'handleFullscreenChange',
      'mousemove': 'onMouseMove',
      'mouseleave': 'onMouseLeave'
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

  /**
   * The internationalization plugin.
   * @property i18n
   * @type {Strings}
   */
  get i18n() {
    return this.getPlugin('strings') || { t: (key) => key }
  }

  /**
   * @deprecated
   * This property currently exists for backward compatibility reasons.
   * If you need to access the media control instance, use the method getPlugin('media_control').
   * This approach is still not recommended.
   */
  get mediaControl() {
    return this._mediaControl || (this._mediaControl = this.getPlugin('media_control')) || this.dummyMediaControl
  }

  get dummyMediaControl() {
    if (this._dummyMediaControl) return this._dummyMediaControl
    this._dummyMediaControl = new UICorePlugin(this)
    return this._dummyMediaControl
  }

  /**
   * gets the active container reference.
   * @property activeContainer
   * @type {Object}
   */
  get activeContainer() {
    return this._activeContainer
  }

  /**
   * sets the active container reference and trigger a event with the new reference.
   * @property activeContainer
   * @type {Object}
   */
  set activeContainer(container) {
    this._activeContainer = container
    this.trigger(Events.CORE_ACTIVE_CONTAINER_CHANGED, this._activeContainer)
  }

  /**
   * gets the active playback reference.
   * @property activePlayback
   * @type {Object}
   */
  get activePlayback() {
    return this.activeContainer && this.activeContainer.playback
  }

  /**
   * gets the active playback's video element.
   * @property activePlaybackEl
   * @type {Object}
   */
  get activePlaybackEl() {
    if (!this.activePlayback) return undefined
    return this.activePlayback.$el ? this.activePlayback.$el.find('video')[0] : this.activePlayback.el
  }

  constructor(options) {
    super(options)
    this.playerError = new PlayerError(options, this)
    this.configureDomRecycler()
    this.firstResize = true
    this.styleRendered = false
    this.plugins = []
    this.containers = []
    //FIXME fullscreen api sucks
    this._boundFullscreenHandler = () => this.handleFullscreenChange()
    this._boundHandleWindowResize = (o) => this.handleWindowResize(o)
    $(document).bind('fullscreenchange', this._boundFullscreenHandler)
    $(document).bind('MSFullscreenChange', this._boundFullscreenHandler)
    $(document).bind('mozfullscreenchange', this._boundFullscreenHandler)
    Browser.isMobile && $(window).bind('resize', this._boundHandleWindowResize)
  }

  configureDomRecycler() {
    let recycleVideo = this.options && this.options.playback && this.options.playback.recycleVideo
    DomRecycler.configure({ recycleVideo })
  }

  createContainers(options) {
    this.defer = $.Deferred()
    this.defer.promise(this)
    this.containerFactory = new ContainerFactory(options, options.loader, this.i18n, this.playerError)
    this.prepareContainers()
  }

  prepareContainers() {
    this.containerFactory.createContainers()
      .then((containers) => this.setupContainers(containers))
      .then((containers) => this.resolveOnContainersReady(containers))
  }

  updateSize() {
    this.isFullscreen() ? this.setFullscreen() : this.setPlayerSize()
  }

  setFullscreen() {
    if (!Browser.isiOS) {
      this.$el.addClass('fullscreen')
      this.$el.removeAttr('style')
      this.previousSize = { width: this.options.width, height: this.options.height }
      this.currentSize = { width: $(window).width(), height: $(window).height() }
    }
  }

  setPlayerSize() {
    this.$el.removeClass('fullscreen')
    this.currentSize = this.previousSize
    this.previousSize = { width: $(window).width(), height: $(window).height() }
    this.resize(this.currentSize)
  }

  /**
   * method called before resize the element
   * @method onResize
   * @param {Object} options the options object
   * @return {UIObject} itself
   */
  onResize(options) {
    this.previousSize = { width: this.options.width, height: this.options.height }
    this.options.width = options.width
    this.options.height = options.height
    this.currentSize = options
    this.triggerResize(this.currentSize)
    return this
  }

  enableResizeObserver() {
    this.disableResizeObserver()
    const checkSizeCallback = () => {
      this.triggerResize({ width: this.el.clientWidth, height: this.el.clientHeight })
    }
    this.resizeObserverInterval = setInterval(checkSizeCallback, 500)
  }

  triggerResize(newSize) {
    const thereWasChange = this.firstResize || this.oldHeight !== newSize.height || this.oldWidth !== newSize.width
    if (!thereWasChange) return
    this.oldHeight = newSize.height
    this.oldWidth = newSize.width
    this.computedSize = newSize
    this.firstResize = false
    this.trigger(Events.CORE_RESIZE, newSize)
  }

  disableResizeObserver() {
    this.resizeObserverInterval && clearInterval(this.resizeObserverInterval)
    this.resizeObserverInterval = null
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
    return this.plugins.filter(plugin => plugin.name === name)[0]
  }

  load(sources, mimeType) {
    this.options.mimeType = mimeType
    sources = sources && sources.constructor === Array ? sources : [sources]
    this.options.sources = sources
    this.containers.forEach((container) => container.destroy())
    this.containerFactory.options = $.extend(true, this.options, { sources })
    this.prepareContainers()
  }

  destroy() {
    this.disableResizeObserver()
    this.containers.forEach((container) => container.destroy())
    this.plugins.forEach((plugin) => plugin.destroy())
    this.$el.remove()
    $(document).unbind('fullscreenchange', this._boundFullscreenHandler)
    $(document).unbind('MSFullscreenChange', this._boundFullscreenHandler)
    $(document).unbind('mozfullscreenchange', this._boundFullscreenHandler)
    Browser.isMobile && $(window).unbind('resize', this._boundHandleWindowResize)
    this.stopListening()
    this.undelegateEvents()
  }

  handleFullscreenChange() {
    this.trigger(Events.CORE_FULLSCREEN, this.isFullscreen())
    this.updateSize()
  }

  handleWindowResize(event) {
    const orientation = (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait'
    if (this._screenOrientation === orientation) return
    this._screenOrientation = orientation
    this.triggerResize({ width: this.el.clientWidth, height: this.el.clientHeight })
    this.trigger(Events.CORE_SCREEN_ORIENTATION_CHANGED, {
      event: event,
      orientation: this._screenOrientation
    })
  }

  removeContainer(container) {
    this.stopListening(container)
    this.containerFactory.stopListening(container)
    this.containers = this.containers.filter((c) => c !== container)
  }

  setupContainer(container) {
    this.listenTo(container, Events.CONTAINER_DESTROYED, this.removeContainer)
    this.containers.push(container)
  }

  setupContainers(containers) {
    containers.forEach(this.setupContainer.bind(this))
    this.trigger(Events.CORE_CONTAINERS_CREATED)
    this.renderContainers()
    this.activeContainer = containers[0]
    this.render()
    this.appendToParent()
    return this.containers
  }

  renderContainers() {
    this.containers.forEach((container) => this.el.appendChild(container.render().el))
  }

  createContainer(source, options) {
    const container = this.containerFactory.createContainer(source, options)
    this.setupContainer(container)
    this.el.appendChild(container.render().el)
    return container
  }

  /**
   * @deprecated
   * This method currently exists for retrocompatibility reasons.
   * If you want the current container reference, use the activeContainer getter.
   */
  getCurrentContainer() {
    return this.activeContainer
  }

  /**
   * @deprecated
   * This method currently exists for retrocompatibility reasons.
   * If you want the current playback reference, use the activePlayback getter.
   */
  getCurrentPlayback() {
    return this.activePlayback
  }

  getPlaybackType() {
    return this.activeContainer && this.activeContainer.getPlaybackType()
  }

  isFullscreen() {
    const fullscreenElement = Fullscreen.fullscreenElement()

    return fullscreenElement && (fullscreenElement === this.el)
      || fullscreenElement && (fullscreenElement === this.activePlaybackEl)
      || this.activePlaybackEl && this.activePlaybackEl.webkitDisplayingFullscreen
      || false
  }

  toggleFullscreen() {
    if (this.isFullscreen()) {
      const fullscreenEl = Browser.isiOS ? this.activePlaybackEl : document
      Fullscreen.cancelFullscreen(fullscreenEl)
      !Browser.isiOS && this.$el.removeClass('fullscreen nocursor')
    } else {
      const fullscreenEl = Browser.isiOS ? this.activePlaybackEl : this.el
      if (!fullscreenEl) return

      (Browser.isSafari || Browser.isiOS) // Safari doesn't return a promise like the other browsers. See more in https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen
        ? Fullscreen.requestFullscreen(fullscreenEl)
        : Fullscreen.requestFullscreen(fullscreenEl).then(
          _ => _,
          error => setTimeout(() => {  // fixes the issue https://github.com/clappr/clappr/issues/1860
            if (!this.isFullscreen()) throw new ReferenceError(error)
          }, 600),
        )

      !Browser.isiOS && this.$el.addClass('fullscreen')
    }
  }

  onMouseMove(event) {
    this.trigger(Events.CORE_MOUSE_MOVE, event)
  }

  onMouseLeave(event) {
    this.trigger(Events.CORE_MOUSE_LEAVE, event)
  }

  /**
   * enables to configure the container after its creation
   * @method configure
   * @param {Object} options all the options to change in form of a javascript object
   */
  configure(options) {
    this._options = $.extend(true, this._options, options)
    this.configureDomRecycler()

    const sources = options.source || options.sources
    sources && this.load(sources, options.mimeType || this.options.mimeType)

    this.trigger(Events.CORE_OPTIONS_CHANGE, options) // Trigger with newly provided options
    this.containers.forEach((container) => container.configure(this.options))
  }

  appendToParent() {
    const hasCoreParent = this.$el.parent() && this.$el.parent().length
    !hasCoreParent && this.$el.appendTo(this.options.parentElement)
  }

  appendStyles() {
    if (this.styleRendered) return

    const style = Styler.getStyleFor(CoreStyle.toString(), { baseUrl: this.options.baseUrl })
    this.$el.append(style[0])
    if (this.options.includeResetStyle) {
      const resetStyle = Styler.getStyleFor(ResetStyle.toString(), { baseUrl: this.options.baseUrl })
      this.$el.append(resetStyle[0])
    }
    this.styleRendered = true
  }

  render() {
    this.appendStyles()
    this.options.width = this.options.width || this.$el.width()
    this.options.height = this.options.height || this.$el.height()
    const size = { width: this.options.width, height: this.options.height }
    this.previousSize = this.currentSize = this.computedSize = size
    this.updateSize()
    this.enableResizeObserver()

    return this
  }
}

Object.assign(Core.prototype, ErrorMixin)
