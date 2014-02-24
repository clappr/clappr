var BaseObject = require('../base/base_object');

var PosterPlugin = BaseObject.extend({
  tagName: 'img',
  initialize: function(options) {
    this.listenTo(this.container, 'container:play', this.onPlay);
    this.listenTo(this.container, 'container:stop', this.onStop);
    this.el.src = options.src;
    this.render();
  },
  onPlay: function() {
    this.$el.hide();
  },
  onStop: function() {
    this.$el.show();
  },
  render: function() {
    this.container.$el.append(this.el);
    return this;
  },
});

module.exports = PosterPlugin;

