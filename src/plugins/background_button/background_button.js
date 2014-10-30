var UICorePlugin = require('ui_core_plugin')
var JST = require('../../base/jst')
var Styler = require('../../base/styler')

var Browser = require('browser')
var Mediator = require('mediator')
var PlayerInfo = require('player_info')

class BackgroundButton extends UICorePlugin {
  get template() { return JST.background_button }
  get name() { return 'background_button' }

  get attributes() {
    return {
      'class': 'background-button',
      'data-background-button': '',
    }
  }

  get events() {
    return {
      'click .background-button-icon': 'click'
    }
  }

  constructor(core) {
    super(core)
    this.core = core
    this.settingsUpdate()
  }

  bindEvents() {
    this.listenTo(this.core.mediaControl.container, 'container:state:buffering', this.hide)
    this.listenTo(this.core.mediaControl.container, 'container:state:bufferfull', this.show)
    this.listenTo(this.core.mediaControl, 'mediacontrol:rendered', this.settingsUpdate)
    this.listenTo(this.core.mediaControl, 'mediacontrol:show', this.updateSize)
    this.listenTo(this.core.mediaControl, 'mediacontrol:playing', this.playing)
    this.listenTo(this.core.mediaControl, 'mediacontrol:notplaying', this.notplaying)
    Mediator.on('player:resize', this.updateSize, this)
  }

  stopListening() {
    super()
    Mediator.off('player:resize', this.updateSize, this)
  }

  settingsUpdate() {
    this.stopListening()
    if(this.shouldRender()) {
      this.render()
      this.bindEvents()
      if (this.core.mediaControl.container.isPlaying()) {
        this.playing()
      } else {
        this.notplaying()
      }
    } else {
      this.$el.remove()
      this.$playPauseButton.show()
      this.$playStopButton.show()
      this.listenTo(this.core.mediaControl.container, 'container:settingsupdate', this.settingsUpdate)
      this.listenTo(this.core.mediaControl.container, 'container:dvr', this.settingsUpdate)
      this.listenTo(this.core.mediaControl, 'mediacontrol:containerchanged', this.settingsUpdate)
    }
  }

  shouldRender() {
    //this plugin should render only if there is a playpause or playstop icon in media control
    var useBackgroundButton = (this.core.options.useBackgroundButton === undefined && Browser.isMobile) || !!this.core.options.useBackgroundButton
    return useBackgroundButton && (this.core.mediaControl.$el.find('[data-playstop]').length > 0 || this.core.mediaControl.$el.find('[data-playpause]').length > 0)
  }

  click() {
    this.core.mediaControl.show()
    if (this.shouldStop) {
      this.core.mediaControl.togglePlayStop()
    } else {
      this.core.mediaControl.togglePlayPause()
    }
  }

  show() {
    this.$el.removeClass('hide')
  }

  hide() {
    this.$el.addClass('hide')
  }

  enable() {
    this.stopListening()
    super()
    this.settingsUpdate()
  }

  disable() {
    super()
    this.$playPauseButton.show()
    this.$playStopButton.show()
  }

  playing() {
    this.$buttonIcon
      .removeClass('notplaying')
      .addClass('playing')
  }

  notplaying() {
    this.$buttonIcon
      .removeClass('playing')
      .addClass('notplaying')
  }

  getExternalInterface() {}

  updateSize() {
    if (!this.$el) return
    var height = PlayerInfo.currentSize ? PlayerInfo.currentSize.height : this.$el.height()
    this.$el.css({ fontSize: height })
    this.$buttonWrapper.css({ marginTop: -(this.$buttonWrapper.height() / 2) })
  }

  render() {
    var style = Styler.getStyleFor(this.name)
    this.$el.html(this.template())
    this.$el.append(style)
    this.$playPauseButton = this.core.mediaControl.$el.find('[data-playpause]')
    this.$playStopButton = this.core.mediaControl.$el.find('[data-playstop]')
    this.$buttonWrapper = this.$el.find('.background-button-wrapper[data-background-button]')
    this.$buttonIcon = this.$el.find('.background-button-icon[data-background-button]')
    this.shouldStop = this.$playStopButton.length > 0
    this.$el.insertBefore(this.core.mediaControl.$el.find('.media-control-layer[data-controls]'))
    this.$el.click(() => this.click(this.$el))
    process.nextTick(() => this.updateSize())

    if (this.core.options.useBackgroundButton) {
      this.$playPauseButton.hide()
      this.$playStopButton.hide()
    }

    if (this.shouldStop) {
      this.$buttonIcon.addClass('playstop')
    }

    if (this.core.mediaControl.isVisible()) {
      this.show()
    }
    return this
  }
}

module.exports = BackgroundButton;
