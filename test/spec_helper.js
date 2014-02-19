module.paths.push(process.cwd() + '/src');
var jsdom = require('jsdom').jsdom;
global.chai = require('chai');
global.sinon = require('sinon');

// bootstrap a "DOM" so jquery can work in the test env.
global.window = jsdom('<html><body></body></html>').createWindow();

var BaseObject = require('base/base_object');
var Container = require('components/container');
var MediaControl = require('components/media_control');

chai.should();

module.exports = {
  BaseObject: BaseObject,
  MediaControl: MediaControl,
  Container: Container
};
