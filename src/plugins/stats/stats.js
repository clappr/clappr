// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var ContainerPlugin = require('container_plugin');
var $ = require("jquery");

class StatsPlugin extends ContainerPlugin {
  get name() { return 'stats' }

  constructor(options) {
    super(options)
    this.setInitialAttrs()
    this.reportInterval = options.reportInterval || 5000
    this.state = "IDLE"
  }

  bindEvents() {
    this.listenTo(this.container.playback, 'playback:play', this.onPlay)
    this.listenTo(this.container, 'container:stop', this.onStop)
    this.listenTo(this.container, 'container:destroyed', this.onStop)
    this.listenTo(this.container, 'container:state:buffering', this.onBuffering)
    this.listenTo(this.container, 'container:state:bufferfull', this.onBufferFull)
    this.listenTo(this.container, 'container:stats:add', this.onStatsAdd)
    this.listenTo(this.container.playback, 'playback:stats:add', this.onStatsAdd)
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
    this.state = "PLAYING"
    this.watchingTimeInit = Date.now()
    if (!this.intervalId) {
      this.intervalId = setInterval(this.report.bind(this), this.reportInterval)
    }
  }

  onStop() {
    clearInterval(this.intervalId)
    this.intervalId = undefined
    this.state = "STOPPED"
  }

  onBuffering() {
    if (this.firstPlay) {
      this.startupTimeInit = Date.now()
    } else {
      this.rebufferingTimeInit = Date.now()
    }
    this.state = "BUFFERING"
    this.rebuffers++
  }

  onBufferFull() {
    if (this.firstPlay) {
      this.firstPlay = false
      this.startupTime = Date.now() - this.startupTimeInit
      this.watchingTimeInit = Date.now()
    } else if (!!this.rebufferingTimeInit) {
      this.rebufferingTime += this.getRebufferingTime()
    }
    this.rebufferingTimeInit = undefined
    this.state = "PLAYING"
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

module.exports = StatsPlugin;
