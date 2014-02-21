/**
 * The Core is responsible to manage Containers, the mediator, MediaControl
 * and the player state.
 */

var BaseObject = require('../base/base_object');

var Core = BaseObject.extend({
  initialize: function(params) {
    this.embedParams = params;
  }
});

module.exports = Core;
