module.paths.push(process.cwd() + '/src');
var jsdom = require('jsdom').jsdom;
global.chai = require('chai');
global.sinon = require('sinon');

// bootstrap a "DOM" so jquery can work in the test env.
global.window = jsdom('<html><body></body></html>').createWindow();

chai.should();
expect = chai.expect;

module.exports = {
  UIObject: require('base/ui_object'),
  BaseObject: require('base/base_object'),
  MediaControl: require('components/media_control'),
  Container: require('components/container'),
  Core: require('components/core'),
  StatsPlugin: require('plugins/stats'),
  StatsEvents: require('plugins/stats/stats_events'),
  UIPlugin: require('base/ui_plugin'),
  WaterMarkPlugin: require('plugins/watermark'),
  JST: require('base/jst')
};
