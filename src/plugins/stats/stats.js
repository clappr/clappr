// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Plugin = require('../../base/plugin');
var StatsEvents = require('./stats_events');
var $ = require("jquery");

var StatsPlugin = Plugin.extend({
  name: 'stats',
  type: 'stats',
  initialize: function(options) {
    StatsPlugin.super('initialize').call(this, options);
    this.container.with(StatsEvents);
    this.setInitialAttrs();
    this.reportInterval = options.reportInterval || 5000;
    this.state = "IDLE";
  },
  bindEvents: function() {
    this.listenTo(this.container, 'container:play', this.onPlay);
    this.listenTo(this.container, 'container:stop', this.onStop);
    this.listenTo(this.container, 'container:destroyed', this.onStop);
    this.listenTo(this.container, 'container:setreportinterval', this.setReportInterval);
    this.listenTo(this.container, 'container:state:buffering', this.onBuffering);
    this.listenTo(this.container, 'container:state:bufferfull', this.onBufferFull);
    this.listenTo(this.container, 'container:stats:add', this.onStatsAdd);
    this.listenTo(this.container.playback, 'playback:stats:add', this.onStatsAdd);
  },
  setReportInterval: function(reportInterval) {
    this.reportInterval = reportInterval;
  },
  setInitialAttrs: function() {
    this.firstPlay = true;
    this.startupTime = 0;
    this.rebufferingTime = 0;
    this.watchingTime = 0;
    this.rebuffers = 0;
    this.externalMetrics = {};
  },
  onPlay: function() {
    this.state = "PLAYING";
    this.watchingTimeInit = Date.now();
    this.intervalId = setInterval(this.report.bind(this), this.reportInterval);
  },
  onStop: function() {
    clearInterval(this.intervalId);
    this.state = "STOPPED";
  },
  onBuffering: function() {
    if (this.firstPlay) {
      this.startupTimeInit = Date.now();
    } else {
      this.rebufferingTimeInit = Date.now();
    }
    this.state = "BUFFERING";
    this.rebuffers++;
  },
  onBufferFull: function() {
    if (this.firstPlay) {
      this.firstPlay = false;
      this.startupTime = Date.now() - this.startupTimeInit;
      this.watchingTimeInit = Date.now();
    } else {
      this.rebufferingTime += this.getRebufferingTime();
    }
    this.rebufferingTimeInit = undefined;
    this.state = "PLAYING";
  },
  getRebufferingTime: function() {
    return Date.now() - this.rebufferingTimeInit;
  },
  getWatchingTime: function() {
    var totalTime = (Date.now() - this.watchingTimeInit);
    return totalTime - this.rebufferingTime - this.startupTime;
  },
  isRebuffering: function() {
    return !!this.rebufferingTimeInit;
  },
  onStatsAdd: function(metric) {
    $.extend(this.externalMetrics, metric);
  },
  getStats: function() {
    var metrics = {
      startupTime:     this.startupTime,
      rebuffers:       this.rebuffers,
      rebufferingTime: this.isRebuffering()? this.rebufferingTime + this.getRebufferingTime(): this.rebufferingTime,
      watchingTime:    this.isRebuffering()? this.getWatchingTime() - this.getRebufferingTime(): this.getWatchingTime()
    };
    $.extend(metrics, this.externalMetrics);
    return metrics;
  },
  report: function() {
    this.container.statsReport(this.getStats());
  }
});

module.exports = StatsPlugin;
