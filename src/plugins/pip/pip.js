// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var BaseObject = require('../../base/base_object')
var Styler = require('../../base/styler')
var $ = require("jquery")
var _ = require('underscore')

var Loading = require('../loading')

class PipPlugin extends BaseObject {
  get name() { return 'pip' }

  initialize(core) {
    this.core = core
    this.addListeners()
    this.loading = new Loading({message: 'Carregando...'})
    this.core.$el.append(this.loading.render().el)
    var style = Styler.getStyleFor('pip')
    this.core.$el.append(style)
    this.loading.$el.attr('data-pip', '')
    this.loading.$el.addClass('pip-loading')
    this.setupContainers()
  }

  getExternalInterface() {
    return {
      addPip: this.addPip,
      discardPip: this.discardPip,
      addMaster: this.addMaster,
      addMasterContainer: this.addMasterContainer,
      changeMaster: this.changeMaster,
      pipToMaster: this.pipToMaster,
      hasPip: this.hasPip
    }
  }

  addListeners() {
    this.listenTo(this.core.mediaControl, 'mediacontrol:show', this.onMediaControlShow)
    this.listenTo(this.core.mediaControl, 'mediacontrol:hide', this.onMediaControlHide)
  }

  setupContainers() {
    this.masterContainer = this.core.containers[0]
    this.setMasterStyle(this.masterContainer, false)
    this.core.mediaControl.setContainer(this.masterContainer)
    this.core.mediaControl.render()

    if (this.core.containers.length === 2) {
      this.pipContainer = this.core.containers[1]
      this.setPipStyle(this.pipContainer, false)
      this.masterContainer.play()
      this.pipContainer.play()
      this.pipContainer.setVolume(0)
      this.pipContainer.trigger("container:pip", true)
      this.listenToPipClick()
    }
  }

  hasPip() {
    return !!this.pipContainer
  }

  addPip(source) {
    this.stopListening(this.pipContainer)
    this.discardPip()
    this.core.createContainer(source).then(this.addPipCallback.bind(this))
  }

  addPipCallback(container) {
    this.pipContainer = _(container).isArray() ? container[0] : container
    this.onContainerReady()
    if (this.core.params.onPipLoaded)
      this.core.params.onPipLoaded(this.pipContainer.playback.src)
  }

  onContainerReady() {
    this.pipContainer.setVolume(0)
    this.setPipStyle(this.pipContainer)
    this.pipContainer.play()
    this.stopListening(this.pipContainer)
    this.listenToPipClick()
    this.listenTo(this.pipContainer, "container:ended", this.discardPip)
    this.pipContainer.trigger("container:pip", true)
  }

  discardPip() {
    if (this.pipContainer) {
      this.stopListening(this.pipContainer)
      this.discardContainer(this.pipContainer)
      this.pipContainer = undefined
    }
  }

  discardMaster() {
    if (this.masterContainer) {
      this.stopListening(this.masterContainer)
      this.discardContainer(this.masterContainer)
      this.masterContainer = undefined
    }
  }

  setMasterContainer(container) {
    this.discardContainer(this.masterContainer)
    this.masterContainer = container
    this.setMasterStyle(this.masterContainer)
    this.listenTo(this.masterContainer, "container:ended", this.pipToMaster)
    this.masterContainer.play()
  }

  addMaster(source) {
    if (this.masterContainer) {
      this.loading.show()
      this.stopListening(this.masterContainer)
      this.tmpContainer = this.masterContainer
      this.tmpContainer.setStyle({'z-index': 2000})
      this.core.createContainer(source).then(this.addMasterCallback.bind(this))
    }
  }

  addMasterContainer(container) {
    if (this.masterContainer) {
      this.tmpContainer = this.masterContainer
      this.tmpContainer.setStyle({'z-index': 2000})
      this.addMasterCallback(container)
    }
  }

