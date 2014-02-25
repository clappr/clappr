var BaseObject = require('../base/base_object');

var SpinnerThreeBouncePlugin = BaseObject.extend({
  template: function() {
    return '<div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div>';
  },
  className: 'spinner',
  initialize: function(options) {
    this.listenTo(this.container, 'container:state:buffering', this.onBuffering);
    this.listenTo(this.container, 'container:state:bufferfull', this.onBufferFull);
    this.style = document.createElement("style");
    this.style.innerHTML = this.getStyle();
    this.render();
    console.log("Spinner!");
  },
  onBuffering: function() {
    this.$el.show();
  },
  onBufferFull: function() {
    this.$el.hide();
  },
  render: function() {
    this.$el.html(this.template());
    window.rsrs = this.style;
    this.container.$el.append(this.style);
    this.container.$el.append(this.$el);
    this.$el.hide();
    return this;
  },
  getStyle: function() {
    return '.spinner { margin: 100px auto 0; width: 70px; text-align: center; } .spinner > div { width: 18px; height: 18px; background-color: #333; border-radius: 100%; display: inline-block; -webkit-animation: bouncedelay 1.4s infinite ease-in-out; animation: bouncedelay 1.4s infinite ease-in-out; /* Prevent first frame from flickering when animation starts */ -webkit-animation-fill-mode: both; animation-fill-mode: both; } .spinner .bounce1 { -webkit-animation-delay: -0.32s; animation-delay: -0.32s; } .spinner .bounce2 { -webkit-animation-delay: -0.16s; animation-delay: -0.16s; } @-webkit-keyframes bouncedelay { 0%, 80%, 100% { -webkit-transform: scale(0.0) } 40% { -webkit-transform: scale(1.0) } } @keyframes bouncedelay { 0%, 80%, 100% { transform: scale(0.0); -webkit-transform: scale(0.0); } 40% { transform: scale(1.0); -webkit-transform: scale(1.0); } }';
  }
});

module.exports = SpinnerThreeBouncePlugin;

