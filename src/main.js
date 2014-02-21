var Core = require('./components/core');
var BaseObject = require('./base/base_object');
var $ = require('jquery');

var Player = BaseObject.extend({
  initialize: function(params) {
    this.params = params;
  },

  attachTo: function(element) {
    this.params["el"] = element;
    this.core = new Core(this.params);
  }
});

module.exports = WP3 = { Player: Player };
