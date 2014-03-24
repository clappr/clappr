//var jsdom = require('jsdom').jsdom;
global.chai = require('chai');
global.sinon = require('sinon');

// bootstrap a "DOM" so jquery can work in the test env.
//global.window = jsdom('<html><body></body></html>').createWindow();

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
  JST: require('../src/base/jst')
};
