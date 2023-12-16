// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/**
 * The ContainerFactory is responsible for manage playback bootstrap and create containers.
 */

import $ from 'clappr-zepto'
import BaseObject from '@/base/base_object'
import Events from '@/base/events'
import Container from '@/components/container'
import Playback from '@/base/playback'

export default class ContainerFactory extends BaseObject {
  get options() { return this._options }
  set options(options) { this._options = options }

  constructor(options, loader, i18n, playerError) {
    super(options)
    this._i18n = i18n
    this.loader = loader
    this.playerError = playerError
  }

  createContainers() {
    return $.Deferred((promise) => {
      promise.resolve(this.options.sources.map((source) => {
        return this.createContainer(source)
      }))
    })
  }

  findPlaybackPlugin(source, mimeType) {
    return this.loader.playbackPlugins.filter(p => p.canPlay(source, mimeType))[0]
  }

  createContainer(source) {
    let resolvedSource = null
    let mimeType = this.options.mimeType

    if (typeof source === 'object') {
      resolvedSource = source.source.toString()
      if (source.mimeType) mimeType = source.mimeType
    } else {
      resolvedSource = source.toString()
    }

    if (resolvedSource.match(/^\/\//)) resolvedSource = window.location.protocol + resolvedSource

    let options = { ...this.options, src: resolvedSource, mimeType: mimeType }

    const playbackPlugin = this.findPlaybackPlugin(resolvedSource, mimeType)

    // Fallback to empty playback object until we sort out unsupported sources error without NoOp playback
    const playback = playbackPlugin ? new playbackPlugin(options, this._i18n, this.playerError) : new Playback()

    options = { ...options, playback: playback }

    const container = new Container(options, this._i18n, this.playerError)
    const defer = $.Deferred()
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