  addMasterCallback(container) {
    this.masterContainer = container
    if(this.pipContainer) {
      this.discardPip()
    }
    //this.listenToOnce(this.masterContainer, "container:play", this.animateMasterToPip)
    this.pipContainer = this.tmpContainer
    this.setPipStyle(this.pipContainer)
    this.setMasterStyle(this.masterContainer)
    this.masterContainer.play()
    this.animateMasterToPip()
    this.tmpContainer = undefined
    this.pipContainer.setVolume(0)
  }

  animateMasterToPip() {
    this.loading.hide()
    this.listenTo(this.masterContainer, "container:ended", this.pipToMaster)
    this.pipContainer.$el.one(
      'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
      () => {
        this.pipContainer.trigger("container:pip", true)
        if (this.core.params.onMasterLoaded) {
          this.core.params.onMasterLoaded(this.masterContainer.getSource())
        }
      }
    )
    this.setPipStyle(this.pipContainer)
    this.core.mediaControl.setContainer(this.masterContainer)
    this.listenToPipClick()
  }

  changeMaster(source) {
    if (this.masterContainer) {
      this.stopListening(this.masterContainer)
      this.tmpContainer = this.masterContainer
      this.tmpContainer.setStyle({'z-index': 2000})
      this.core.createContainer(source).then(this.changeMasterCallback.bind(this))
    }
  }

  changeMasterCallback(container) {
    this.masterContainer.destroy()
    this.masterContainer = container
    this.masterContainer.play()
    this.tmpContainer = undefined
    this.setMasterStyle(this.masterContainer)
    this.listenTo(this.masterContainer, "container:ended", this.pipToMaster)
    this.core.mediaControl.setContainer(this.masterContainer)
    if (this.core.params.onMasterLoaded)
      this.core.params.onMasterLoaded(this.masterContainer.playback.params.src)
  }

  listenToPipClick() {
    if (this.pipContainer) {
      this.stopListening(this.pipContainer)
      this.listenTo(this.pipContainer, "container:click", this.pipToMaster.bind(this))
    }
  }

  discardContainer(container) {
    container.destroy()
  }

  pipToMaster() {
    this.stopListening(this.masterContainer)
    this.stopListening(this.pipContainer, "container:click")
    if (this.pipContainer) {
      this.pipContainer.setStyle({ 'z-index': 998 })
      this.setMasterStyle(this.pipContainer)
      this.pipContainer.$el.one(
        'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
        () => {
          this.pipContainer.$el.off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend')
          this.pipToMasterCallback()
        }
      )
    }
    return this
  }

  pipToMasterCallback() {
    this.discardMaster()
    this.pipContainer.setVolume(100)
    this.pipContainer.trigger("container:pip", false)
    this.pipContainer.play()
    this.masterContainer = this.pipContainer
    this.masterContainer.setStyle({"z-index": 20})
    this.pipContainer = undefined
    this.core.mediaControl.setContainer(this.masterContainer)
    this.core.enableMediaControl()
    if (this.core.params.onPipToMaster)
      this.core.params.onPipToMaster(this.masterContainer.playback.params.src)
  }

  onMediaControlShow () {
    if (this.pipContainer) {
      this.pipContainer.$el.addClass('pip-transition over-media-control')
    }
  }

  onMediaControlHide () {
    this.masterContainer.$el.removeClass('over-media-control')
    if (this.pipContainer) {
      this.pipContainer.$el.addClass('pip-transition')
      this.pipContainer.$el.removeClass('over-media-control')
    }
  }

  setAnimatedTransition(container, animated) {
    if (animated) {
      container.$el.addClass('pip-transition')
    } else {
      container.$el.removeClass('pip-transition')
    }
  }

  setPipStyle(container, animated = true) {
    this.setAnimatedTransition(container, animated)
    container.$el.attr('data-pip', '')
    container.$el.addClass('pip-container')
    container.$el.removeClass('over-media-control master-container')
  }

  setMasterStyle(container, animated = true) {
    this.setAnimatedTransition(container, animated)
    container.$el.attr('data-pip', '')
    container.$el.addClass('master-container')
    container.$el.removeClass('over-media-control pip-container')
  }
}

module.exports = PipPlugin
