module.paths.push(process.cwd() + '/src');
var jsdom = require('jsdom').jsdom;
global.chai = require('chai');
global.sinon = require('sinon');

// bootstrap a "DOM" so jquery can work in the test env.
global.window = jsdom('<html><body></body></html>').createWindow();

var Core = require('components/core');
var UIObject = require('base/ui_object');
var Container = require('components/container');
var MediaControl = require('components/media_control');
var StatsPlugin = require('plugins/stats');

chai.should();
expect = chai.expect;

module.exports = {
  UIObject: UIObject,
  MediaControl: MediaControl,
  Container: Container,
  Core: Core,
  StatsPlugin: StatsPlugin
};
