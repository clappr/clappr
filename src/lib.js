var Player = {
  Base: {
    Plugin: require('./base/plugin'),
    UIPlugin: require('./base/ui_plugin'),
    Styler: require('./base/styler'),
    JST: require('./base/jst')
  },
  Components: {
    Container: require('./components/container'),
    MediaControl: require('./components/media_control'),
    Core: require('./components/core')
  },
  mediator: require('./components/mediator')
};

module.exports = Player
