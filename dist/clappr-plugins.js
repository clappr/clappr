(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@clappr/core')) :
  typeof define === 'function' && define.amd ? define(['exports', '@clappr/core'], factory) :
  (global = global || self, factory(global.ClapprPlugins = {}, global.Clappr));
}(this, (function (exports, core) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  var ClickToPausePlugin =
  /*#__PURE__*/
  function (_ContainerPlugin) {
    _inherits(ClickToPausePlugin, _ContainerPlugin);

    _createClass(ClickToPausePlugin, [{
      key: "name",
      get: function get() {
        return 'click_to_pause';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.5"
        };
      }
    }]);

    function ClickToPausePlugin(container) {
      _classCallCheck(this, ClickToPausePlugin);

      return _possibleConstructorReturn(this, _getPrototypeOf(ClickToPausePlugin).call(this, container));
    }

    _createClass(ClickToPausePlugin, [{
      key: "bindEvents",
      value: function bindEvents() {
        this.listenTo(this.container, core.Events.CONTAINER_CLICK, this.click);
        this.listenTo(this.container, core.Events.CONTAINER_SETTINGSUPDATE, this.settingsUpdate);
      }
    }, {
      key: "click",
      value: function click() {
        if (this.container.getPlaybackType() !== core.Playback.LIVE || this.container.isDvrEnabled()) {
          if (this.container.isPlaying()) this.container.pause();else this.container.play();
        }
      }
    }, {
      key: "settingsUpdate",
      value: function settingsUpdate() {
        var pointerEnabled = this.container.getPlaybackType() !== core.Playback.LIVE || this.container.isDvrEnabled();
        if (pointerEnabled === this.pointerEnabled) return;
        var method = pointerEnabled ? 'addClass' : 'removeClass';
        this.container.$el[method]('pointer-enabled');
        this.pointerEnabled = pointerEnabled;
      }
    }]);

    return ClickToPausePlugin;
  }(core.ContainerPlugin);

  var ccIcon = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t viewBox=\"0 0 49 41.8\" style=\"enable-background:new 0 0 49 41.8;\" xml:space=\"preserve\">\n<path d=\"M47.1,0H3.2C1.6,0,0,1.2,0,2.8v31.5C0,35.9,1.6,37,3.2,37h11.9l3.2,1.9l4.7,2.7c0.9,0.5,2-0.1,2-1.1V37h22.1\n\tc1.6,0,1.9-1.1,1.9-2.7V2.8C49,1.2,48.7,0,47.1,0z M7.2,18.6c0-4.8,3.5-9.3,9.9-9.3c4.8,0,7.1,2.7,7.1,2.7l-2.5,4\n\tc0,0-1.7-1.7-4.2-1.7c-2.8,0-4.3,2.1-4.3,4.3c0,2.1,1.5,4.4,4.5,4.4c2.5,0,4.9-2.1,4.9-2.1l2.2,4.2c0,0-2.7,2.9-7.6,2.9\n\tC10.8,27.9,7.2,23.5,7.2,18.6z M36.9,27.9c-6.4,0-9.9-4.4-9.9-9.3c0-4.8,3.5-9.3,9.9-9.3C41.7,9.3,44,12,44,12l-2.5,4\n\tc0,0-1.7-1.7-4.2-1.7c-2.8,0-4.3,2.1-4.3,4.3c0,2.1,1.5,4.4,4.5,4.4c2.5,0,4.9-2.1,4.9-2.1l2.2,4.2C44.5,25,41.9,27.9,36.9,27.9z\"/>\n</svg>";

  var ccHTML = "<button type=\"button\" class=\"cc-button media-control-button media-control-icon\" data-cc-button aria-label=\"<%= ariaLabel %>\"></button>\n<ul>\n  <% if (title) { %>\n  <li data-title><%= title %></li>\n  <% }; %>\n  <li><a href=\"#\" data-cc-select=\"-1\"><%= disabledLabel %></a></li>\n  <% for (var i = 0; i < tracks.length; i++) { %>\n    <li><a href=\"#\" data-cc-select=\"<%= tracks[i].id %>\"><%= tracks[i].label %></a></li>\n  <% }; %>\n</ul>\n";

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css = ".cc-controls[data-cc-controls] {\n  float: right;\n  position: relative;\n  display: none; }\n  .cc-controls[data-cc-controls].available {\n    display: block; }\n  .cc-controls[data-cc-controls] .cc-button {\n    padding: 6px !important; }\n    .cc-controls[data-cc-controls] .cc-button.enabled {\n      display: block;\n      opacity: 1.0; }\n      .cc-controls[data-cc-controls] .cc-button.enabled:hover {\n        opacity: 1.0;\n        text-shadow: none; }\n  .cc-controls[data-cc-controls] > ul {\n    list-style-type: none;\n    position: absolute;\n    bottom: 25px;\n    border: 1px solid black;\n    display: none;\n    background-color: #e6e6e6; }\n  .cc-controls[data-cc-controls] li {\n    font-size: 10px; }\n    .cc-controls[data-cc-controls] li[data-title] {\n      background-color: #c3c2c2;\n      padding: 5px; }\n    .cc-controls[data-cc-controls] li a {\n      color: #444;\n      padding: 2px 10px;\n      display: block;\n      text-decoration: none; }\n      .cc-controls[data-cc-controls] li a:hover {\n        background-color: #555;\n        color: white; }\n        .cc-controls[data-cc-controls] li a:hover a {\n          color: white;\n          text-decoration: none; }\n    .cc-controls[data-cc-controls] li.current a {\n      color: #f00; }\n";
  styleInject(css);

  var ClosedCaptions =
  /*#__PURE__*/
  function (_UICorePlugin) {
    _inherits(ClosedCaptions, _UICorePlugin);

    _createClass(ClosedCaptions, [{
      key: "name",
      get: function get() {
        return 'closed_captions';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.5"
        };
      }
    }, {
      key: "template",
      get: function get() {
        return core.template(ccHTML);
      }
    }, {
      key: "events",
      get: function get() {
        return {
          'click [data-cc-button]': 'toggleContextMenu',
          'click [data-cc-select]': 'onTrackSelect'
        };
      }
    }, {
      key: "attributes",
      get: function get() {
        return {
          'class': 'cc-controls',
          'data-cc-controls': ''
        };
      }
    }]);

    function ClosedCaptions(core) {
      var _this;

      _classCallCheck(this, ClosedCaptions);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ClosedCaptions).call(this, core));
      var config = core.options.closedCaptionsConfig;
      _this._title = config && config.title ? config.title : null;
      _this._ariaLabel = config && config.ariaLabel ? config.ariaLabel : 'cc-button';
      _this._labelCb = config && config.labelCallback && typeof config.labelCallback === 'function' ? config.labelCallback : function (track) {
        return track.name;
      };
      return _this;
    }

    _createClass(ClosedCaptions, [{
      key: "bindEvents",
      value: function bindEvents() {
        this.listenTo(this.core, core.Events.CORE_ACTIVE_CONTAINER_CHANGED, this.containerChanged);
        this.listenTo(this.core.mediaControl, core.Events.MEDIACONTROL_RENDERED, this.render);
        this.listenTo(this.core.mediaControl, core.Events.MEDIACONTROL_HIDE, this.hideContextMenu);
        this.container = this.core.getCurrentContainer();

        if (this.container) {
          this.listenTo(this.container, core.Events.CONTAINER_SUBTITLE_AVAILABLE, this.onSubtitleAvailable);
          this.listenTo(this.container, core.Events.CONTAINER_SUBTITLE_CHANGED, this.onSubtitleChanged);
          this.listenTo(this.container, core.Events.CONTAINER_STOP, this.onContainerStop);
        }
      }
    }, {
      key: "onContainerStop",
      value: function onContainerStop() {
        this.ccAvailable(false);
      }
    }, {
      key: "containerChanged",
      value: function containerChanged() {
        this.ccAvailable(false);
        this.stopListening();
        this.bindEvents();
      }
    }, {
      key: "onSubtitleAvailable",
      value: function onSubtitleAvailable() {
        this.renderCcButton();
        this.ccAvailable(true);
      }
    }, {
      key: "onSubtitleChanged",
      value: function onSubtitleChanged(track) {
        this.setCurrentContextMenuElement(track.id);
      }
    }, {
      key: "onTrackSelect",
      value: function onTrackSelect(event) {
        var trackId = parseInt(event.target.dataset.ccSelect, 10);
        this.container.closedCaptionsTrackId = trackId;
        this.hideContextMenu();
        event.stopPropagation();
        return false;
      }
    }, {
      key: "ccAvailable",
      value: function ccAvailable(hasCC) {
        var method = hasCC ? 'addClass' : 'removeClass';
        this.$el[method]('available');
      }
    }, {
      key: "toggleContextMenu",
      value: function toggleContextMenu() {
        this.$el.find('ul').toggle();
      }
    }, {
      key: "hideContextMenu",
      value: function hideContextMenu() {
        this.$el.find('ul').hide();
      }
    }, {
      key: "contextMenuElement",
      value: function contextMenuElement(id) {
        return this.$el.find('ul a' + (!isNaN(id) ? '[data-cc-select="' + id + '"]' : '')).parent();
      }
    }, {
      key: "setCurrentContextMenuElement",
      value: function setCurrentContextMenuElement(trackId) {
        if (this._trackId !== trackId) {
          this.contextMenuElement().removeClass('current');
          this.contextMenuElement(trackId).addClass('current');
          var method = trackId > -1 ? 'addClass' : 'removeClass';
          this.$ccButton[method]('enabled');
          this._trackId = trackId;
        }
      }
    }, {
      key: "renderCcButton",
      value: function renderCcButton() {
        var tracks = this.container ? this.container.closedCaptionsTracks : [];

        for (var i = 0; i < tracks.length; i++) {
          tracks[i].label = this._labelCb(tracks[i]);
        }

        this.$el.html(this.template({
          ariaLabel: this._ariaLabel,
          disabledLabel: this.core.i18n.t('disabled'),
          title: this._title,
          tracks: tracks
        }));
        this.$ccButton = this.$el.find('button.cc-button[data-cc-button]');
        this.$ccButton.append(ccIcon);
        this.$el.append(this.style);
      }
    }, {
      key: "render",
      value: function render() {
        this.renderCcButton();
        var $fullscreen = this.core.mediaControl.$el.find('button[data-fullscreen]');
        if ($fullscreen[0]) this.$el.insertAfter($fullscreen);else this.core.mediaControl.$el.find('.media-control-right-panel[data-media-control]').prepend(this.$el);
        return this;
      }
    }]);

    return ClosedCaptions;
  }(core.UICorePlugin);

  var dvrHTML = "<div class=\"live-info\"><%= live %></div>\n<button type=\"button\" class=\"live-button\" aria-label=\"<%= backToLive %>\"><%= backToLive %></button>\n";

  var css$1 = ".dvr-controls[data-dvr-controls] {\n  display: inline-block;\n  float: left;\n  color: #fff;\n  line-height: 32px;\n  font-size: 10px;\n  font-weight: bold;\n  margin-left: 6px; }\n  .dvr-controls[data-dvr-controls] .live-info {\n    cursor: default;\n    font-family: \"Roboto\", \"Open Sans\", Arial, sans-serif;\n    text-transform: uppercase; }\n    .dvr-controls[data-dvr-controls] .live-info:before {\n      content: \"\";\n      display: inline-block;\n      position: relative;\n      width: 7px;\n      height: 7px;\n      border-radius: 3.5px;\n      margin-right: 3.5px;\n      background-color: #ff0101; }\n    .dvr-controls[data-dvr-controls] .live-info.disabled {\n      opacity: 0.3; }\n      .dvr-controls[data-dvr-controls] .live-info.disabled:before {\n        background-color: #fff; }\n  .dvr-controls[data-dvr-controls] .live-button {\n    cursor: pointer;\n    outline: none;\n    display: none;\n    border: 0;\n    color: #fff;\n    background-color: transparent;\n    height: 32px;\n    padding: 0;\n    opacity: 0.7;\n    font-family: \"Roboto\", \"Open Sans\", Arial, sans-serif;\n    text-transform: uppercase;\n    -webkit-transition: all 0.1s ease;\n    transition: all 0.1s ease; }\n    .dvr-controls[data-dvr-controls] .live-button:before {\n      content: \"\";\n      display: inline-block;\n      position: relative;\n      width: 7px;\n      height: 7px;\n      border-radius: 3.5px;\n      margin-right: 3.5px;\n      background-color: #fff; }\n    .dvr-controls[data-dvr-controls] .live-button:hover {\n      opacity: 1;\n      text-shadow: rgba(255, 255, 255, 0.75) 0 0 5px; }\n\n.dvr .dvr-controls[data-dvr-controls] .live-info {\n  display: none; }\n\n.dvr .dvr-controls[data-dvr-controls] .live-button {\n  display: block; }\n\n.dvr.media-control.live[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar] .bar-background[data-seekbar] .bar-fill-2[data-seekbar] {\n  background-color: #005aff; }\n\n.media-control.live[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar] .bar-background[data-seekbar] .bar-fill-2[data-seekbar] {\n  background-color: #ff0101; }\n";
  styleInject(css$1);

  var DVRControls =
  /*#__PURE__*/
  function (_UICorePlugin) {
    _inherits(DVRControls, _UICorePlugin);

    _createClass(DVRControls, [{
      key: "template",
      get: function get() {
        return core.template(dvrHTML);
      }
    }, {
      key: "name",
      get: function get() {
        return 'dvr_controls';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.5"
        };
      }
    }, {
      key: "events",
      get: function get() {
        return {
          'click .live-button': 'click'
        };
      }
    }, {
      key: "attributes",
      get: function get() {
        return {
          'class': 'dvr-controls',
          'data-dvr-controls': ''
        };
      }
    }]);

    function DVRControls(core) {
      var _this;

      _classCallCheck(this, DVRControls);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(DVRControls).call(this, core));

      _this.settingsUpdate();

      return _this;
    }

    _createClass(DVRControls, [{
      key: "bindEvents",
      value: function bindEvents() {
        this.listenTo(this.core.mediaControl, core.Events.MEDIACONTROL_CONTAINERCHANGED, this.containerChanged);
        this.listenTo(this.core.mediaControl, core.Events.MEDIACONTROL_RENDERED, this.settingsUpdate);
        this.listenTo(this.core, core.Events.CORE_OPTIONS_CHANGE, this.render);

        if (this.core.getCurrentContainer()) {
          this.listenToOnce(this.core.getCurrentContainer(), core.Events.CONTAINER_TIMEUPDATE, this.render);
          this.listenTo(this.core.getCurrentContainer(), core.Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.dvrChanged);
        }
      }
    }, {
      key: "containerChanged",
      value: function containerChanged() {
        this.stopListening();
        this.bindEvents();
      }
    }, {
      key: "dvrChanged",
      value: function dvrChanged(dvrEnabled) {
        if (this.core.getPlaybackType() !== core.Playback.LIVE) return;
        this.settingsUpdate();
        this.core.mediaControl.$el.addClass('live');

        if (dvrEnabled) {
          this.core.mediaControl.$el.addClass('dvr');
          this.core.mediaControl.$el.find('.media-control-indicator[data-position], .media-control-indicator[data-duration]').hide();
        } else {
          this.core.mediaControl.$el.removeClass('dvr');
        }
      }
    }, {
      key: "click",
      value: function click() {
        var mediaControl = this.core.mediaControl;
        var container = mediaControl.container;
        if (!container.isPlaying()) container.play();
        if (mediaControl.$el.hasClass('dvr')) container.seek(container.getDuration());
      }
    }, {
      key: "settingsUpdate",
      value: function settingsUpdate() {
        var _this2 = this;

        this.stopListening();
        this.core.mediaControl.$el.removeClass('live');

        if (this.shouldRender()) {
          this.render();
          this.$el.click(function () {
            return _this2.click();
          });
        }

        this.bindEvents();
      }
    }, {
      key: "shouldRender",
      value: function shouldRender() {
        var useDvrControls = this.core.options.useDvrControls === undefined || !!this.core.options.useDvrControls;
        return useDvrControls && this.core.getPlaybackType() === core.Playback.LIVE;
      }
    }, {
      key: "render",
      value: function render() {
        this.$el.html(this.template({
          live: this.core.i18n.t('live'),
          backToLive: this.core.i18n.t('back_to_live')
        }));

        if (this.shouldRender()) {
          this.core.mediaControl.$el.addClass('live');
          this.core.mediaControl.$('.media-control-left-panel[data-media-control]').append(this.$el);
        }

        return this;
      }
    }]);

    return DVRControls;
  }(core.UICorePlugin);

  var EndVideo =
  /*#__PURE__*/
  function (_CorePlugin) {
    _inherits(EndVideo, _CorePlugin);

    function EndVideo() {
      _classCallCheck(this, EndVideo);

      return _possibleConstructorReturn(this, _getPrototypeOf(EndVideo).apply(this, arguments));
    }

    _createClass(EndVideo, [{
      key: "bindEvents",
      value: function bindEvents() {
        this.listenTo(this.core, core.Events.CORE_ACTIVE_CONTAINER_CHANGED, this.containerChanged);
        var container = this.core.activeContainer;

        if (container) {
          this.listenTo(container, core.Events.CONTAINER_ENDED, this.ended);
          this.listenTo(container, core.Events.CONTAINER_STOP, this.ended);
        }
      }
    }, {
      key: "containerChanged",
      value: function containerChanged() {
        this.stopListening();
        this.bindEvents();
      }
    }, {
      key: "ended",
      value: function ended() {
        var exitOnEnd = typeof this.core.options.exitFullscreenOnEnd === 'undefined' || this.core.options.exitFullscreenOnEnd;
        if (exitOnEnd && this.core.isFullscreen()) this.core.toggleFullscreen();
      }
    }, {
      key: "name",
      get: function get() {
        return 'end_video';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.5"
        };
      }
    }]);

    return EndVideo;
  }(core.CorePlugin);

  var reloadIcon = "<svg fill=\"#FFFFFF\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\">\n    <path d=\"M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z\"/>\n    <path d=\"M0 0h24v24H0z\" fill=\"none\"/>\n</svg>";

  var templateHtml = "<div class=\"player-error-screen__content\" data-error-screen>\n  <% if (icon) { %>\n  <div class=\"player-error-screen__icon\" data-error-screen><%= icon %></div>\n  <% } %>\n  <div class=\"player-error-screen__title\" data-error-screen><%= title %></div>\n  <div class=\"player-error-screen__message\" data-error-screen><%= message %></div>\n  <div class=\"player-error-screen__code\" data-error-screen>Error code: <%= code %></div>\n  <div class=\"player-error-screen__reload\" data-error-screen><%= reloadIcon %></div>\n</div>\n";

  var css$2 = "div.player-error-screen {\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  color: #CCCACA;\n  position: absolute;\n  top: 0;\n  height: 100%;\n  width: 100%;\n  background-color: rgba(0, 0, 0, 0.7);\n  z-index: 2000;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  -webkit-box-pack: center;\n          justify-content: center; }\n  div.player-error-screen__content[data-error-screen] {\n    font-size: 14px;\n    color: #CCCACA;\n    margin-top: 45px; }\n  div.player-error-screen__title[data-error-screen] {\n    font-weight: bold;\n    line-height: 30px;\n    font-size: 18px; }\n  div.player-error-screen__message[data-error-screen] {\n    width: 90%;\n    margin: 0 auto; }\n  div.player-error-screen__code[data-error-screen] {\n    font-size: 13px;\n    margin-top: 15px; }\n  div.player-error-screen__reload {\n    cursor: pointer;\n    width: 30px;\n    margin: 15px auto 0; }\n";
  styleInject(css$2);

  var ErrorScreen =
  /*#__PURE__*/
  function (_UICorePlugin) {
    _inherits(ErrorScreen, _UICorePlugin);

    _createClass(ErrorScreen, [{
      key: "name",
      get: function get() {
        return 'error_screen';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.5"
        };
      }
    }, {
      key: "template",
      get: function get() {
        return core.template(templateHtml);
      }
    }, {
      key: "container",
      get: function get() {
        return this.core.getCurrentContainer();
      }
    }, {
      key: "attributes",
      get: function get() {
        return {
          'class': 'player-error-screen',
          'data-error-screen': ''
        };
      }
    }]);

    function ErrorScreen(core) {
      var _this;

      _classCallCheck(this, ErrorScreen);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ErrorScreen).call(this, core));
      if (_this.options.disableErrorScreen) return _possibleConstructorReturn(_this, _this.disable());
      return _this;
    }

    _createClass(ErrorScreen, [{
      key: "bindEvents",
      value: function bindEvents() {
        this.listenTo(this.core, core.Events.ERROR, this.onError);
        this.listenTo(this.core, core.Events.CORE_ACTIVE_CONTAINER_CHANGED, this.onContainerChanged);
      }
    }, {
      key: "bindReload",
      value: function bindReload() {
        this.reloadButton = this.$el.find('.player-error-screen__reload');
        this.reloadButton && this.reloadButton.on('click', this.reload.bind(this));
      }
    }, {
      key: "reload",
      value: function reload() {
        var _this2 = this;

        this.listenToOnce(this.core, core.Events.CORE_READY, function () {
          return _this2.container.play();
        });
        this.core.load(this.options.sources, this.options.mimeType);
        this.unbindReload();
      }
    }, {
      key: "unbindReload",
      value: function unbindReload() {
        this.reloadButton && this.reloadButton.off('click');
      }
    }, {
      key: "onContainerChanged",
      value: function onContainerChanged() {
        this.err = null;
        this.unbindReload();
        this.hide();
      }
    }, {
      key: "onError",
      value: function onError() {
        var err = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (err.level === core.PlayerError.Levels.FATAL) {
          this.err = err;
          this.container.disableMediaControl();
          this.container.stop();
          this.show();
        }
      }
    }, {
      key: "show",
      value: function show() {
        this.render();
        this.$el.show();
      }
    }, {
      key: "hide",
      value: function hide() {
        this.$el.hide();
      }
    }, {
      key: "render",
      value: function render() {
        if (!this.err) return;
        this.$el.html(this.template({
          title: this.err.UI.title,
          message: this.err.UI.message,
          code: this.err.code,
          icon: this.err.UI.icon || '',
          reloadIcon: reloadIcon
        }));
        this.core.$el.append(this.el);
        this.bindReload();
        return this;
      }
    }]);

    return ErrorScreen;
  }(core.UICorePlugin);

  var playIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\">\n  <path fill=\"#010101\" d=\"M1.425.35L14.575 8l-13.15 7.65V.35z\"/>\n</svg>";

  var pauseIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\">\n  <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#010101\" d=\"M1.712 14.76H6.43V1.24H1.71v13.52zm7.86-13.52v13.52h4.716V1.24H9.573z\"/>\n</svg>";

  var oldIcon = core.$('link[rel="shortcut icon"]');

  var Favicon =
  /*#__PURE__*/
  function (_CorePlugin) {
    _inherits(Favicon, _CorePlugin);

    _createClass(Favicon, [{
      key: "name",
      get: function get() {
        return 'favicon';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.5"
        };
      }
    }, {
      key: "oldIcon",
      get: function get() {
        return oldIcon;
      }
    }]);

    function Favicon(core) {
      var _this;

      _classCallCheck(this, Favicon);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Favicon).call(this, core));
      _this._container = null;

      _this.configure();

      return _this;
    }

    _createClass(Favicon, [{
      key: "configure",
      value: function configure() {
        if (this.core.options.changeFavicon) {
          if (!this.enabled) {
            this.stopListening(this.core, core.Events.CORE_OPTIONS_CHANGE);
            this.enable();
          }
        } else if (this.enabled) {
          this.disable();
          this.listenTo(this.core, core.Events.CORE_OPTIONS_CHANGE, this.configure);
        }
      }
    }, {
      key: "bindEvents",
      value: function bindEvents() {
        this.listenTo(this.core, core.Events.CORE_OPTIONS_CHANGE, this.configure);
        this.listenTo(this.core, core.Events.CORE_ACTIVE_CONTAINER_CHANGED, this.containerChanged);
        this.core.activeContainer && this.containerChanged();
      }
    }, {
      key: "containerChanged",
      value: function containerChanged() {
        this._container && this.stopListening(this._container);
        this._container = this.core.activeContainer;
        this.listenTo(this._container, core.Events.CONTAINER_PLAY, this.setPlayIcon);
        this.listenTo(this._container, core.Events.CONTAINER_PAUSE, this.setPauseIcon);
        this.listenTo(this._container, core.Events.CONTAINER_STOP, this.resetIcon);
        this.listenTo(this._container, core.Events.CONTAINER_ENDED, this.resetIcon);
        this.listenTo(this._container, core.Events.CONTAINER_ERROR, this.resetIcon);
        this.resetIcon();
      }
    }, {
      key: "disable",
      value: function disable() {
        _get(_getPrototypeOf(Favicon.prototype), "disable", this).call(this);

        this.resetIcon();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        _get(_getPrototypeOf(Favicon.prototype), "destroy", this).call(this);

        this.resetIcon();
      }
    }, {
      key: "createIcon",
      value: function createIcon(svg) {
        var canvas = core.$('<canvas/>');
        canvas[0].width = 16;
        canvas[0].height = 16;
        var ctx = canvas[0].getContext('2d');
        ctx.fillStyle = '#000';
        var d = core.$(svg).find('path').attr('d');
        var path = new Path2D(d);
        ctx.fill(path);
        var icon = core.$('<link rel="shortcut icon" type="image/png"/>');
        icon.attr('href', canvas[0].toDataURL('image/png'));
        return icon;
      }
    }, {
      key: "setPlayIcon",
      value: function setPlayIcon() {
        if (!this.playIcon) this.playIcon = this.createIcon(playIcon);
        this.changeIcon(this.playIcon);
      }
    }, {
      key: "setPauseIcon",
      value: function setPauseIcon() {
        if (!this.pauseIcon) this.pauseIcon = this.createIcon(pauseIcon);
        this.changeIcon(this.pauseIcon);
      }
    }, {
      key: "resetIcon",
      value: function resetIcon() {
        core.$('link[rel="shortcut icon"]').remove();
        core.$('head').append(this.oldIcon);
      }
    }, {
      key: "changeIcon",
      value: function changeIcon(icon) {
        if (icon) {
          core.$('link[rel="shortcut icon"]').remove();
          core.$('head').append(icon);
        }
      }
    }]);

    return Favicon;
  }(core.CorePlugin);

  var GoogleAnalytics =
  /*#__PURE__*/
  function (_ContainerPlugin) {
    _inherits(GoogleAnalytics, _ContainerPlugin);

    _createClass(GoogleAnalytics, [{
      key: "name",
      get: function get() {
        return 'google_analytics';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.5"
        };
      }
    }]);

    function GoogleAnalytics(container) {
      var _this;

      _classCallCheck(this, GoogleAnalytics);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GoogleAnalytics).call(this, container));

      if (_this.container.options.gaAccount) {
        _this.account = _this.container.options.gaAccount;
        _this.trackerName = _this.container.options.gaTrackerName ? _this.container.options.gaTrackerName + '.' : 'Clappr.';
        _this.domainName = _this.container.options.gaDomainName;
        _this.currentHDState = undefined;

        _this.embedScript();
      }

      return _this;
    }

    _createClass(GoogleAnalytics, [{
      key: "embedScript",
      value: function embedScript() {
        var _this2 = this;

        if (!window._gat) {
          var script = document.createElement('script');
          script.setAttribute('type', 'text/javascript');
          script.setAttribute('async', 'async');
          script.setAttribute('src', '//www.google-analytics.com/ga.js');

          script.onload = function () {
            return _this2.addEventListeners();
          };

          document.body.appendChild(script);
        } else {
          this.addEventListeners();
        }
      }
    }, {
      key: "addEventListeners",
      value: function addEventListeners() {
        var _this3 = this;

        if (this.container) {
          this.listenTo(this.container, core.Events.CONTAINER_READY, this.onReady);
          this.listenTo(this.container, core.Events.CONTAINER_PLAY, this.onPlay);
          this.listenTo(this.container, core.Events.CONTAINER_STOP, this.onStop);
          this.listenTo(this.container, core.Events.CONTAINER_PAUSE, this.onPause);
          this.listenTo(this.container, core.Events.CONTAINER_ENDED, this.onEnded);
          this.listenTo(this.container, core.Events.CONTAINER_STATE_BUFFERING, this.onBuffering);
          this.listenTo(this.container, core.Events.CONTAINER_STATE_BUFFERFULL, this.onBufferFull);
          this.listenTo(this.container, core.Events.CONTAINER_ERROR, this.onError);
          this.listenTo(this.container, core.Events.CONTAINER_PLAYBACKSTATE, this.onPlaybackChanged);
          this.listenTo(this.container, core.Events.CONTAINER_VOLUME, function (event) {
            return _this3.onVolumeChanged(event);
          });
          this.listenTo(this.container, core.Events.CONTAINER_SEEK, function (event) {
            return _this3.onSeek(event);
          });
          this.listenTo(this.container, core.Events.CONTAINER_FULL_SCREEN, this.onFullscreen);
          this.listenTo(this.container, core.Events.CONTAINER_HIGHDEFINITIONUPDATE, this.onHD);
          this.listenTo(this.container, core.Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.onDVR);
        }

        _gaq.push([this.trackerName + '_setAccount', this.account]);

        if (this.domainName) _gaq.push([this.trackerName + '_setDomainName', this.domainName]);
      }
    }, {
      key: "onReady",
      value: function onReady() {
        this.push(['Video', 'Playback', this.container.playback.name]);
      }
    }, {
      key: "onPlay",
      value: function onPlay() {
        this.push(['Video', 'Play', this.container.playback.src]);
      }
    }, {
      key: "onStop",
      value: function onStop() {
        this.push(['Video', 'Stop', this.container.playback.src]);
      }
    }, {
      key: "onEnded",
      value: function onEnded() {
        this.push(['Video', 'Ended', this.container.playback.src]);
      }
    }, {
      key: "onBuffering",
      value: function onBuffering() {
        this.push(['Video', 'Buffering', this.container.playback.src]);
      }
    }, {
      key: "onBufferFull",
      value: function onBufferFull() {
        this.push(['Video', 'Bufferfull', this.container.playback.src]);
      }
    }, {
      key: "onError",
      value: function onError() {
        this.push(['Video', 'Error', this.container.playback.src]);
      }
    }, {
      key: "onHD",
      value: function onHD(isHD) {
        var status = isHD ? 'ON' : 'OFF';

        if (status !== this.currentHDState) {
          this.currentHDState = status;
          this.push(['Video', 'HD - ' + status, this.container.playback.src]);
        }
      }
    }, {
      key: "onPlaybackChanged",
      value: function onPlaybackChanged(playbackState) {
        if (playbackState.type !== null) this.push(['Video', 'Playback Type - ' + playbackState.type, this.container.playback.src]);
      }
    }, {
      key: "onDVR",
      value: function onDVR(dvrInUse) {
        var status = dvrInUse ? 'ON' : 'OFF';
        this.push(['Interaction', 'DVR - ' + status, this.container.playback.src]);
      }
    }, {
      key: "onPause",
      value: function onPause() {
        this.push(['Video', 'Pause', this.container.playback.src]);
      }
    }, {
      key: "onSeek",
      value: function onSeek() {
        this.push(['Video', 'Seek', this.container.playback.src]);
      }
    }, {
      key: "onVolumeChanged",
      value: function onVolumeChanged() {
        this.push(['Interaction', 'Volume', this.container.playback.src]);
      }
    }, {
      key: "onFullscreen",
      value: function onFullscreen() {
        this.push(['Interaction', 'Fullscreen', this.container.playback.src]);
      }
    }, {
      key: "push",
      value: function push(array) {
        var res = [this.trackerName + '_trackEvent'].concat(array);

        _gaq.push(res);
      }
    }]);

    return GoogleAnalytics;
  }(core.ContainerPlugin);

  var global$1 = (typeof global !== "undefined" ? global :
              typeof self !== "undefined" ? self :
              typeof window !== "undefined" ? window : {});

  // shim for using process in browser
  // based off https://github.com/defunctzombie/node-process/blob/master/browser.js

  function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
  }
  function defaultClearTimeout () {
      throw new Error('clearTimeout has not been defined');
  }
  var cachedSetTimeout = defaultSetTimout;
  var cachedClearTimeout = defaultClearTimeout;
  if (typeof global$1.setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
  }
  if (typeof global$1.clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
  }

  function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
          //normal enviroments in sane situations
          return setTimeout(fun, 0);
      }
      // if setTimeout wasn't available but was latter defined
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedSetTimeout(fun, 0);
      } catch(e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
              return cachedSetTimeout.call(null, fun, 0);
          } catch(e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
              return cachedSetTimeout.call(this, fun, 0);
          }
      }


  }
  function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
          //normal enviroments in sane situations
          return clearTimeout(marker);
      }
      // if clearTimeout wasn't available but was latter defined
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
      }
      try {
          // when when somebody has screwed with setTimeout but no I.E. maddness
          return cachedClearTimeout(marker);
      } catch (e){
          try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
              return cachedClearTimeout.call(null, marker);
          } catch (e){
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
              // Some versions of I.E. have different rules for clearTimeout vs setTimeout
              return cachedClearTimeout.call(this, marker);
          }
      }



  }
  var queue = [];
  var draining = false;
  var currentQueue;
  var queueIndex = -1;

  function cleanUpNextTick() {
      if (!draining || !currentQueue) {
          return;
      }
      draining = false;
      if (currentQueue.length) {
          queue = currentQueue.concat(queue);
      } else {
          queueIndex = -1;
      }
      if (queue.length) {
          drainQueue();
      }
  }

  function drainQueue() {
      if (draining) {
          return;
      }
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;

      var len = queue.length;
      while(len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
              if (currentQueue) {
                  currentQueue[queueIndex].run();
              }
          }
          queueIndex = -1;
          len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
  }
  function nextTick(fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
          }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
      }
  }
  // v8 likes predictible objects
  function Item(fun, array) {
      this.fun = fun;
      this.array = array;
  }
  Item.prototype.run = function () {
      this.fun.apply(null, this.array);
  };

  // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
  var performance = global$1.performance || {};
  var performanceNow =
    performance.now        ||
    performance.mozNow     ||
    performance.msNow      ||
    performance.oNow       ||
    performance.webkitNow  ||
    function(){ return (new Date()).getTime() };

  /* eslint-disable */
  // Kibo is released under the MIT License. Copyright (c) 2013 marquete.
  // see https://github.com/marquete/kibo
  var Kibo = function Kibo(element) {
    this.element = element || window.document;
    this.initialize();
  };

  Kibo.KEY_NAMES_BY_CODE = {
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    20: 'caps_lock',
    27: 'esc',
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'i',
    74: 'j',
    75: 'k',
    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'w',
    88: 'x',
    89: 'y',
    90: 'z',
    112: 'f1',
    113: 'f2',
    114: 'f3',
    115: 'f4',
    116: 'f5',
    117: 'f6',
    118: 'f7',
    119: 'f8',
    120: 'f9',
    121: 'f10',
    122: 'f11',
    123: 'f12'
  };
  Kibo.KEY_CODES_BY_NAME = {};

  (function () {
    for (var key in Kibo.KEY_NAMES_BY_CODE) {
      if (Object.prototype.hasOwnProperty.call(Kibo.KEY_NAMES_BY_CODE, key)) {
        Kibo.KEY_CODES_BY_NAME[Kibo.KEY_NAMES_BY_CODE[key]] = +key;
      }
    }
  })();

  Kibo.MODIFIERS = ['shift', 'ctrl', 'alt'];

  Kibo.registerEvent = function () {
    if (document.addEventListener) {
      return function (element, eventName, func) {
        element.addEventListener(eventName, func, false);
      };
    } else if (document.attachEvent) {
      return function (element, eventName, func) {
        element.attachEvent('on' + eventName, func);
      };
    }
  }();

  Kibo.unregisterEvent = function () {
    if (document.removeEventListener) {
      return function (element, eventName, func) {
        element.removeEventListener(eventName, func, false);
      };
    } else if (document.detachEvent) {
      return function (element, eventName, func) {
        element.detachEvent('on' + eventName, func);
      };
    }
  }();

  Kibo.stringContains = function (string, substring) {
    return string.indexOf(substring) !== -1;
  };

  Kibo.neatString = function (string) {
    return string.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
  };

  Kibo.capitalize = function (string) {
    return string.toLowerCase().replace(/^./, function (match) {
      return match.toUpperCase();
    });
  };

  Kibo.isString = function (what) {
    return Kibo.stringContains(Object.prototype.toString.call(what), 'String');
  };

  Kibo.arrayIncludes = function () {
    if (Array.prototype.indexOf) {
      return function (haystack, needle) {
        return haystack.indexOf(needle) !== -1;
      };
    } else {
      return function (haystack, needle) {
        for (var i = 0; i < haystack.length; i++) {
          if (haystack[i] === needle) {
            return true;
          }
        }

        return false;
      };
    }
  }();

  Kibo.extractModifiers = function (keyCombination) {
    var modifiers, i;
    modifiers = [];

    for (i = 0; i < Kibo.MODIFIERS.length; i++) {
      if (Kibo.stringContains(keyCombination, Kibo.MODIFIERS[i])) {
        modifiers.push(Kibo.MODIFIERS[i]);
      }
    }

    return modifiers;
  };

  Kibo.extractKey = function (keyCombination) {
    var keys, i;
    keys = Kibo.neatString(keyCombination).split(' ');

    for (i = 0; i < keys.length; i++) {
      if (!Kibo.arrayIncludes(Kibo.MODIFIERS, keys[i])) {
        return keys[i];
      }
    }
  };

  Kibo.modifiersAndKey = function (keyCombination) {
    var result, key;

    if (Kibo.stringContains(keyCombination, 'any')) {
      return Kibo.neatString(keyCombination).split(' ').slice(0, 2).join(' ');
    }

    result = Kibo.extractModifiers(keyCombination);
    key = Kibo.extractKey(keyCombination);

    if (key && !Kibo.arrayIncludes(Kibo.MODIFIERS, key)) {
      result.push(key);
    }

    return result.join(' ');
  };

  Kibo.keyName = function (keyCode) {
    return Kibo.KEY_NAMES_BY_CODE[keyCode + ''];
  };

  Kibo.keyCode = function (keyName) {
    return +Kibo.KEY_CODES_BY_NAME[keyName];
  };

  Kibo.prototype.initialize = function () {
    var i,
        that = this;
    this.lastKeyCode = -1;
    this.lastModifiers = {};

    for (i = 0; i < Kibo.MODIFIERS.length; i++) {
      this.lastModifiers[Kibo.MODIFIERS[i]] = false;
    }

    this.keysDown = {
      any: []
    };
    this.keysUp = {
      any: []
    };
    this.downHandler = this.handler('down');
    this.upHandler = this.handler('up');
    Kibo.registerEvent(this.element, 'keydown', this.downHandler);
    Kibo.registerEvent(this.element, 'keyup', this.upHandler);
    Kibo.registerEvent(window, 'unload', function unloader() {
      Kibo.unregisterEvent(that.element, 'keydown', that.downHandler);
      Kibo.unregisterEvent(that.element, 'keyup', that.upHandler);
      Kibo.unregisterEvent(window, 'unload', unloader);
    });
  };

  Kibo.prototype.handler = function (upOrDown) {
    var that = this;
    return function (e) {
      var i, registeredKeys, lastModifiersAndKey;
      e = e || window.event;
      that.lastKeyCode = e.keyCode;

      for (i = 0; i < Kibo.MODIFIERS.length; i++) {
        that.lastModifiers[Kibo.MODIFIERS[i]] = e[Kibo.MODIFIERS[i] + 'Key'];
      }

      if (Kibo.arrayIncludes(Kibo.MODIFIERS, Kibo.keyName(that.lastKeyCode))) {
        that.lastModifiers[Kibo.keyName(that.lastKeyCode)] = true;
      }

      registeredKeys = that['keys' + Kibo.capitalize(upOrDown)];

      for (i = 0; i < registeredKeys.any.length; i++) {
        if (registeredKeys.any[i](e) === false && e.preventDefault) {
          e.preventDefault();
        }
      }

      lastModifiersAndKey = that.lastModifiersAndKey();

      if (registeredKeys[lastModifiersAndKey]) {
        for (i = 0; i < registeredKeys[lastModifiersAndKey].length; i++) {
          if (registeredKeys[lastModifiersAndKey][i](e) === false && e.preventDefault) {
            e.preventDefault();
          }
        }
      }
    };
  };

  Kibo.prototype.registerKeys = function (upOrDown, newKeys, func) {
    var i,
        keys,
        registeredKeys = this['keys' + Kibo.capitalize(upOrDown)];

    if (Kibo.isString(newKeys)) {
      newKeys = [newKeys];
    }

    for (i = 0; i < newKeys.length; i++) {
      keys = newKeys[i];
      keys = Kibo.modifiersAndKey(keys + '');

      if (registeredKeys[keys]) {
        registeredKeys[keys].push(func);
      } else {
        registeredKeys[keys] = [func];
      }
    }

    return this;
  }; // jshint maxdepth:5


  Kibo.prototype.unregisterKeys = function (upOrDown, newKeys, func) {
    var i,
        j,
        keys,
        registeredKeys = this['keys' + Kibo.capitalize(upOrDown)];

    if (Kibo.isString(newKeys)) {
      newKeys = [newKeys];
    }

    for (i = 0; i < newKeys.length; i++) {
      keys = newKeys[i];
      keys = Kibo.modifiersAndKey(keys + '');

      if (func === null) {
        delete registeredKeys[keys];
      } else {
        if (registeredKeys[keys]) {
          for (j = 0; j < registeredKeys[keys].length; j++) {
            if (String(registeredKeys[keys][j]) === String(func)) {
              registeredKeys[keys].splice(j, 1);
              break;
            }
          }
        }
      }
    }

    return this;
  };

  Kibo.prototype.off = function (keys) {
    return this.unregisterKeys('down', keys, null);
  };

  Kibo.prototype.delegate = function (upOrDown, keys, func) {
    return func !== null || func !== undefined ? this.registerKeys(upOrDown, keys, func) : this.unregisterKeys(upOrDown, keys, func);
  };

  Kibo.prototype.down = function (keys, func) {
    return this.delegate('down', keys, func);
  };

  Kibo.prototype.up = function (keys, func) {
    return this.delegate('up', keys, func);
  };

  Kibo.prototype.lastKey = function (modifier) {
    if (!modifier) {
      return Kibo.keyName(this.lastKeyCode);
    }

    return this.lastModifiers[modifier];
  };

  Kibo.prototype.lastModifiersAndKey = function () {
    var result, i;
    result = [];

    for (i = 0; i < Kibo.MODIFIERS.length; i++) {
      if (this.lastKey(Kibo.MODIFIERS[i])) {
        result.push(Kibo.MODIFIERS[i]);
      }
    }

    if (!Kibo.arrayIncludes(result, this.lastKey())) {
      result.push(this.lastKey());
    }

    return result.join(' ');
  };

  var index = {
    Kibo: Kibo
  };

  var css$3 = ".media-control-notransition {\n  -webkit-transition: none !important;\n  transition: none !important; }\n\n.media-control[data-media-control] {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  z-index: 9999;\n  pointer-events: none; }\n  .media-control[data-media-control].dragging {\n    pointer-events: auto;\n    cursor: -webkit-grabbing !important;\n    cursor: grabbing !important;\n    cursor: url(\"closed-hand.cur\"), move; }\n    .media-control[data-media-control].dragging * {\n      cursor: -webkit-grabbing !important;\n      cursor: grabbing !important;\n      cursor: url(\"closed-hand.cur\"), move; }\n  .media-control[data-media-control] .media-control-background[data-background] {\n    position: absolute;\n    height: 40%;\n    width: 100%;\n    bottom: 0;\n    background: -webkit-gradient(linear, left top, left bottom, from(transparent), to(rgba(0, 0, 0, 0.9)));\n    background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));\n    -webkit-transition: opacity 0.6s ease-out;\n    transition: opacity 0.6s ease-out; }\n  .media-control[data-media-control] .media-control-icon {\n    line-height: 0;\n    letter-spacing: 0;\n    speak: none;\n    color: #fff;\n    opacity: 0.5;\n    vertical-align: middle;\n    text-align: left;\n    -webkit-transition: all 0.1s ease;\n    transition: all 0.1s ease; }\n  .media-control[data-media-control] .media-control-icon:hover {\n    color: white;\n    opacity: 0.75;\n    text-shadow: rgba(255, 255, 255, 0.8) 0 0 5px; }\n  .media-control[data-media-control].media-control-hide .media-control-background[data-background] {\n    opacity: 0; }\n  .media-control[data-media-control].media-control-hide .media-control-layer[data-controls] {\n    bottom: -50px; }\n    .media-control[data-media-control].media-control-hide .media-control-layer[data-controls] .bar-container[data-seekbar] .bar-scrubber[data-seekbar] {\n      opacity: 0; }\n  .media-control[data-media-control] .media-control-layer[data-controls] {\n    position: absolute;\n    bottom: 7px;\n    width: 100%;\n    height: 32px;\n    font-size: 0;\n    vertical-align: middle;\n    pointer-events: auto;\n    -webkit-transition: bottom 0.4s ease-out;\n    transition: bottom 0.4s ease-out; }\n    .media-control[data-media-control] .media-control-layer[data-controls] .media-control-left-panel[data-media-control] {\n      position: absolute;\n      top: 0;\n      left: 4px;\n      height: 100%; }\n    .media-control[data-media-control] .media-control-layer[data-controls] .media-control-center-panel[data-media-control] {\n      height: 100%;\n      text-align: center;\n      line-height: 32px; }\n    .media-control[data-media-control] .media-control-layer[data-controls] .media-control-right-panel[data-media-control] {\n      position: absolute;\n      top: 0;\n      right: 4px;\n      height: 100%; }\n    .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button {\n      background-color: transparent;\n      border: 0;\n      margin: 0 6px;\n      padding: 0;\n      cursor: pointer;\n      display: inline-block;\n      width: 32px;\n      height: 100%; }\n      .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button svg {\n        width: 100%;\n        height: 22px; }\n        .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button svg path {\n          fill: white; }\n      .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button:focus {\n        outline: none; }\n      .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button[data-play] {\n        float: left;\n        height: 100%; }\n      .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button[data-pause] {\n        float: left;\n        height: 100%; }\n      .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button[data-stop] {\n        float: left;\n        height: 100%; }\n      .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button[data-fullscreen] {\n        float: right;\n        background-color: transparent;\n        border: 0;\n        height: 100%; }\n      .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button[data-hd-indicator] {\n        background-color: transparent;\n        border: 0;\n        cursor: default;\n        display: none;\n        float: right;\n        height: 100%; }\n        .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button[data-hd-indicator].enabled {\n          display: block;\n          opacity: 1.0; }\n          .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button[data-hd-indicator].enabled:hover {\n            opacity: 1.0;\n            text-shadow: none; }\n      .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button[data-playpause] {\n        float: left; }\n      .media-control[data-media-control] .media-control-layer[data-controls] button.media-control-button[data-playstop] {\n        float: left; }\n    .media-control[data-media-control] .media-control-layer[data-controls] .media-control-indicator[data-position], .media-control[data-media-control] .media-control-layer[data-controls] .media-control-indicator[data-duration] {\n      display: inline-block;\n      font-size: 10px;\n      color: white;\n      cursor: default;\n      line-height: 32px;\n      position: relative; }\n    .media-control[data-media-control] .media-control-layer[data-controls] .media-control-indicator[data-position] {\n      margin: 0 6px 0 7px; }\n    .media-control[data-media-control] .media-control-layer[data-controls] .media-control-indicator[data-duration] {\n      color: rgba(255, 255, 255, 0.5);\n      margin-right: 6px; }\n      .media-control[data-media-control] .media-control-layer[data-controls] .media-control-indicator[data-duration]:before {\n        content: \"|\";\n        margin-right: 7px; }\n    .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar] {\n      position: absolute;\n      top: -20px;\n      left: 0;\n      display: inline-block;\n      vertical-align: middle;\n      width: 100%;\n      height: 25px;\n      cursor: pointer; }\n      .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar] .bar-background[data-seekbar] {\n        width: 100%;\n        height: 1px;\n        position: relative;\n        top: 12px;\n        background-color: #666666; }\n        .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar] .bar-background[data-seekbar] .bar-fill-1[data-seekbar] {\n          position: absolute;\n          top: 0;\n          left: 0;\n          width: 0;\n          height: 100%;\n          background-color: #c2c2c2;\n          -webkit-transition: all 0.1s ease-out;\n          transition: all 0.1s ease-out; }\n        .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar] .bar-background[data-seekbar] .bar-fill-2[data-seekbar] {\n          position: absolute;\n          top: 0;\n          left: 0;\n          width: 0;\n          height: 100%;\n          background-color: #005aff;\n          -webkit-transition: all 0.1s ease-out;\n          transition: all 0.1s ease-out; }\n        .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar] .bar-background[data-seekbar] .bar-hover[data-seekbar] {\n          opacity: 0;\n          position: absolute;\n          top: -3px;\n          width: 5px;\n          height: 7px;\n          background-color: rgba(255, 255, 255, 0.5);\n          -webkit-transition: opacity 0.1s ease;\n          transition: opacity 0.1s ease; }\n      .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar]:hover .bar-background[data-seekbar] .bar-hover[data-seekbar] {\n        opacity: 1; }\n      .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar].seek-disabled {\n        cursor: default; }\n        .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar].seek-disabled:hover .bar-background[data-seekbar] .bar-hover[data-seekbar] {\n          opacity: 0; }\n      .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar] .bar-scrubber[data-seekbar] {\n        position: absolute;\n        -webkit-transform: translateX(-50%);\n                transform: translateX(-50%);\n        top: 2px;\n        left: 0;\n        width: 20px;\n        height: 20px;\n        opacity: 1;\n        -webkit-transition: all 0.1s ease-out;\n        transition: all 0.1s ease-out; }\n        .media-control[data-media-control] .media-control-layer[data-controls] .bar-container[data-seekbar] .bar-scrubber[data-seekbar] .bar-scrubber-icon[data-seekbar] {\n          position: absolute;\n          left: 6px;\n          top: 6px;\n          width: 8px;\n          height: 8px;\n          border-radius: 10px;\n          box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.2);\n          background-color: white; }\n    .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] {\n      float: right;\n      display: inline-block;\n      height: 32px;\n      cursor: pointer;\n      margin: 0 6px;\n      box-sizing: border-box; }\n      .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .drawer-icon-container[data-volume] {\n        float: left;\n        bottom: 0; }\n        .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .drawer-icon-container[data-volume] .drawer-icon[data-volume] {\n          background-color: transparent;\n          border: 0;\n          box-sizing: content-box;\n          width: 32px;\n          height: 32px;\n          opacity: 0.5; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .drawer-icon-container[data-volume] .drawer-icon[data-volume]:hover {\n            opacity: 0.75; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .drawer-icon-container[data-volume] .drawer-icon[data-volume] svg {\n            height: 24px;\n            position: relative;\n            top: 3px; }\n            .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .drawer-icon-container[data-volume] .drawer-icon[data-volume] svg path {\n              fill: white; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .drawer-icon-container[data-volume] .drawer-icon[data-volume].muted svg {\n            margin-left: 2px; }\n      .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] {\n        float: left;\n        position: relative;\n        overflow: hidden;\n        top: 6px;\n        width: 42px;\n        height: 18px;\n        padding: 3px 0;\n        -webkit-transition: width .2s ease-out;\n        transition: width .2s ease-out; }\n        .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .bar-background[data-volume] {\n          height: 1px;\n          position: relative;\n          top: 7px;\n          margin: 0 3px;\n          background-color: #666666; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .bar-background[data-volume] .bar-fill-1[data-volume] {\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 0;\n            height: 100%;\n            background-color: #c2c2c2;\n            -webkit-transition: all 0.1s ease-out;\n            transition: all 0.1s ease-out; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .bar-background[data-volume] .bar-fill-2[data-volume] {\n            position: absolute;\n            top: 0;\n            left: 0;\n            width: 0;\n            height: 100%;\n            background-color: #005aff;\n            -webkit-transition: all 0.1s ease-out;\n            transition: all 0.1s ease-out; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .bar-background[data-volume] .bar-hover[data-volume] {\n            opacity: 0;\n            position: absolute;\n            top: -3px;\n            width: 5px;\n            height: 7px;\n            background-color: rgba(255, 255, 255, 0.5);\n            -webkit-transition: opacity 0.1s ease;\n            transition: opacity 0.1s ease; }\n        .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .bar-scrubber[data-volume] {\n          position: absolute;\n          -webkit-transform: translateX(-50%);\n                  transform: translateX(-50%);\n          top: 0px;\n          left: 0;\n          width: 20px;\n          height: 20px;\n          opacity: 1;\n          -webkit-transition: all 0.1s ease-out;\n          transition: all 0.1s ease-out; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .bar-scrubber[data-volume] .bar-scrubber-icon[data-volume] {\n            position: absolute;\n            left: 6px;\n            top: 6px;\n            width: 8px;\n            height: 8px;\n            border-radius: 10px;\n            box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.2);\n            background-color: white; }\n        .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .segmented-bar-element[data-volume] {\n          float: left;\n          width: 4px;\n          padding-left: 2px;\n          height: 12px;\n          opacity: 0.5;\n          box-shadow: inset 2px 0 0 white;\n          -webkit-transition: -webkit-transform .2s ease-out;\n          transition: -webkit-transform .2s ease-out;\n          transition: transform .2s ease-out;\n          transition: transform .2s ease-out, -webkit-transform .2s ease-out; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .segmented-bar-element[data-volume].fill {\n            box-shadow: inset 2px 0 0 #fff;\n            opacity: 1; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .segmented-bar-element[data-volume]:nth-of-type(1) {\n            padding-left: 0; }\n          .media-control[data-media-control] .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume] .segmented-bar-element[data-volume]:hover {\n            -webkit-transform: scaleY(1.5);\n                    transform: scaleY(1.5); }\n  .media-control[data-media-control].w320 .media-control-layer[data-controls] .drawer-container[data-volume] .bar-container[data-volume].volume-bar-hide {\n    width: 0;\n    height: 12px;\n    top: 9px;\n    padding: 0; }\n";
  styleInject(css$3);

  var mediaControlHTML = "<div class=\"media-control-background\" data-background></div>\n<div class=\"media-control-layer\" data-controls>\n  <%  var renderBar = function(name) { %>\n      <div class=\"bar-container\" data-<%= name %>>\n        <div class=\"bar-background\" data-<%= name %>>\n          <div class=\"bar-fill-1\" data-<%= name %>></div>\n          <div class=\"bar-fill-2\" data-<%= name %>></div>\n          <div class=\"bar-hover\" data-<%= name %>></div>\n        </div>\n        <div class=\"bar-scrubber\" data-<%= name %>>\n          <div class=\"bar-scrubber-icon\" data-<%= name %>></div>\n        </div>\n      </div>\n  <%  }; %>\n  <%  var renderSegmentedBar = function(name, segments) {\n      segments = segments || 10; %>\n    <div class=\"bar-container\" data-<%= name %>>\n    <% for (var i = 0; i < segments; i++) { %>\n      <div class=\"segmented-bar-element\" data-<%= name %>></div>\n    <% } %>\n    </div>\n  <% }; %>\n  <% var renderDrawer = function(name, renderContent) { %>\n      <div class=\"drawer-container\" data-<%= name %>>\n        <div class=\"drawer-icon-container\" data-<%= name %>>\n          <div class=\"drawer-icon media-control-icon\" data-<%= name %>></div>\n          <span class=\"drawer-text\" data-<%= name %>></span>\n        </div>\n        <% renderContent(name); %>\n      </div>\n  <% }; %>\n  <% var renderIndicator = function(name) { %>\n      <div class=\"media-control-indicator\" data-<%= name %>></div>\n  <% }; %>\n  <% var renderButton = function(name) { %>\n    <button type=\"button\" class=\"media-control-button media-control-icon\" data-<%= name %> aria-label=\"<%= name %>\"></button>\n  <% }; %>\n  <%  var templates = {\n        bar: renderBar,\n        segmentedBar: renderSegmentedBar,\n      };\n      var render = function(settingsList) {\n        settingsList.forEach(function(setting) {\n          if(setting === \"seekbar\") {\n            renderBar(setting);\n          } else if (setting === \"volume\") {\n            renderDrawer(setting, settings.volumeBarTemplate ? templates[settings.volumeBarTemplate] : function(name) { return renderSegmentedBar(name); });\n          } else if (setting === \"duration\" || setting === \"position\") {\n            renderIndicator(setting);\n          } else {\n            renderButton(setting);\n          }\n        });\n      }; %>\n  <% if (settings.default && settings.default.length) { %>\n  <div class=\"media-control-center-panel\" data-media-control>\n    <% render(settings.default); %>\n  </div>\n  <% } %>\n  <% if (settings.left && settings.left.length) { %>\n  <div class=\"media-control-left-panel\" data-media-control>\n    <% render(settings.left); %>\n  </div>\n  <% } %>\n  <% if (settings.right && settings.right.length) { %>\n  <div class=\"media-control-right-panel\" data-media-control>\n    <% render(settings.right); %>\n  </div>\n  <% } %>\n</div>\n";

  var stopIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\">\n  <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#010101\" d=\"M1.712 1.24h12.6v13.52h-12.6z\"/>\n</svg>";

  var volumeIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\">\n  <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#010101\" d=\"M11.5 11h-.002v1.502L7.798 10H4.5V6h3.297l3.7-2.502V4.5h.003V11zM11 4.49L7.953 6.5H5v3h2.953L11 11.51V4.49z\"/>\n</svg>";

  var volumeMuteIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\">\n  <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#010101\" d=\"M9.75 11.51L6.7 9.5H3.75v-3H6.7L9.75 4.49v.664l.497.498V3.498L6.547 6H3.248v4h3.296l3.7 2.502v-2.154l-.497.5v.662zm3-5.165L12.404 6l-1.655 1.653L9.093 6l-.346.345L10.402 8 8.747 9.654l.346.347 1.655-1.653L12.403 10l.348-.346L11.097 8l1.655-1.655z\"/>\n</svg>";

  var fullscreenIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\">\n  <path fill=\"#010101\" d=\"M7.156 8L4 11.156V8.5H3V13h4.5v-1H4.844L8 8.844 7.156 8zM8.5 3v1h2.657L8 7.157 8.846 8 12 4.844V7.5h1V3H8.5z\"/>\n</svg>";

  var exitFullscreenIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\">\n  <path fill=\"#010101\" d=\"M13.5 3.344l-.844-.844L9.5 5.656V3h-1v4.5H13v-1h-2.656L13.5 3.344zM3 9.5h2.656L2.5 12.656l.844.844L6.5 10.344V13h1V8.5H3v1z\"/>\n</svg>";

  var hdIcon = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\">\n  <path fill=\"#010101\" d=\"M5.375 7.062H2.637V4.26H.502v7.488h2.135V8.9h2.738v2.848h2.133V4.26H5.375v2.802zm5.97-2.81h-2.84v7.496h2.798c2.65 0 4.195-1.607 4.195-3.77v-.022c0-2.162-1.523-3.704-4.154-3.704zm2.06 3.758c0 1.21-.81 1.896-2.03 1.896h-.83V6.093h.83c1.22 0 2.03.696 2.03 1.896v.02z\"/>\n</svg>";

  var Config = core.Utils.Config,
      Fullscreen = core.Utils.Fullscreen,
      formatTime = core.Utils.formatTime,
      extend = core.Utils.extend,
      removeArrayItem = core.Utils.removeArrayItem;

  var MediaControl =
  /*#__PURE__*/
  function (_UICorePlugin) {
    _inherits(MediaControl, _UICorePlugin);

    _createClass(MediaControl, [{
      key: "name",
      get: function get() {
        return 'media_control';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.5"
        };
      }
    }, {
      key: "disabled",
      get: function get() {
        var playbackIsNOOP = this.container && this.container.getPlaybackType() === core.Playback.NO_OP;
        return this.userDisabled || playbackIsNOOP;
      }
    }, {
      key: "container",
      get: function get() {
        return this.core && this.core.activeContainer;
      }
    }, {
      key: "playback",
      get: function get() {
        return this.core && this.core.activePlayback;
      }
    }, {
      key: "attributes",
      get: function get() {
        return {
          'class': 'media-control',
          'data-media-control': ''
        };
      }
    }, {
      key: "events",
      get: function get() {
        return {
          'click [data-play]': 'play',
          'click [data-pause]': 'pause',
          'click [data-playpause]': 'togglePlayPause',
          'click [data-stop]': 'stop',
          'click [data-playstop]': 'togglePlayStop',
          'click [data-fullscreen]': 'toggleFullscreen',
          'click .bar-container[data-seekbar]': 'seek',
          'click .bar-container[data-volume]': 'onVolumeClick',
          'click .drawer-icon[data-volume]': 'toggleMute',
          'mouseenter .drawer-container[data-volume]': 'showVolumeBar',
          'mouseleave .drawer-container[data-volume]': 'hideVolumeBar',
          'mousedown .bar-container[data-volume]': 'startVolumeDrag',
          'mousemove .bar-container[data-volume]': 'mousemoveOnVolumeBar',
          'mousedown .bar-scrubber[data-seekbar]': 'startSeekDrag',
          'mousemove .bar-container[data-seekbar]': 'mousemoveOnSeekBar',
          'mouseleave .bar-container[data-seekbar]': 'mouseleaveOnSeekBar',
          'mouseenter .media-control-layer[data-controls]': 'setUserKeepVisible',
          'mouseleave .media-control-layer[data-controls]': 'resetUserKeepVisible'
        };
      }
    }, {
      key: "template",
      get: function get() {
        return core.template(mediaControlHTML);
      }
    }, {
      key: "volume",
      get: function get() {
        return this.container && this.container.isReady ? this.container.volume : this.intendedVolume;
      }
    }, {
      key: "muted",
      get: function get() {
        return this.volume === 0;
      }
    }]);

    function MediaControl(core$1) {
      var _this;

      _classCallCheck(this, MediaControl);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(MediaControl).call(this, core$1));
      _this.persistConfig = _this.options.persistConfig;
      _this.currentPositionValue = null;
      _this.currentDurationValue = null;
      _this.keepVisible = false;
      _this.fullScreenOnVideoTagSupported = null; // unknown

      _this.setInitialVolume();

      _this.settings = {
        left: ['play', 'stop', 'pause'],
        right: ['volume'],
        "default": ['position', 'seekbar', 'duration']
      };
      _this.kibo = new Kibo(_this.options.focusElement);

      _this.bindKeyEvents();

      if (_this.container) {
        if (!core.$.isEmptyObject(_this.container.settings)) _this.settings = core.$.extend({}, _this.container.settings);
      } else {
        _this.settings = {};
      }

      _this.userDisabled = false;
      if (_this.container && _this.container.mediaControlDisabled || _this.options.chromeless) _this.disable();

      _this.stopDragHandler = function (event) {
        return _this.stopDrag(event);
      };

      _this.updateDragHandler = function (event) {
        return _this.updateDrag(event);
      };

      core.$(document).bind('mouseup', _this.stopDragHandler);
      core.$(document).bind('mousemove', _this.updateDragHandler);
      return _this;
    }

    _createClass(MediaControl, [{
      key: "getExternalInterface",
      value: function getExternalInterface() {
        var _this2 = this;

        return {
          setVolume: this.setVolume,
          getVolume: function getVolume() {
            return _this2.volume;
          }
        };
      }
    }, {
      key: "bindEvents",
      value: function bindEvents() {
        var _this3 = this;

        this.stopListening();
        this.listenTo(this.core, core.Events.CORE_ACTIVE_CONTAINER_CHANGED, this.onActiveContainerChanged);
        this.listenTo(this.core, core.Events.CORE_MOUSE_MOVE, this.show);
        this.listenTo(this.core, core.Events.CORE_MOUSE_LEAVE, function () {
          return _this3.hide(_this3.options.hideMediaControlDelay);
        });
        this.listenTo(this.core, core.Events.CORE_FULLSCREEN, this.show);
        this.listenTo(this.core, core.Events.CORE_OPTIONS_CHANGE, this.configure);
        this.listenTo(this.core, core.Events.CORE_RESIZE, this.playerResize);
        this.bindContainerEvents();
      }
    }, {
      key: "bindContainerEvents",
      value: function bindContainerEvents() {
        if (!this.container) return;
        this.listenTo(this.container, core.Events.CONTAINER_PLAY, this.changeTogglePlay);
        this.listenTo(this.container, core.Events.CONTAINER_PAUSE, this.changeTogglePlay);
        this.listenTo(this.container, core.Events.CONTAINER_STOP, this.changeTogglePlay);
        this.listenTo(this.container, core.Events.CONTAINER_DBLCLICK, this.toggleFullscreen);
        this.listenTo(this.container, core.Events.CONTAINER_TIMEUPDATE, this.onTimeUpdate);
        this.listenTo(this.container, core.Events.CONTAINER_PROGRESS, this.updateProgressBar);
        this.listenTo(this.container, core.Events.CONTAINER_SETTINGSUPDATE, this.settingsUpdate);
        this.listenTo(this.container, core.Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.settingsUpdate);
        this.listenTo(this.container, core.Events.CONTAINER_HIGHDEFINITIONUPDATE, this.highDefinitionUpdate);
        this.listenTo(this.container, core.Events.CONTAINER_MEDIACONTROL_DISABLE, this.disable);
        this.listenTo(this.container, core.Events.CONTAINER_MEDIACONTROL_ENABLE, this.enable);
        this.listenTo(this.container, core.Events.CONTAINER_ENDED, this.ended);
        this.listenTo(this.container, core.Events.CONTAINER_VOLUME, this.onVolumeChanged);
        this.listenTo(this.container, core.Events.CONTAINER_OPTIONS_CHANGE, this.setInitialVolume);

        if (this.container.playback.el.nodeName.toLowerCase() === 'video') {
          // wait until the metadata has loaded and then check if fullscreen on video tag is supported
          this.listenToOnce(this.container, core.Events.CONTAINER_LOADEDMETADATA, this.onLoadedMetadataOnVideoTag);
        }
      }
    }, {
      key: "disable",
      value: function disable() {
        this.userDisabled = true;
        this.hide();
        this.unbindKeyEvents();
        this.$el.hide();
      }
    }, {
      key: "enable",
      value: function enable() {
        if (this.options.chromeless) return;
        this.userDisabled = false;
        this.bindKeyEvents();
        this.show();
      }
    }, {
      key: "play",
      value: function play() {
        this.container && this.container.play();
      }
    }, {
      key: "pause",
      value: function pause() {
        this.container && this.container.pause();
      }
    }, {
      key: "stop",
      value: function stop() {
        this.container && this.container.stop();
      }
    }, {
      key: "setInitialVolume",
      value: function setInitialVolume() {
        var initialVolume = this.persistConfig ? Config.restore('volume') : 100;
        var options = this.container && this.container.options || this.options;
        this.setVolume(options.mute ? 0 : initialVolume, true);
      }
    }, {
      key: "onVolumeChanged",
      value: function onVolumeChanged() {
        this.updateVolumeUI();
      }
    }, {
      key: "onLoadedMetadataOnVideoTag",
      value: function onLoadedMetadataOnVideoTag() {
        var video = this.playback && this.playback.el; // video.webkitSupportsFullscreen is deprecated but iOS appears to only use this
        // see https://github.com/clappr/clappr/issues/1127

        if (!Fullscreen.fullscreenEnabled() && video.webkitSupportsFullscreen) {
          this.fullScreenOnVideoTagSupported = true;
          this.settingsUpdate();
        }
      }
    }, {
      key: "updateVolumeUI",
      value: function updateVolumeUI() {
        // this will be called after a render
        if (!this.rendered) return; // update volume bar scrubber/fill on bar mode

        this.$volumeBarContainer.find('.bar-fill-2').css({});
        var containerWidth = this.$volumeBarContainer.width();
        var barWidth = this.$volumeBarBackground.width();
        var offset = (containerWidth - barWidth) / 2.0;
        var pos = barWidth * this.volume / 100.0 + offset;
        this.$volumeBarFill.css({
          width: "".concat(this.volume, "%")
        });
        this.$volumeBarScrubber.css({
          left: pos
        }); // update volume bar segments on segmented bar mode

        this.$volumeBarContainer.find('.segmented-bar-element').removeClass('fill');
        var item = Math.ceil(this.volume / 10.0);
        this.$volumeBarContainer.find('.segmented-bar-element').slice(0, item).addClass('fill');
        this.$volumeIcon.html('');
        this.$volumeIcon.removeClass('muted');

        if (!this.muted) {
          this.$volumeIcon.append(volumeIcon);
        } else {
          this.$volumeIcon.append(volumeMuteIcon);
          this.$volumeIcon.addClass('muted');
        }

        this.applyButtonStyle(this.$volumeIcon);
      }
    }, {
      key: "changeTogglePlay",
      value: function changeTogglePlay() {
        this.$playPauseToggle.html('');
        this.$playStopToggle.html('');

        if (this.container && this.container.isPlaying()) {
          this.$playPauseToggle.append(pauseIcon);
          this.$playStopToggle.append(stopIcon);
          this.trigger(core.Events.MEDIACONTROL_PLAYING);
        } else {
          this.$playPauseToggle.append(playIcon);
          this.$playStopToggle.append(playIcon);
          this.trigger(core.Events.MEDIACONTROL_NOTPLAYING);
          core.Browser.isMobile && this.show();
        }

        this.applyButtonStyle(this.$playPauseToggle);
        this.applyButtonStyle(this.$playStopToggle);
      }
    }, {
      key: "mousemoveOnSeekBar",
      value: function mousemoveOnSeekBar(event) {
        if (this.settings.seekEnabled) {
          var offsetX = event.pageX - this.$seekBarContainer.offset().left - this.$seekBarHover.width() / 2;
          this.$seekBarHover.css({
            left: offsetX
          });
        }

        this.trigger(core.Events.MEDIACONTROL_MOUSEMOVE_SEEKBAR, event);
      }
    }, {
      key: "mouseleaveOnSeekBar",
      value: function mouseleaveOnSeekBar(event) {
        this.trigger(core.Events.MEDIACONTROL_MOUSELEAVE_SEEKBAR, event);
      }
    }, {
      key: "onVolumeClick",
      value: function onVolumeClick(event) {
        this.setVolume(this.getVolumeFromUIEvent(event));
      }
    }, {
      key: "mousemoveOnVolumeBar",
      value: function mousemoveOnVolumeBar(event) {
        this.draggingVolumeBar && this.setVolume(this.getVolumeFromUIEvent(event));
      }
    }, {
      key: "playerResize",
      value: function playerResize(size) {
        this.$fullscreenToggle.html('');
        var icon = this.core.isFullscreen() ? exitFullscreenIcon : fullscreenIcon;
        this.$fullscreenToggle.append(icon);
        this.applyButtonStyle(this.$fullscreenToggle);
        this.$el.find('.media-control').length !== 0 && this.$el.removeClass('w320');
        if (size.width <= 320 || this.options.hideVolumeBar) this.$el.addClass('w320');
      }
    }, {
      key: "togglePlayPause",
      value: function togglePlayPause() {
        this.container.isPlaying() ? this.container.pause() : this.container.play();
        return false;
      }
    }, {
      key: "togglePlayStop",
      value: function togglePlayStop() {
        this.container.isPlaying() ? this.container.stop() : this.container.play();
      }
    }, {
      key: "startSeekDrag",
      value: function startSeekDrag(event) {
        if (!this.settings.seekEnabled) return;
        this.draggingSeekBar = true;
        this.$el.addClass('dragging');
        this.$seekBarLoaded.addClass('media-control-notransition');
        this.$seekBarPosition.addClass('media-control-notransition');
        this.$seekBarScrubber.addClass('media-control-notransition');
        event && event.preventDefault();
      }
    }, {
      key: "startVolumeDrag",
      value: function startVolumeDrag(event) {
        this.draggingVolumeBar = true;
        this.$el.addClass('dragging');
        event && event.preventDefault();
      }
    }, {
      key: "stopDrag",
      value: function stopDrag(event) {
        this.draggingSeekBar && this.seek(event);
        this.$el.removeClass('dragging');
        this.$seekBarLoaded.removeClass('media-control-notransition');
        this.$seekBarPosition.removeClass('media-control-notransition');
        this.$seekBarScrubber.removeClass('media-control-notransition dragging');
        this.draggingSeekBar = false;
        this.draggingVolumeBar = false;
      }
    }, {
      key: "updateDrag",
      value: function updateDrag(event) {
        if (this.draggingSeekBar) {
          event.preventDefault();
          var offsetX = event.pageX - this.$seekBarContainer.offset().left;
          var pos = offsetX / this.$seekBarContainer.width() * 100;
          pos = Math.min(100, Math.max(pos, 0));
          this.setSeekPercentage(pos);
        } else if (this.draggingVolumeBar) {
          event.preventDefault();
          this.setVolume(this.getVolumeFromUIEvent(event));
        }
      }
    }, {
      key: "getVolumeFromUIEvent",
      value: function getVolumeFromUIEvent(event) {
        var offsetY = event.pageX - this.$volumeBarContainer.offset().left;
        var volumeFromUI = offsetY / this.$volumeBarContainer.width() * 100;
        return volumeFromUI;
      }
    }, {
      key: "toggleMute",
      value: function toggleMute() {
        this.setVolume(this.muted ? 100 : 0);
      }
    }, {
      key: "setVolume",
      value: function setVolume(value) {
        var _this4 = this;

        var isInitialVolume = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        value = Math.min(100, Math.max(value, 0)); // this will hold the intended volume
        // it may not actually get set to this straight away
        // if the container is not ready etc

        this.intendedVolume = value;
        this.persistConfig && !isInitialVolume && Config.persist('volume', value);

        var setWhenContainerReady = function setWhenContainerReady() {
          if (_this4.container && _this4.container.isReady) {
            _this4.container.setVolume(value);
          } else {
            _this4.listenToOnce(_this4.container, core.Events.CONTAINER_READY, function () {
              _this4.container.setVolume(value);
            });
          }
        };

        if (!this.container) this.listenToOnce(this, core.Events.MEDIACONTROL_CONTAINERCHANGED, function () {
          return setWhenContainerReady();
        });else setWhenContainerReady();
      }
    }, {
      key: "toggleFullscreen",
      value: function toggleFullscreen() {
        this.trigger(core.Events.MEDIACONTROL_FULLSCREEN, this.name);
        this.container.fullscreen();
        this.core.toggleFullscreen();
        this.resetUserKeepVisible();
      }
    }, {
      key: "onActiveContainerChanged",
      value: function onActiveContainerChanged() {
        this.fullScreenOnVideoTagSupported = null;
        this.bindEvents(); // set the new container to match the volume of the last one

        this.setInitialVolume();
        this.changeTogglePlay();
        this.bindContainerEvents();
        this.settingsUpdate();
        this.container && this.container.trigger(core.Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.container.isDvrInUse());
        this.container && this.container.mediaControlDisabled && this.disable();
        this.trigger(core.Events.MEDIACONTROL_CONTAINERCHANGED);
      }
    }, {
      key: "showVolumeBar",
      value: function showVolumeBar() {
        this.hideVolumeId && clearTimeout(this.hideVolumeId);
        this.$volumeBarContainer.removeClass('volume-bar-hide');
      }
    }, {
      key: "hideVolumeBar",
      value: function hideVolumeBar() {
        var _this5 = this;

        var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 400;
        if (!this.$volumeBarContainer) return;

        if (this.draggingVolumeBar) {
          this.hideVolumeId = setTimeout(function () {
            return _this5.hideVolumeBar();
          }, timeout);
        } else {
          this.hideVolumeId && clearTimeout(this.hideVolumeId);
          this.hideVolumeId = setTimeout(function () {
            return _this5.$volumeBarContainer.addClass('volume-bar-hide');
          }, timeout);
        }
      }
    }, {
      key: "ended",
      value: function ended() {
        this.changeTogglePlay();
      }
    }, {
      key: "updateProgressBar",
      value: function updateProgressBar(progress) {
        var loadedStart = progress.start / progress.total * 100;
        var loadedEnd = progress.current / progress.total * 100;
        this.$seekBarLoaded.css({
          left: "".concat(loadedStart, "%"),
          width: "".concat(loadedEnd - loadedStart, "%")
        });
      }
    }, {
      key: "onTimeUpdate",
      value: function onTimeUpdate(timeProgress) {
        if (this.draggingSeekBar) return; // TODO why should current time ever be negative?

        var position = timeProgress.current < 0 ? timeProgress.total : timeProgress.current;
        this.currentPositionValue = position;
        this.currentDurationValue = timeProgress.total;
        this.renderSeekBar();
      }
    }, {
      key: "renderSeekBar",
      value: function renderSeekBar() {
        // this will be triggered as soon as these become available
        if (this.currentPositionValue === null || this.currentDurationValue === null) return; // default to 100%

        this.currentSeekBarPercentage = 100;
        if (this.container && (this.container.getPlaybackType() !== core.Playback.LIVE || this.container.isDvrInUse())) this.currentSeekBarPercentage = this.currentPositionValue / this.currentDurationValue * 100;
        this.setSeekPercentage(this.currentSeekBarPercentage);
        var newPosition = formatTime(this.currentPositionValue);
        var newDuration = formatTime(this.currentDurationValue);

        if (newPosition !== this.displayedPosition) {
          this.$position.text(newPosition);
          this.displayedPosition = newPosition;
        }

        if (newDuration !== this.displayedDuration) {
          this.$duration.text(newDuration);
          this.displayedDuration = newDuration;
        }
      }
    }, {
      key: "seek",
      value: function seek(event) {
        if (!this.settings.seekEnabled) return;
        var offsetX = event.pageX - this.$seekBarContainer.offset().left;
        var pos = offsetX / this.$seekBarContainer.width() * 100;
        pos = Math.min(100, Math.max(pos, 0));
        this.container && this.container.seekPercentage(pos);
        this.setSeekPercentage(pos);
        return false;
      }
    }, {
      key: "setKeepVisible",
      value: function setKeepVisible() {
        this.keepVisible = true;
      }
    }, {
      key: "resetKeepVisible",
      value: function resetKeepVisible() {
        this.keepVisible = false;
      }
    }, {
      key: "setUserKeepVisible",
      value: function setUserKeepVisible() {
        this.userKeepVisible = true;
      }
    }, {
      key: "resetUserKeepVisible",
      value: function resetUserKeepVisible() {
        this.userKeepVisible = false;
      }
    }, {
      key: "isVisible",
      value: function isVisible() {
        return !this.$el.hasClass('media-control-hide');
      }
    }, {
      key: "show",
      value: function show(event) {
        var _this6 = this;

        if (this.disabled) return;
        var timeout = 2000;
        var mousePointerMoved = event && event.clientX !== this.lastMouseX && event.clientY !== this.lastMouseY;

        if (!event || mousePointerMoved || navigator.userAgent.match(/firefox/i)) {
          clearTimeout(this.hideId);
          this.$el.show();
          this.trigger(core.Events.MEDIACONTROL_SHOW, this.name);
          this.container && this.container.trigger(core.Events.CONTAINER_MEDIACONTROL_SHOW, this.name);
          this.$el.removeClass('media-control-hide');
          this.hideId = setTimeout(function () {
            return _this6.hide();
          }, timeout);

          if (event) {
            this.lastMouseX = event.clientX;
            this.lastMouseY = event.clientY;
          }
        }

        var showing = true;
        this.updateCursorStyle(showing);
      }
    }, {
      key: "hide",
      value: function hide() {
        var _this7 = this;

        var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        if (!this.isVisible()) return;
        var timeout = delay || 2000;
        clearTimeout(this.hideId);
        if (!this.disabled && this.options.hideMediaControl === false) return;
        var hasKeepVisibleRequested = this.userKeepVisible || this.keepVisible;
        var hasDraggingAction = this.draggingSeekBar || this.draggingVolumeBar;

        if (!this.disabled && (delay || hasKeepVisibleRequested || hasDraggingAction)) {
          this.hideId = setTimeout(function () {
            return _this7.hide();
          }, timeout);
        } else {
          this.trigger(core.Events.MEDIACONTROL_HIDE, this.name);
          this.container && this.container.trigger(core.Events.CONTAINER_MEDIACONTROL_HIDE, this.name);
          this.$el.addClass('media-control-hide');
          this.hideVolumeBar(0);
          var showing = false;
          this.updateCursorStyle(showing);
        }
      }
    }, {
      key: "updateCursorStyle",
      value: function updateCursorStyle(showing) {
        if (showing) this.core.$el.removeClass('nocursor');else if (this.core.isFullscreen()) this.core.$el.addClass('nocursor');
      }
    }, {
      key: "settingsUpdate",
      value: function settingsUpdate() {
        var newSettings = this.getSettings();

        if (newSettings && !this.fullScreenOnVideoTagSupported && !Fullscreen.fullscreenEnabled()) {
          // remove fullscreen from settings if it is present
          newSettings["default"] && removeArrayItem(newSettings["default"], 'fullscreen');
          newSettings.left && removeArrayItem(newSettings.left, 'fullscreen');
          newSettings.right && removeArrayItem(newSettings.right, 'fullscreen');
        }

        var settingsChanged = JSON.stringify(this.settings) !== JSON.stringify(newSettings);

        if (settingsChanged) {
          this.settings = newSettings;
          this.render();
        }
      }
    }, {
      key: "getSettings",
      value: function getSettings() {
        return core.$.extend(true, {}, this.container && this.container.settings);
      }
    }, {
      key: "highDefinitionUpdate",
      value: function highDefinitionUpdate(isHD) {
        this.isHD = isHD;
        var method = isHD ? 'addClass' : 'removeClass';
        this.$hdIndicator[method]('enabled');
      }
    }, {
      key: "createCachedElements",
      value: function createCachedElements() {
        var $layer = this.$el.find('.media-control-layer');
        this.$duration = $layer.find('.media-control-indicator[data-duration]');
        this.$fullscreenToggle = $layer.find('button.media-control-button[data-fullscreen]');
        this.$playPauseToggle = $layer.find('button.media-control-button[data-playpause]');
        this.$playStopToggle = $layer.find('button.media-control-button[data-playstop]');
        this.$position = $layer.find('.media-control-indicator[data-position]');
        this.$seekBarContainer = $layer.find('.bar-container[data-seekbar]');
        this.$seekBarHover = $layer.find('.bar-hover[data-seekbar]');
        this.$seekBarLoaded = $layer.find('.bar-fill-1[data-seekbar]');
        this.$seekBarPosition = $layer.find('.bar-fill-2[data-seekbar]');
        this.$seekBarScrubber = $layer.find('.bar-scrubber[data-seekbar]');
        this.$volumeBarContainer = $layer.find('.bar-container[data-volume]');
        this.$volumeContainer = $layer.find('.drawer-container[data-volume]');
        this.$volumeIcon = $layer.find('.drawer-icon[data-volume]');
        this.$volumeBarBackground = this.$el.find('.bar-background[data-volume]');
        this.$volumeBarFill = this.$el.find('.bar-fill-1[data-volume]');
        this.$volumeBarScrubber = this.$el.find('.bar-scrubber[data-volume]');
        this.$hdIndicator = this.$el.find('button.media-control-button[data-hd-indicator]');
        this.resetIndicators();
        this.initializeIcons();
      }
    }, {
      key: "resetIndicators",
      value: function resetIndicators() {
        this.displayedPosition = this.$position.text();
        this.displayedDuration = this.$duration.text();
      }
    }, {
      key: "initializeIcons",
      value: function initializeIcons() {
        var $layer = this.$el.find('.media-control-layer');
        $layer.find('button.media-control-button[data-play]').append(playIcon);
        $layer.find('button.media-control-button[data-pause]').append(pauseIcon);
        $layer.find('button.media-control-button[data-stop]').append(stopIcon);
        this.$playPauseToggle.append(playIcon);
        this.$playStopToggle.append(playIcon);
        this.$volumeIcon.append(volumeIcon);
        this.$fullscreenToggle.append(fullscreenIcon);
        this.$hdIndicator.append(hdIcon);
      }
    }, {
      key: "setSeekPercentage",
      value: function setSeekPercentage(value) {
        value = Math.max(Math.min(value, 100.0), 0); // not changed since last update

        if (this.displayedSeekBarPercentage === value) return;
        this.displayedSeekBarPercentage = value;
        this.$seekBarPosition.removeClass('media-control-notransition');
        this.$seekBarScrubber.removeClass('media-control-notransition');
        this.$seekBarPosition.css({
          width: "".concat(value, "%")
        });
        this.$seekBarScrubber.css({
          left: "".concat(value, "%")
        });
      }
    }, {
      key: "seekRelative",
      value: function seekRelative(delta) {
        if (!this.settings.seekEnabled) return;
        var currentTime = this.container.getCurrentTime();
        var duration = this.container.getDuration();
        var position = Math.min(Math.max(currentTime + delta, 0), duration);
        position = Math.min(position * 100 / duration, 100);
        this.container.seekPercentage(position);
      }
    }, {
      key: "bindKeyAndShow",
      value: function bindKeyAndShow(key, callback) {
        var _this8 = this;

        this.kibo.down(key, function () {
          _this8.show();

          return callback();
        });
      }
    }, {
      key: "bindKeyEvents",
      value: function bindKeyEvents() {
        var _this9 = this;

        if (core.Browser.isMobile || this.options.disableKeyboardShortcuts) return;
        this.unbindKeyEvents();
        this.kibo = new Kibo(this.options.focusElement || this.options.parentElement);
        this.bindKeyAndShow('space', function () {
          return _this9.togglePlayPause();
        });
        this.bindKeyAndShow('left', function () {
          return _this9.seekRelative(-5);
        });
        this.bindKeyAndShow('right', function () {
          return _this9.seekRelative(5);
        });
        this.bindKeyAndShow('shift left', function () {
          return _this9.seekRelative(-10);
        });
        this.bindKeyAndShow('shift right', function () {
          return _this9.seekRelative(10);
        });
        this.bindKeyAndShow('shift ctrl left', function () {
          return _this9.seekRelative(-15);
        });
        this.bindKeyAndShow('shift ctrl right', function () {
          return _this9.seekRelative(15);
        });
        var keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        keys.forEach(function (i) {
          _this9.bindKeyAndShow(i, function () {
            _this9.settings.seekEnabled && _this9.container && _this9.container.seekPercentage(i * 10);
          });
        });
      }
    }, {
      key: "unbindKeyEvents",
      value: function unbindKeyEvents() {
        if (this.kibo) {
          this.kibo.off('space');
          this.kibo.off('left');
          this.kibo.off('right');
          this.kibo.off('shift left');
          this.kibo.off('shift right');
          this.kibo.off('shift ctrl left');
          this.kibo.off('shift ctrl right');
          this.kibo.off(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
        }
      }
    }, {
      key: "parseColors",
      value: function parseColors() {
        if (this.options.mediacontrol) {
          this.buttonsColor = this.options.mediacontrol.buttons;
          var seekbarColor = this.options.mediacontrol.seekbar;
          this.$el.find('.bar-fill-2[data-seekbar]').css('background-color', seekbarColor);
          this.$el.find('.media-control-icon svg path').css('fill', this.buttonsColor);
          this.$el.find('.segmented-bar-element[data-volume]').css('boxShadow', 'inset 2px 0 0 ' + this.buttonsColor);
        }
      }
    }, {
      key: "applyButtonStyle",
      value: function applyButtonStyle(element) {
        this.buttonsColor && element && core.$(element).find('svg path').css('fill', this.buttonsColor);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        core.$(document).unbind('mouseup', this.stopDragHandler);
        core.$(document).unbind('mousemove', this.updateDragHandler);
        this.unbindKeyEvents();
        this.stopListening();

        _get(_getPrototypeOf(MediaControl.prototype), "destroy", this).call(this);
      }
      /**
       * enables to configure the media control after its creation
       * @method configure
       * @param {Object} options all the options to change in form of a javascript object
       */

    }, {
      key: "configure",
      value: function configure(options) {
        // Check if chromeless mode or if configure is called with new source(s)
        if (this.options.chromeless || options.source || options.sources) this.disable();else this.enable();
        this.trigger(core.Events.MEDIACONTROL_OPTIONS_CHANGE);
      }
    }, {
      key: "render",
      value: function render() {
        var _this10 = this;

        var timeout = this.options.hideMediaControlDelay || 2000;
        this.settings && this.$el.html(this.template({
          settings: this.settings
        }));
        this.createCachedElements();
        this.$playPauseToggle.addClass('paused');
        this.$playStopToggle.addClass('stopped');
        this.changeTogglePlay();

        if (this.container) {
          this.hideId = setTimeout(function () {
            return _this10.hide();
          }, timeout);
          this.disabled && this.hide();
        } // Video volume cannot be changed with Safari on mobile devices
        // Display mute/unmute icon only if Safari version >= 10


        if (core.Browser.isSafari && core.Browser.isMobile) {
          if (core.Browser.version < 10) this.$volumeContainer.css('display', 'none');else this.$volumeBarContainer.css('display', 'none');
        }

        this.$seekBarPosition.addClass('media-control-notransition');
        this.$seekBarScrubber.addClass('media-control-notransition');
        var previousSeekPercentage = 0;
        if (this.displayedSeekBarPercentage) previousSeekPercentage = this.displayedSeekBarPercentage;
        this.displayedSeekBarPercentage = null;
        this.setSeekPercentage(previousSeekPercentage);
        nextTick(function () {
          !_this10.settings.seekEnabled && _this10.$seekBarContainer.addClass('seek-disabled');
          !core.Browser.isMobile && !_this10.options.disableKeyboardShortcuts && _this10.bindKeyEvents();

          _this10.playerResize({
            width: _this10.options.width,
            height: _this10.options.height
          });

          _this10.hideVolumeBar(0);
        });
        this.parseColors();
        this.highDefinitionUpdate(this.isHD);
        this.core.$el.append(this.el);
        this.rendered = true;
        this.updateVolumeUI();
        this.trigger(core.Events.MEDIACONTROL_RENDERED);
        return this;
      }
    }]);

    return MediaControl;
  }(core.UICorePlugin);

  MediaControl.extend = function (properties) {
    return extend(MediaControl, properties);
  };

  var posterHTML = "<div class=\"play-wrapper\" data-poster></div>\n";

  var css$4 = ".player-poster[data-poster] {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n          align-items: center;\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  z-index: 998;\n  top: 0;\n  left: 0;\n  background-color: #000;\n  background-size: cover;\n  background-repeat: no-repeat;\n  background-position: 50% 50%; }\n  .player-poster[data-poster].clickable {\n    cursor: pointer; }\n  .player-poster[data-poster]:hover .play-wrapper[data-poster] {\n    opacity: 1; }\n  .player-poster[data-poster] .play-wrapper[data-poster] {\n    width: 100%;\n    height: 25%;\n    margin: 0 auto;\n    opacity: 0.75;\n    -webkit-transition: opacity 0.1s ease;\n    transition: opacity 0.1s ease; }\n    .player-poster[data-poster] .play-wrapper[data-poster] svg {\n      height: 100%; }\n      .player-poster[data-poster] .play-wrapper[data-poster] svg path {\n        fill: #fff; }\n";
  styleInject(css$4);

  var PosterPlugin =
  /*#__PURE__*/
  function (_UIContainerPlugin) {
    _inherits(PosterPlugin, _UIContainerPlugin);

    _createClass(PosterPlugin, [{
      key: "name",
      get: function get() {
        return 'poster';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.5"
        };
      }
    }, {
      key: "template",
      get: function get() {
        return core.template(posterHTML);
      }
    }, {
      key: "shouldRender",
      get: function get() {
        var showForNoOp = !!(this.options.poster && this.options.poster.showForNoOp);
        return this.container.playback.name !== 'html_img' && (this.container.playback.getPlaybackType() !== core.Playback.NO_OP || showForNoOp);
      }
    }, {
      key: "attributes",
      get: function get() {
        return {
          'class': 'player-poster',
          'data-poster': ''
        };
      }
    }, {
      key: "events",
      get: function get() {
        return {
          'click': 'clicked'
        };
      }
    }, {
      key: "showOnVideoEnd",
      get: function get() {
        return !this.options.poster || this.options.poster.showOnVideoEnd || this.options.poster.showOnVideoEnd === undefined;
      }
    }]);

    function PosterPlugin(container) {
      var _this;

      _classCallCheck(this, PosterPlugin);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PosterPlugin).call(this, container));
      _this.hasStartedPlaying = false;
      _this.playRequested = false;

      _this.render();

      nextTick(function () {
        return _this.update();
      });
      return _this;
    }

    _createClass(PosterPlugin, [{
      key: "bindEvents",
      value: function bindEvents() {
        this.listenTo(this.container, core.Events.CONTAINER_STOP, this.onStop);
        this.listenTo(this.container, core.Events.CONTAINER_PLAY, this.onPlay);
        this.listenTo(this.container, core.Events.CONTAINER_STATE_BUFFERING, this.update);
        this.listenTo(this.container, core.Events.CONTAINER_STATE_BUFFERFULL, this.update);
        this.listenTo(this.container, core.Events.CONTAINER_OPTIONS_CHANGE, this.render);
        this.listenTo(this.container, core.Events.CONTAINER_ERROR, this.onError);
        this.showOnVideoEnd && this.listenTo(this.container, core.Events.CONTAINER_ENDED, this.onStop);
      }
    }, {
      key: "onError",
      value: function onError(error) {
        this.hasFatalError = error.level === core.PlayerError.Levels.FATAL;

        if (this.hasFatalError) {
          this.hasStartedPlaying = false;
          this.playRequested = false;
          this.showPlayButton();
        }
      }
    }, {
      key: "onPlay",
      value: function onPlay() {
        this.hasStartedPlaying = true;
        this.update();
      }
    }, {
      key: "onStop",
      value: function onStop() {
        this.hasStartedPlaying = false;
        this.playRequested = false;
        this.update();
      }
    }, {
      key: "updatePlayButton",
      value: function updatePlayButton(show) {
        if (show && (!this.options.chromeless || this.options.allowUserInteraction)) this.showPlayButton();else this.hidePlayButton();
      }
    }, {
      key: "showPlayButton",
      value: function showPlayButton() {
        if (this.hasFatalError && !this.options.disableErrorScreen) return;
        this.$playButton.show();
        this.$el.addClass('clickable');
      }
    }, {
      key: "hidePlayButton",
      value: function hidePlayButton() {
        this.$playButton.hide();
        this.$el.removeClass('clickable');
      }
    }, {
      key: "clicked",
      value: function clicked() {
        // Let "click_to_pause" plugin handle click event if media has started playing
        if (!this.hasStartedPlaying) {
          if (!this.options.chromeless || this.options.allowUserInteraction) {
            this.playRequested = true;
            this.update();
            this.container.play();
          }

          return false;
        }
      }
    }, {
      key: "shouldHideOnPlay",
      value: function shouldHideOnPlay() {
        // Audio broadcasts should keep the poster up; video should hide poster while playing.
        return !this.container.playback.isAudioOnly;
      }
    }, {
      key: "update",
      value: function update() {
        if (!this.shouldRender) return;
        var showPlayButton = !this.playRequested && !this.hasStartedPlaying && !this.container.buffering;
        this.updatePlayButton(showPlayButton);
        this.updatePoster();
      }
    }, {
      key: "updatePoster",
      value: function updatePoster() {
        if (!this.hasStartedPlaying) this.showPoster();else this.hidePoster();
      }
    }, {
      key: "showPoster",
      value: function showPoster() {
        this.container.disableMediaControl();
        this.$el.show();
      }
    }, {
      key: "hidePoster",
      value: function hidePoster() {
        this.container.enableMediaControl();
        if (this.shouldHideOnPlay()) this.$el.hide();
      }
    }, {
      key: "render",
      value: function render() {
        if (!this.shouldRender) return;
        this.$el.html(this.template());
        var isRegularPoster = this.options.poster && this.options.poster.custom === undefined;

        if (isRegularPoster) {
          var posterUrl = this.options.poster.url || this.options.poster;
          this.$el.css({
            'background-image': 'url(' + posterUrl + ')'
          });
        } else if (this.options.poster) {
          this.$el.css({
            'background': this.options.poster.custom
          });
        }

        this.container.$el.append(this.el);
        this.$playWrapper = this.$el.find('.play-wrapper');
        this.$playWrapper.append(playIcon);
        this.$playButton = this.$playWrapper.find('svg');
        this.$playButton.addClass('poster-icon');
        this.$playButton.attr('data-poster', '');
        var buttonsColor = this.options.mediacontrol && this.options.mediacontrol.buttons;
        if (buttonsColor) this.$el.find('svg path').css('fill', buttonsColor);

        if (this.options.mediacontrol && this.options.mediacontrol.buttons) {
          buttonsColor = this.options.mediacontrol.buttons;
          this.$playButton.css('color', buttonsColor);
        }

        this.update();
        return this;
      }
    }]);

    return PosterPlugin;
  }(core.UIContainerPlugin);

  var seekTimeHTML = "<span data-seek-time></span>\n<span data-duration></span>\n";

  var css$5 = ".seek-time[data-seek-time] {\n  position: absolute;\n  white-space: nowrap;\n  height: 20px;\n  line-height: 20px;\n  font-size: 0;\n  left: -100%;\n  bottom: 55px;\n  background-color: rgba(2, 2, 2, 0.5);\n  z-index: 9999;\n  -webkit-transition: opacity 0.1s ease;\n  transition: opacity 0.1s ease; }\n  .seek-time[data-seek-time].hidden[data-seek-time] {\n    opacity: 0; }\n  .seek-time[data-seek-time] [data-seek-time] {\n    display: inline-block;\n    color: white;\n    font-size: 10px;\n    padding-left: 7px;\n    padding-right: 7px;\n    vertical-align: top; }\n  .seek-time[data-seek-time] [data-duration] {\n    display: inline-block;\n    color: rgba(255, 255, 255, 0.5);\n    font-size: 10px;\n    padding-right: 7px;\n    vertical-align: top; }\n    .seek-time[data-seek-time] [data-duration]:before {\n      content: \"|\";\n      margin-right: 7px; }\n";
  styleInject(css$5);

  var formatTime$1 = core.Utils.formatTime;

  var SeekTime =
  /*#__PURE__*/
  function (_UICorePlugin) {
    _inherits(SeekTime, _UICorePlugin);

    _createClass(SeekTime, [{
      key: "name",
      get: function get() {
        return 'seek_time';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.5"
        };
      }
    }, {
      key: "template",
      get: function get() {
        return core.template(seekTimeHTML);
      }
    }, {
      key: "attributes",
      get: function get() {
        return {
          'class': 'seek-time',
          'data-seek-time': ''
        };
      }
    }, {
      key: "mediaControl",
      get: function get() {
        return this.core.mediaControl;
      }
    }, {
      key: "mediaControlContainer",
      get: function get() {
        return this.mediaControl.container;
      }
    }, {
      key: "isLiveStreamWithDvr",
      get: function get() {
        return this.mediaControlContainer && this.mediaControlContainer.getPlaybackType() === core.Playback.LIVE && this.mediaControlContainer.isDvrEnabled();
      }
    }, {
      key: "durationShown",
      get: function get() {
        return this.isLiveStreamWithDvr && !this.actualLiveTime;
      }
    }, {
      key: "useActualLiveTime",
      get: function get() {
        return this.actualLiveTime && this.isLiveStreamWithDvr;
      }
    }]);

    function SeekTime(core) {
      var _this;

      _classCallCheck(this, SeekTime);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SeekTime).call(this, core));
      _this.hoveringOverSeekBar = false;
      _this.hoverPosition = null;
      _this.duration = null;
      _this.firstFragDateTime = null;
      _this.actualLiveTime = !!_this.mediaControl.options.actualLiveTime;

      if (_this.actualLiveTime) {
        if (_this.mediaControl.options.actualLiveServerTime) _this.actualLiveServerTimeDiff = new Date().getTime() - new Date(_this.mediaControl.options.actualLiveServerTime).getTime();else _this.actualLiveServerTimeDiff = 0;
      }

      return _this;
    }

    _createClass(SeekTime, [{
      key: "bindEvents",
      value: function bindEvents() {
        this.listenTo(this.mediaControl, core.Events.MEDIACONTROL_RENDERED, this.render);
        this.listenTo(this.mediaControl, core.Events.MEDIACONTROL_MOUSEMOVE_SEEKBAR, this.showTime);
        this.listenTo(this.mediaControl, core.Events.MEDIACONTROL_MOUSELEAVE_SEEKBAR, this.hideTime);
        this.listenTo(this.mediaControl, core.Events.MEDIACONTROL_CONTAINERCHANGED, this.onContainerChanged);

        if (this.mediaControlContainer) {
          this.listenTo(this.mediaControlContainer, core.Events.CONTAINER_PLAYBACKDVRSTATECHANGED, this.update);
          this.listenTo(this.mediaControlContainer, core.Events.CONTAINER_TIMEUPDATE, this.updateDuration);
        }
      }
    }, {
      key: "onContainerChanged",
      value: function onContainerChanged() {
        this.stopListening();
        this.bindEvents();
      }
    }, {
      key: "updateDuration",
      value: function updateDuration(timeProgress) {
        this.duration = timeProgress.total;
        this.firstFragDateTime = timeProgress.firstFragDateTime;
        this.update();
      }
    }, {
      key: "showTime",
      value: function showTime(event) {
        this.hoveringOverSeekBar = true;
        this.calculateHoverPosition(event);
        this.update();
      }
    }, {
      key: "hideTime",
      value: function hideTime() {
        this.hoveringOverSeekBar = false;
        this.update();
      }
    }, {
      key: "calculateHoverPosition",
      value: function calculateHoverPosition(event) {
        var offset = event.pageX - this.mediaControl.$seekBarContainer.offset().left; // proportion into the seek bar that the mouse is hovered over 0-1

        this.hoverPosition = Math.min(1, Math.max(offset / this.mediaControl.$seekBarContainer.width(), 0));
      }
    }, {
      key: "getSeekTime",
      value: function getSeekTime() {
        var seekTime, secondsSinceMidnight, d, e;

        if (this.useActualLiveTime) {
          if (this.firstFragDateTime) {
            e = new Date(this.firstFragDateTime);
            d = new Date(this.firstFragDateTime);
            d.setHours(0, 0, 0, 0);
            secondsSinceMidnight = (e.getTime() - d.getTime()) / 1000 + this.duration;
          } else {
            d = new Date(new Date().getTime() - this.actualLiveServerTimeDiff);
            e = new Date(d);
            secondsSinceMidnight = (e - d.setHours(0, 0, 0, 0)) / 1000;
          }

          seekTime = secondsSinceMidnight - this.duration + this.hoverPosition * this.duration;
          if (seekTime < 0) seekTime += 86400;
        } else {
          seekTime = this.hoverPosition * this.duration;
        }

        return {
          seekTime: seekTime,
          secondsSinceMidnight: secondsSinceMidnight
        };
      }
    }, {
      key: "update",
      value: function update() {
        if (!this.rendered) {
          // update() is always called after a render
          return;
        }

        if (!this.shouldBeVisible()) {
          this.$el.hide();
          this.$el.css('left', '-100%');
        } else {
          var seekTime = this.getSeekTime();
          var currentSeekTime = formatTime$1(seekTime.seekTime, this.useActualLiveTime); // only update dom if necessary, ie time actually changed

          if (currentSeekTime !== this.displayedSeekTime) {
            this.$seekTimeEl.text(currentSeekTime);
            this.displayedSeekTime = currentSeekTime;
          }

          if (this.durationShown) {
            this.$durationEl.show();
            var currentDuration = formatTime$1(this.actualLiveTime ? seekTime.secondsSinceMidnight : this.duration, this.actualLiveTime);

            if (currentDuration !== this.displayedDuration) {
              this.$durationEl.text(currentDuration);
              this.displayedDuration = currentDuration;
            }
          } else {
            this.$durationEl.hide();
          } // the element must be unhidden before its width is requested, otherwise it's width will be reported as 0


          this.$el.show();
          var containerWidth = this.mediaControl.$seekBarContainer.width();
          var elWidth = this.$el.width();
          var elLeftPos = this.hoverPosition * containerWidth;
          elLeftPos -= elWidth / 2;
          elLeftPos = Math.max(0, Math.min(elLeftPos, containerWidth - elWidth));
          this.$el.css('left', elLeftPos);
        }
      }
    }, {
      key: "shouldBeVisible",
      value: function shouldBeVisible() {
        return this.mediaControlContainer && this.mediaControlContainer.settings.seekEnabled && this.hoveringOverSeekBar && this.hoverPosition !== null && this.duration !== null;
      }
    }, {
      key: "render",
      value: function render() {
        this.rendered = true;
        this.displayedDuration = null;
        this.displayedSeekTime = null;
        this.$el.html(this.template());
        this.$el.hide();
        this.mediaControl.$el.append(this.el);
        this.$seekTimeEl = this.$el.find('[data-seek-time]');
        this.$durationEl = this.$el.find('[data-duration]');
        this.$durationEl.hide();
        this.update();
      }
    }]);

    return SeekTime;
  }(core.UICorePlugin);

  var SourcesPlugin =
  /*#__PURE__*/
  function (_CorePlugin) {
    _inherits(SourcesPlugin, _CorePlugin);

    function SourcesPlugin() {
      _classCallCheck(this, SourcesPlugin);

      return _possibleConstructorReturn(this, _getPrototypeOf(SourcesPlugin).apply(this, arguments));
    }

    _createClass(SourcesPlugin, [{
      key: "bindEvents",
      value: function bindEvents() {
        this.listenTo(this.core, core.Events.CORE_CONTAINERS_CREATED, this.onContainersCreated);
      }
    }, {
      key: "onContainersCreated",
      value: function onContainersCreated() {
        var firstValidSource = this.core.containers.filter(function (container) {
          return container.playback.name !== 'no_op';
        })[0] || this.core.containers[0];

        if (firstValidSource) {
          this.core.containers.forEach(function (container) {
            if (container !== firstValidSource) container.destroy();
          });
        }
      }
    }, {
      key: "name",
      get: function get() {
        return 'sources';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.5"
        };
      }
    }]);

    return SourcesPlugin;
  }(core.CorePlugin);

  var spinnerHTML = "<div data-bounce1></div><div data-bounce2></div><div data-bounce3></div>\n";

  var css$6 = ".spinner-three-bounce[data-spinner] {\n  position: absolute;\n  margin: 0 auto;\n  width: 70px;\n  text-align: center;\n  z-index: 999;\n  left: 0;\n  right: 0;\n  margin-left: auto;\n  margin-right: auto;\n  /* center vertically */\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%); }\n  .spinner-three-bounce[data-spinner] > div {\n    width: 18px;\n    height: 18px;\n    background-color: #FFFFFF;\n    border-radius: 100%;\n    display: inline-block;\n    -webkit-animation: bouncedelay 1.4s infinite ease-in-out;\n            animation: bouncedelay 1.4s infinite ease-in-out;\n    /* Prevent first frame from flickering when animation starts */\n    -webkit-animation-fill-mode: both;\n            animation-fill-mode: both; }\n  .spinner-three-bounce[data-spinner] [data-bounce1] {\n    -webkit-animation-delay: -0.32s;\n            animation-delay: -0.32s; }\n  .spinner-three-bounce[data-spinner] [data-bounce2] {\n    -webkit-animation-delay: -0.16s;\n            animation-delay: -0.16s; }\n\n@-webkit-keyframes bouncedelay {\n  0%, 80%, 100% {\n    -webkit-transform: scale(0);\n            transform: scale(0); }\n  40% {\n    -webkit-transform: scale(1);\n            transform: scale(1); } }\n\n@keyframes bouncedelay {\n  0%, 80%, 100% {\n    -webkit-transform: scale(0);\n            transform: scale(0); }\n  40% {\n    -webkit-transform: scale(1);\n            transform: scale(1); } }\n";
  styleInject(css$6);

  var SpinnerThreeBouncePlugin =
  /*#__PURE__*/
  function (_UIContainerPlugin) {
    _inherits(SpinnerThreeBouncePlugin, _UIContainerPlugin);

    _createClass(SpinnerThreeBouncePlugin, [{
      key: "name",
      get: function get() {
        return 'spinner';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.5"
        };
      }
    }, {
      key: "attributes",
      get: function get() {
        return {
          'data-spinner': '',
          'class': 'spinner-three-bounce'
        };
      }
    }]);

    function SpinnerThreeBouncePlugin(container) {
      var _this;

      _classCallCheck(this, SpinnerThreeBouncePlugin);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SpinnerThreeBouncePlugin).call(this, container));
      _this.template = core.template(spinnerHTML);
      _this.showTimeout = null;

      _this.listenTo(_this.container, core.Events.CONTAINER_STATE_BUFFERING, _this.onBuffering);

      _this.listenTo(_this.container, core.Events.CONTAINER_STATE_BUFFERFULL, _this.onBufferFull);

      _this.listenTo(_this.container, core.Events.CONTAINER_STOP, _this.onStop);

      _this.listenTo(_this.container, core.Events.CONTAINER_ENDED, _this.onStop);

      _this.listenTo(_this.container, core.Events.CONTAINER_ERROR, _this.onStop);

      _this.render();

      return _this;
    }

    _createClass(SpinnerThreeBouncePlugin, [{
      key: "onBuffering",
      value: function onBuffering() {
        this.show();
      }
    }, {
      key: "onBufferFull",
      value: function onBufferFull() {
        this.hide();
      }
    }, {
      key: "onStop",
      value: function onStop() {
        this.hide();
      }
    }, {
      key: "show",
      value: function show() {
        var _this2 = this;

        if (this.showTimeout === null) this.showTimeout = setTimeout(function () {
          return _this2.$el.show();
        }, 300);
      }
    }, {
      key: "hide",
      value: function hide() {
        if (this.showTimeout !== null) {
          clearTimeout(this.showTimeout);
          this.showTimeout = null;
        }

        this.$el.hide();
      }
    }, {
      key: "render",
      value: function render() {
        this.$el.html(this.template());
        this.container.$el.append(this.$el);
        this.$el.hide();
        if (this.container.buffering) this.onBuffering();
        return this;
      }
    }]);

    return SpinnerThreeBouncePlugin;
  }(core.UIContainerPlugin);

  var StatsPlugin =
  /*#__PURE__*/
  function (_ContainerPlugin) {
    _inherits(StatsPlugin, _ContainerPlugin);

    _createClass(StatsPlugin, [{
      key: "name",
      get: function get() {
        return 'stats';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.5"
        };
      }
    }]);

    function StatsPlugin(container) {
      var _this;

      _classCallCheck(this, StatsPlugin);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(StatsPlugin).call(this, container));

      _this.setInitialAttrs();

      _this.reportInterval = _this.options.reportInterval || 5000;
      _this.state = 'IDLE';
      return _this;
    }

    _createClass(StatsPlugin, [{
      key: "bindEvents",
      value: function bindEvents() {
        this.listenTo(this.container.playback, core.Events.PLAYBACK_PLAY, this.onPlay);
        this.listenTo(this.container, core.Events.CONTAINER_STOP, this.onStop);
        this.listenTo(this.container, core.Events.CONTAINER_ENDED, this.onStop);
        this.listenTo(this.container, core.Events.CONTAINER_DESTROYED, this.onStop);
        this.listenTo(this.container, core.Events.CONTAINER_STATE_BUFFERING, this.onBuffering);
        this.listenTo(this.container, core.Events.CONTAINER_STATE_BUFFERFULL, this.onBufferFull);
        this.listenTo(this.container, core.Events.CONTAINER_STATS_ADD, this.onStatsAdd);
        this.listenTo(this.container, core.Events.CONTAINER_BITRATE, this.onStatsAdd);
        this.listenTo(this.container.playback, core.Events.PLAYBACK_STATS_ADD, this.onStatsAdd);
      }
    }, {
      key: "setInitialAttrs",
      value: function setInitialAttrs() {
        this.firstPlay = true;
        this.startupTime = 0;
        this.rebufferingTime = 0;
        this.watchingTime = 0;
        this.rebuffers = 0;
        this.externalMetrics = {};
      }
    }, {
      key: "onPlay",
      value: function onPlay() {
        this.state = 'PLAYING';
        this.watchingTimeInit = Date.now();
        if (!this.intervalId) this.intervalId = setInterval(this.report.bind(this), this.reportInterval);
      }
    }, {
      key: "onStop",
      value: function onStop() {
        clearInterval(this.intervalId);
        this.report();
        this.intervalId = undefined;
        this.state = 'STOPPED';
      }
    }, {
      key: "onBuffering",
      value: function onBuffering() {
        if (this.firstPlay) this.startupTimeInit = Date.now();else this.rebufferingTimeInit = Date.now();
        this.state = 'BUFFERING';
        this.rebuffers++;
      }
    }, {
      key: "onBufferFull",
      value: function onBufferFull() {
        if (this.firstPlay && this.startupTimeInit) {
          this.firstPlay = false;
          this.startupTime = Date.now() - this.startupTimeInit;
          this.watchingTimeInit = Date.now();
        } else if (this.rebufferingTimeInit) {
          this.rebufferingTime += this.getRebufferingTime();
        }

        this.rebufferingTimeInit = undefined;
        this.state = 'PLAYING';
      }
    }, {
      key: "getRebufferingTime",
      value: function getRebufferingTime() {
        return Date.now() - this.rebufferingTimeInit;
      }
    }, {
      key: "getWatchingTime",
      value: function getWatchingTime() {
        var totalTime = Date.now() - this.watchingTimeInit;
        return totalTime - this.rebufferingTime;
      }
    }, {
      key: "isRebuffering",
      value: function isRebuffering() {
        return !!this.rebufferingTimeInit;
      }
    }, {
      key: "onStatsAdd",
      value: function onStatsAdd(metric) {
        core.$.extend(this.externalMetrics, metric);
      }
    }, {
      key: "getStats",
      value: function getStats() {
        var metrics = {
          startupTime: this.startupTime,
          rebuffers: this.rebuffers,
          rebufferingTime: this.isRebuffering() ? this.rebufferingTime + this.getRebufferingTime() : this.rebufferingTime,
          watchingTime: this.isRebuffering() ? this.getWatchingTime() - this.getRebufferingTime() : this.getWatchingTime()
        };
        core.$.extend(metrics, this.externalMetrics);
        return metrics;
      }
    }, {
      key: "report",
      value: function report() {
        this.container.statsReport(this.getStats());
      }
    }]);

    return StatsPlugin;
  }(core.ContainerPlugin);

  var watermarkHTML = "<div class=\"clappr-watermark\" data-watermark data-watermark-<%=position %>>\n<% if(typeof imageLink !== 'undefined') { %>\n<a target=\"_blank\" href=\"<%= imageLink %>\">\n<% } %>\n<img src=\"<%= imageUrl %>\">\n<% if(typeof imageLink !== 'undefined') { %>\n</a>\n<% } %>\n</div>\n";

  var css$7 = ".clappr-watermark[data-watermark] {\n  position: absolute;\n  min-width: 70px;\n  max-width: 200px;\n  width: 12%;\n  text-align: center;\n  z-index: 10; }\n\n.clappr-watermark[data-watermark] a {\n  outline: none;\n  cursor: pointer; }\n\n.clappr-watermark[data-watermark] img {\n  max-width: 100%; }\n\n.clappr-watermark[data-watermark-bottom-left] {\n  bottom: 10px;\n  left: 10px; }\n\n.clappr-watermark[data-watermark-bottom-right] {\n  bottom: 10px;\n  right: 42px; }\n\n.clappr-watermark[data-watermark-top-left] {\n  top: 10px;\n  left: 10px; }\n\n.clappr-watermark[data-watermark-top-right] {\n  top: 10px;\n  right: 37px; }\n";
  styleInject(css$7);

  var WaterMarkPlugin =
  /*#__PURE__*/
  function (_UIContainerPlugin) {
    _inherits(WaterMarkPlugin, _UIContainerPlugin);

    _createClass(WaterMarkPlugin, [{
      key: "name",
      get: function get() {
        return 'watermark';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.5"
        };
      }
    }, {
      key: "template",
      get: function get() {
        return core.template(watermarkHTML);
      }
    }]);

    function WaterMarkPlugin(container) {
      var _this;

      _classCallCheck(this, WaterMarkPlugin);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(WaterMarkPlugin).call(this, container));

      _this.configure();

      return _this;
    }

    _createClass(WaterMarkPlugin, [{
      key: "bindEvents",
      value: function bindEvents() {
        this.listenTo(this.container, core.Events.CONTAINER_PLAY, this.onPlay);
        this.listenTo(this.container, core.Events.CONTAINER_STOP, this.onStop);
        this.listenTo(this.container, core.Events.CONTAINER_OPTIONS_CHANGE, this.configure);
      }
    }, {
      key: "configure",
      value: function configure() {
        this.position = this.options.position || 'bottom-right';

        if (this.options.watermark) {
          this.imageUrl = this.options.watermark;
          this.imageLink = this.options.watermarkLink;
          this.render();
        } else {
          this.$el.remove();
        }
      }
    }, {
      key: "onPlay",
      value: function onPlay() {
        if (!this.hidden) this.$el.show();
      }
    }, {
      key: "onStop",
      value: function onStop() {
        this.$el.hide();
      }
    }, {
      key: "render",
      value: function render() {
        this.$el.hide();
        var templateOptions = {
          position: this.position,
          imageUrl: this.imageUrl,
          imageLink: this.imageLink
        };
        this.$el.html(this.template(templateOptions));
        this.container.$el.append(this.$el);
        return this;
      }
    }]);

    return WaterMarkPlugin;
  }(core.UIContainerPlugin);

  // Copyright 2014 Globo.com Player authors. All rights reserved.
  var version = "0.4.4";
  var Plugins = {
    ClickToPause: ClickToPausePlugin,
    ClosedCaptions: ClosedCaptions,
    DVRControls: DVRControls,
    EndVideo: EndVideo,
    ErrorScreen: ErrorScreen,
    Favicon: Favicon,
    GoogleAnalytics: GoogleAnalytics,
    MediaControl: MediaControl,
    Poster: PosterPlugin,
    SeekTime: SeekTime,
    Sources: SourcesPlugin,
    SpinnerThreeBounce: SpinnerThreeBouncePlugin,
    Stats: StatsPlugin,
    WaterMark: WaterMarkPlugin
  };

  exports.ClickToPause = ClickToPausePlugin;
  exports.ClosedCaptions = ClosedCaptions;
  exports.DVRControls = DVRControls;
  exports.EndVideo = EndVideo;
  exports.ErrorScreen = ErrorScreen;
  exports.Favicon = Favicon;
  exports.GoogleAnalytics = GoogleAnalytics;
  exports.MediaControl = MediaControl;
  exports.Plugins = Plugins;
  exports.Poster = PosterPlugin;
  exports.SeekTime = SeekTime;
  exports.Sources = SourcesPlugin;
  exports.SpinnerThreeBounce = SpinnerThreeBouncePlugin;
  exports.Stats = StatsPlugin;
  exports.Vendor = index;
  exports.WaterMark = WaterMarkPlugin;
  exports.version = version;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
