module.paths.push(process.cwd() + '/src');
var jsdom = require('jsdom').jsdom;
global.chai = require('chai');

// bootstrap a "DOM" so jquery can work in the test env.
global.window = jsdom('<html><body></body></html>').createWindow();

BaseObject = require('base/base_object');

chai.should();

module.exports = {
  BaseObject: BaseObject
}
