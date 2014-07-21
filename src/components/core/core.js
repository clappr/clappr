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
var Loader = require('../loader')
var Styler = require('../../base/styler')
var MediaControl = require('../media_control')

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

  initialize(params) {
    this.defer = $.Deferred()
    this.defer.promise(this)
    this.plugins = []
    this.containers = []
    this.params = params
    this.params.displayType || (this.params.displayType = 'pip')
    this.parentElement = params.parentElement
    this.loader = new Loader(params)
    this.containerFactory = new ContainerFactory(params, this.loader)
    this.containerFactory
      .createContainers()
      .then((containers) => this.setupContainers(containers))
      .then((containers) => this.resolveOnContainersReady(containers))
    this.updateSize()
    //FIXME fullscreen api sucks
    document.addEventListener('mozfullscreenchange', () => this.exit())
    $(window).resize(() => this.updateSize())
  }

  updateSize() {
   if (Fullscreen.isFullscreen()) {
      this.$el.addClass('fullscreen')
      this.$el.removeAttr('style')
    } else {
      var width = 0
      var height = 0
      if (this.params.stretchWidth && this.params.stretchHeight && this.params.stretchWidth <= window.innerWidth && this.params.stretchHeight <= (window.innerHeight * 0.73)) {
        width = this.params.stretchWidth
        height = this.params.stretchHeight
      } else {
        width = this.params.width || width
        height = this.params.height || height
      }
      if (width > 0) {
        this.$el.css({ width: width })
      }
      if (height > 0) {
        this.$el.css({ height: height })
      }
      this.$el.removeClass('fullscreen')
    }
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
    this.containerFactory.params = _(this.params).extend({sources})
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
    console.log('container being removed')
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
    this.$el.appendTo(this.parentElement)
    return containers
  }

  createContainer(source) {
    var container = this.containerFactory.createContainer(source)
    this.appendContainer(container)
    return container
  }

  setupMediaControl(container) {
    var params = _.extend({container: container}, this.params)
    if (this.mediaControl) {
      this.mediaControl.setContainer(container)
    } else {
      this.mediaControl = new MediaControl(_.extend({container: container}, this.params))
      this.listenTo(this.mediaControl, 'mediacontrol:fullscreen', this.toggleFullscreen)
      this.listenTo(this.mediaControl, 'mediacontrol:show', this.onMediaControlShow.bind(this, true))
      this.listenTo(this.mediaControl, 'mediacontrol:hide', this.onMediaControlShow.bind(this, false))
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
      this.params.width = this.params.width || this.$el.width()
      this.params.height = this.params.height || this.$el.height()
      this.updateSize()
    })

    return this
  }
}

module.exports = Core
