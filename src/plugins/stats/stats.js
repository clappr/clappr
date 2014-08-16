// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Plugin = require('../../base/plugin');
var $ = require("jquery");

class StatsPlugin extends Plugin {
  get name() { return 'stats' }
  get type() { return 'stats' }

  initialize(options) {
    super(options)
    this.setInitialAttrs()
    this.reportInterval = options.reportInterval || 5000
    this.state = "IDLE"
  }

  bindEvents() {
    this.listenTo(this.container, 'container:play', this.onPlay)
    this.listenTo(this.container, 'container:stop', this.onStop)
    this.listenTo(this.container, 'container:destroyed', this.onStop)
    this.listenTo(this.container, 'container:setreportinterval', this.setReportInterval)
    this.listenTo(this.container, 'container:state:buffering', this.onBuffering)
    this.listenTo(this.container, 'container:state:bufferfull', this.onBufferFull)
    this.listenTo(this.container, 'container:stats:add', this.onStatsAdd)
    this.listenTo(this.container.playback, 'playback:stats:add', this.onStatsAdd)
  }

  setReportInterval(reportInterval) {
    this.reportInterval = reportInterval
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
    this.intervalId = setInterval(this.report.bind(this), this.reportInterval)
  }

  onStop() {
    clearInterval(this.intervalId)
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
    } else {
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
    return totalTime - this.rebufferingTime - this.startupTime
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
