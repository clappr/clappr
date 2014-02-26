var BaseObject = require('../../base/base_object');
var Styler = require('../../base/styler');
var JST = require('../../base/jst');

var SpinnerThreeBouncePlugin = BaseObject.extend({
  pluginName: 'spinner_three_bounce',
  attributes: {
    "data-spinner":""
  },
  initialize: function(options) {
    this.template = JST[this.pluginName];
    this.listenTo(this.container, 'container:state:buffering', this.onBuffering);
    this.listenTo(this.container, 'container:state:bufferfull', this.onBufferFull);
    this.render();
  },
  onBuffering: function() {
    this.$el.show();
  },
  onBufferFull: function() {
    this.$el.hide();
  },
  render: function() {
    this.$el.hide();
    this.$el.html(this.template());
    var style = Styler.getStyleFor(this.pluginName);
    this.container.$el.append(style);
    this.container.$el.append(this.$el);
    return this;
  }
});

module.exports = SpinnerThreeBouncePlugin;

