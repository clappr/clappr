var BaseObject = require('../base/base_object');
var Styler = require('../base/styler');
var JST = require('../base/jst');

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
    this.$el.html(this.template());
    this.style = Styler.styleFor(this.pluginName);
    this.container.$el.append(this.style);
    this.container.$el.append(this.$el);
    this.$el.hide();
    return this;
  }
});

module.exports = SpinnerThreeBouncePlugin;

