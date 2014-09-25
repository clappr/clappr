var UIObject = require('../../base/ui_object');
var JST = require('../../base/jst');
var Styler = require('../../base/styler');

class BackgroundButton extends UIObject {
  get template() { return JST.background_button; }
  get name() { return 'background_button' }
  get events() {
    return {
      'click .playpause-icon': 'click'
    }
  }
  get attributes() {
    return {
      'class': 'background-button',
      'data-background-button': '',
    }
  }
  constructor(core) {
    super(core);
    this.core = core;
    this.listenTo(this.core.mediaControl.container, 'container:state:buffering', this.hide);
    this.listenTo(this.core.mediaControl.container, 'container:state:bufferfull', this.show);
    this.listenTo(this.core.mediaControl, 'mediacontrol:show', this.show);
    this.listenTo(this.core.mediaControl, 'mediacontrol:hide', this.hide);
    this.listenTo(this.core.mediaControl, 'mediacontrol:playing', this.playing);
    this.listenTo(this.core.mediaControl, 'mediacontrol:notplaying', this.notplaying);
    if(this.shouldRender()) {
      this.render();
    }
  }

  shouldRender() {
    //this plugin should render only if there is a playpause icon
    //in media control
    var settings = this.core.mediaControl.settings;
    return settings.default.indexOf('playpause') >= 0 ||
      settings.left.indexOf('playpause') >= 0 ||
      settings.right.indexOf('playpause') >= 0;

  }

  click() {
    this.core.mediaControl.togglePlayPause();
  }

  show() {
    this.$el.removeClass('hide');
  }

  hide() {
    this.$el.addClass('hide');
  }

  playing() {
    this.$el.find('.playpause-icon[data-background-button]')
      .removeClass('paused')
      .addClass('playing');
  }

  notplaying() {
    this.$el.find('.playpause-icon[data-background-button]')
      .removeClass('playing')
      .addClass('paused');
  }

  getExternalInterface() {}

  render() {
    var style = Styler.getStyleFor(this.name);
    this.$el.html(this.template());
    this.$el.append(style);
    this.core.mediaControl.$el.find('[data-playpause]').hide();
    this.core.$el.append(this.$el);
    return this;
  }
}

module.exports = BackgroundButton;
