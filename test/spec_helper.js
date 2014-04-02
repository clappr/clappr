global.chai = require('chai');
global.sinon = require('sinon');

chai.should();
expect = chai.expect;

module.exports = {
  UIObject: require('../src/base/ui_object'),
  BaseObject: require('../src/base/base_object'),
  MediaControl: require('../src/components/media_control'),
  Container: require('../src/components/container'),
  Core: require('../src/components/core'),
  StatsPlugin: require('../src/plugins/stats'),
  PipPlugin: require('../src/plugins/pip'),
  StatsEvents: require('../src/plugins/stats/stats_events'),
  UIPlugin: require('../src/base/ui_plugin'),
  WaterMarkPlugin: require('../src/plugins/watermark'),
  JST: require('../src/base/jst'),
  HTML5VideoPlayback: require('../src/plugins/html5_video_playback'),
  FakePlayback: require('./fake_playback')
};
