// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import ContainerPlugin from 'base/container_plugin'
import Events from 'base/events'
import $ from 'clappr-zepto'

export default class StatsPlugin extends ContainerPlugin {
  get name() { return 'stats' }

  constructor(container) {
    super(container)
    this.setInitialAttrs()
    this.reportInterval = this.options.reportInterval || 5000
    this.state = 'IDLE'
  }

  bindEvents() {
    this.listenTo(this.container.playback, Events.PLAYBACK_PLAY, this.onPlay)
    this.listenTo(this.container, Events.CONTAINER_STOP, this.onStop)
    this.listenTo(this.container, Events.CONTAINER_ENDED, this.onStop)
    this.listenTo(this.container, Events.CONTAINER_DESTROYED, this.onStop)
    this.listenTo(this.container, Events.CONTAINER_STATE_BUFFERING, this.onBuffering)
    this.listenTo(this.container, Events.CONTAINER_STATE_BUFFERFULL, this.onBufferFull)
    this.listenTo(this.container, Events.CONTAINER_STATS_ADD, this.onStatsAdd)
    this.listenTo(this.container, Events.CONTAINER_BITRATE, this.onStatsAdd)
    this.listenTo(this.container.playback, Events.PLAYBACK_STATS_ADD, this.onStatsAdd)
  }

  setInitialAttrs() {
    this.firstPlay = true
    this.startupTime = 0
    this.rebufferingTime = 0
    this.watchingTime = 0
    this.rebuffers = 0
    this.externalMetrics = {}
  }

  onPlay() {
    this.state = 'PLAYING'
    this.watchingTimeInit = Date.now()
    if (!this.intervalId) {
      this.intervalId = setInterval(this.report.bind(this), this.reportInterval)
    }
  }

  onStop() {
    clearInterval(this.intervalId)
    this.report()
    this.intervalId = undefined
    this.state = 'STOPPED'
  }

  onBuffering() {
    if (this.firstPlay) {
      this.startupTimeInit = Date.now()
    } else {
      this.rebufferingTimeInit = Date.now()
    }
    this.state = 'BUFFERING'
    this.rebuffers++
  }

  onBufferFull() {
    if (this.firstPlay && this.startupTimeInit) {
      this.firstPlay = false
      this.startupTime = Date.now() - this.startupTimeInit
      this.watchingTimeInit = Date.now()
    } else if (this.rebufferingTimeInit) {
      this.rebufferingTime += this.getRebufferingTime()
    }
    this.rebufferingTimeInit = undefined
    this.state = 'PLAYING'
  }

  getRebufferingTime() {
    return Date.now() - this.rebufferingTimeInit
  }

  getWatchingTime() {
    var totalTime = (Date.now() - this.watchingTimeInit)
    return totalTime - this.rebufferingTime
  }

  isRebuffering() {
    return !!this.rebufferingTimeInit
  }

  onStatsAdd(metric) {
    $.extend(this.externalMetrics, metric)
  }

  getStats() {
    var metrics = {
      startupTime:     this.startupTime,
      rebuffers:       this.rebuffers,
      rebufferingTime: this.isRebuffering()? this.rebufferingTime + this.getRebufferingTime(): this.rebufferingTime,
      watchingTime:    this.isRebuffering()? this.getWatchingTime() - this.getRebufferingTime(): this.getWatchingTime()
    }
    $.extend(metrics, this.externalMetrics)
    return metrics
  }

  report() {
    this.container.statsReport(this.getStats())
  }
}
