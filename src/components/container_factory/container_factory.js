// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The ContainerFactory is responsible for manage playback bootstrap and create containers.
 */

import BaseObject from 'base/base_object'
import Events from 'base/events'
import Container from 'components/container'
import $ from 'clappr-zepto'

import find from 'lodash.find'
import isPlainObject from 'lodash.isplainobject'

export default class ContainerFactory extends BaseObject {
  constructor(options, loader) {
    super(options)
    this.options = options
    this.loader = loader
  }

  createContainers() {
    return $.Deferred((promise) => {
      promise.resolve(this.options.sources.map((source) => {
        return this.createContainer(source)
      }))
    })
  }

  findPlaybackPlugin(source, mimeType) {
    return find(this.loader.playbackPlugins, (p) => { return p.canPlay(source, mimeType) })
  }

  createContainer(source) {
    var resolvedSource = null
    var mimeType = this.options.mimeType
    if (isPlainObject(source)) {
      resolvedSource = source.source.toString()
      if (source.mimeType) {
        mimeType = source.mimeType
      }
    } else {
      resolvedSource = source.toString()
    }

    if (resolvedSource.match(/^\/\//)) resolvedSource = window.location.protocol + resolvedSource

    var options = $.extend({}, this.options, {
      src: resolvedSource,
      mimeType: mimeType
    })
    var playbackPlugin = this.findPlaybackPlugin(resolvedSource, mimeType)
    var playback = new playbackPlugin(options)

    options = $.extend(options, {playback: playback})

    var container = new Container(options)
    var defer = $.Deferred()
    defer.promise(container)
    this.addContainerPlugins(container)
    this.listenToOnce(container, Events.CONTAINER_READY, () => defer.resolve(container))
    return container
  }

  addContainerPlugins(container) {
    this.loader.containerPlugins.forEach((Plugin) => {
      container.addPlugin(new Plugin(container))
    })
  }
}
