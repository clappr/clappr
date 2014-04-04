var BaseObject = require('../../base/base_object');
var $ = require('jquery');

var BOLD = 'font-weight: bold; font-size: 13px;';
var INFO = 'color: green;' + BOLD;
var DEBUG = 'color: #222;' + BOLD;
var ERROR = 'color: red;' + BOLD;
var DEFAULT = '';

$(document).keydown(function(e) {
  if(e.ctrlKey && e.shiftKey && e.keyCode === 68) {
    window.DEBUG = !window.DEBUG;
  }
});

var Log = function(klass) {
  this.klass = klass || 'Logger';
}

Log.info = function(klass, msg) {
    console.log('%s %cINFO%c [%s] %s', (new Date()).toLocaleTimeString(), INFO, DEFAULT, klass, msg);
}

Log.error = function(klass, msg) {
    console.log('%s %cINFO%c [%s] %s', (new Date()).toLocaleTimeString(), INFO, DEFAULT, klass, msg);
}

Log.prototype = {
  log: function(msg) {
    this.info(msg);
  },
  info: function(msg) {
    console.log('%s %cINFO%c [%s] %s', (new Date()).toLocaleTimeString(), INFO, DEFAULT, this.klass, msg);
  },
  error: function(msg) {
    console.log('%s %cERROR%c [%s] %s', (new Date()).toLocaleTimeString(), ERROR, DEFAULT, this.klass, msg);
  }
};

module.exports = Log;
