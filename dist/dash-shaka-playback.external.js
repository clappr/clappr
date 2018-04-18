(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("clappr"), require("shaka"));
	else if(typeof define === 'function' && define.amd)
		define(["clappr", "shaka"], factory);
	else if(typeof exports === 'object')
		exports["DashShakaPlayback"] = factory(require("clappr"), require("shaka"));
	else
		root["DashShakaPlayback"] = factory(root["Clappr"], root["shaka"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _clappr = __webpack_require__(1);

var _shakaPlayer = __webpack_require__(2);

var _shakaPlayer2 = _interopRequireDefault(_shakaPlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SEND_STATS_INTERVAL_MS = 30 * 1e3;
var DEFAULT_LEVEL_AUTO = -1;

var DashShakaPlayback = function (_HTML5Video) {
  _inherits(DashShakaPlayback, _HTML5Video);

  _createClass(DashShakaPlayback, [{
    key: 'name',
    get: function get() {
      return 'dash_shaka_playback';
    }
  }, {
    key: 'shakaVersion',
    get: function get() {
      return _shakaPlayer2.default.player.Player.version;
    }
  }, {
    key: 'shakaPlayerInstance',
    get: function get() {
      return this._player;
    }
  }, {
    key: 'levels',
    get: function get() {
      return this._levels;
    }
  }, {
    key: 'currentLevel',
    set: function set(id) {
      var _this2 = this;

      this._currentLevelId = id;
      var isAuto = this._currentLevelId === DEFAULT_LEVEL_AUTO;

      this.trigger(_clappr.Events.PLAYBACK_LEVEL_SWITCH_START);
      if (!isAuto) {
        this._player.configure({ abr: { enabled: false } });
        this._pendingAdaptationEvent = true;
        this.selectTrack(this.videoTracks.filter(function (t) {
          return t.id === _this2._currentLevelId;
        })[0]);
      } else {
        this._player.configure({ abr: { enabled: true } });
        this.trigger(_clappr.Events.PLAYBACK_LEVEL_SWITCH_END);
      }
    },
    get: function get() {
      return this._currentLevelId || DEFAULT_LEVEL_AUTO;
    }
  }], [{
    key: 'canPlay',
    value: function canPlay(resource) {
      var mimeType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      _shakaPlayer2.default.polyfill.installAll();
      var browserSupported = _shakaPlayer2.default.Player.isBrowserSupported();
      var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || [];
      return browserSupported && (resourceParts[1] === 'mpd' || mimeType.indexOf('application/dash+xml') > -1);
    }
  }, {
    key: 'Events',
    get: function get() {
      return {
        SHAKA_READY: 'shaka:ready'
      };
    }
  }]);

  function DashShakaPlayback() {
    var _ref;

    _classCallCheck(this, DashShakaPlayback);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_ref = DashShakaPlayback.__proto__ || Object.getPrototypeOf(DashShakaPlayback)).call.apply(_ref, [this].concat(args)));

    _this._levels = [];
    _this._pendingAdaptationEvent = false;
    _this._isShakaReadyState = false;

    _this.options.autoPlay && _this.play();
    return _this;
  }

  _createClass(DashShakaPlayback, [{
    key: 'play',
    value: function play() {
      if (!this._player) {
        this._setup();
      }

      if (!this.isReady) {
        this.once(DashShakaPlayback.Events.SHAKA_READY, this.play);
        return;
      }

      this._stopped = false;
      this._src = this.el.src;
      _get(DashShakaPlayback.prototype.__proto__ || Object.getPrototypeOf(DashShakaPlayback.prototype), 'play', this).call(this);
    }

    // skipping setup `setupSrc` on tag video

  }, {
    key: 'setupSrc',
    value: function setupSrc() {}

    // skipping ready event on video tag in favor of ready on shaka

  }, {
    key: '_ready',
    value: function _ready() {
      // override with no-op
    }
  }, {
    key: '_onShakaReady',
    value: function _onShakaReady() {
      this._isShakaReadyState = true;
      this.trigger(DashShakaPlayback.Events.SHAKA_READY);
      this.trigger(_clappr.Events.PLAYBACK_READY, this.name);
    }
  }, {
    key: 'error',


    // skipping error handling on video tag in favor of error on shaka
    value: function error(event) {
      _clappr.Log.error('an error was raised by the video tag', event, this.el.error);
    }
  }, {
    key: 'isHighDefinitionInUse',
    value: function isHighDefinitionInUse() {
      return !!this.highDefinition;
    }
  }, {
    key: 'stop',
    value: function stop() {
      var _this3 = this;

      clearInterval(this.sendStatsId);
      this._stopped = true;

      if (this._player) {
        this._sendStats();

        this._player.unload().then(function () {
          _get(DashShakaPlayback.prototype.__proto__ || Object.getPrototypeOf(DashShakaPlayback.prototype), 'stop', _this3).call(_this3);
          _this3._player = null;
          _this3._isShakaReadyState = false;
        }).catch(function () {
          _clappr.Log.error('shaka could not be unloaded');
        });
      } else {
        _get(DashShakaPlayback.prototype.__proto__ || Object.getPrototypeOf(DashShakaPlayback.prototype), 'stop', this).call(this);
      }
    }
  }, {
    key: 'getPlaybackType',
    value: function getPlaybackType() {
      return (this.isReady && this._player.isLive() ? 'live' : 'vod') || '';
    }
  }, {
    key: 'selectTrack',
    value: function selectTrack(track) {
      if (track.type === 'text') {
        this._player.selectTextTrack(track);
      } else if (track.type === 'variant') {
        this._player.selectVariantTrack(track);
        if (track.mimeType.startsWith('video/')) {
          // we trigger the adaptation event here
          // because Shaka doesn't trigger its event on "manual" selection.
          this._onAdaptation();
        }
      } else {
        throw new Error('Unhandled track type:', track.type);
      }
    }

    /**
     * @override
     */

  }, {
    key: '_enableShakaTextTrack',
    value: function _enableShakaTextTrack(isEnable) {
      // Shaka player use only one TextTrack object with video element to handle all text tracks
      // It must be enabled or disabled in addition to call selectTextTrack()
      if (!this.el.textTracks) {
        return;
      }

      this._shakaTTVisible = isEnable;

      Array.from(this.el.textTracks).filter(function (track) {
        return track.kind === 'subtitles';
      }).forEach(function (track) {
        return track.mode = isEnable === true ? 'showing' : 'hidden';
      });
    }
  }, {
    key: '_checkForClosedCaptions',
    value: function _checkForClosedCaptions() {
      if (this._ccIsSetup) {
        return;
      }

      if (this.hasClosedCaptionsTracks) {
        this.trigger(_clappr.Events.PLAYBACK_SUBTITLE_AVAILABLE);
        var trackId = this.closedCaptionsTrackId;
        this.closedCaptionsTrackId = trackId;
      }
      this._ccIsSetup = true;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this4 = this;

      clearInterval(this.sendStatsId);

      if (this._player) {
        this._player.destroy().then(function () {
          return _this4._destroy();
        }).catch(function () {
          _this4._destroy();
          _clappr.Log.error('shaka could not be destroyed');
        });
      } else {
        this._destroy();
      }

      _get(DashShakaPlayback.prototype.__proto__ || Object.getPrototypeOf(DashShakaPlayback.prototype), 'destroy', this).call(this);
    }
  }, {
    key: '_setup',
    value: function _setup() {
      var _this5 = this;

      this._isShakaReadyState = false;
      this._ccIsSetup = false;
      this._player = this._createPlayer();
      this._options.shakaConfiguration && this._player.configure(this._options.shakaConfiguration);
      this._options.shakaOnBeforeLoad && this._options.shakaOnBeforeLoad(this._player);

      var playerLoaded = this._player.load(this._options.src);
      playerLoaded.then(function () {
        return _this5._loaded();
      }).catch(function (e) {
        return _this5._setupError(e);
      });
    }
  }, {
    key: '_createPlayer',
    value: function _createPlayer() {
      var player = new _shakaPlayer2.default.Player(this.el);
      player.addEventListener('error', this._onError.bind(this));
      player.addEventListener('adaptation', this._onAdaptation.bind(this));
      player.addEventListener('buffering', this._onBuffering.bind(this));
      return player;
    }
  }, {
    key: '_onBuffering',
    value: function _onBuffering(e) {
      if (this._stopped) return;
      var event = e.buffering ? _clappr.Events.PLAYBACK_BUFFERING : _clappr.Events.PLAYBACK_BUFFERFULL;
      this.trigger(event);
    }
  }, {
    key: '_loaded',
    value: function _loaded() {
      this._onShakaReady();
      this._startToSendStats();
      this._fillLevels();
      this._checkForClosedCaptions();
    }
  }, {
    key: '_fillLevels',
    value: function _fillLevels() {
      if (this._levels.length === 0) {
        this._levels = this.videoTracks.map(function (videoTrack) {
          return { id: videoTrack.id, label: videoTrack.height + 'p' };
        }).reverse();
        this.trigger(_clappr.Events.PLAYBACK_LEVELS_AVAILABLE, this.levels);
      }
    }
  }, {
    key: '_startToSendStats',
    value: function _startToSendStats() {
      var _this6 = this;

      var intervalMs = this._options.shakaSendStatsInterval || SEND_STATS_INTERVAL_MS;
      this.sendStatsId = setInterval(function () {
        return _this6._sendStats();
      }, intervalMs);
    }
  }, {
    key: '_sendStats',
    value: function _sendStats() {
      this.trigger(_clappr.Events.PLAYBACK_STATS_ADD, this._player.getStats());
    }
  }, {
    key: '_setupError',
    value: function _setupError(err) {
      this._onError(err);
    }
  }, {
    key: '_onError',
    value: function _onError(err) {
      var error = {
        shakaError: err,
        videoError: this.el.error
      };

      if (error.videoError) return _get(DashShakaPlayback.prototype.__proto__ || Object.getPrototypeOf(DashShakaPlayback.prototype), '_onError', this).call(this);

      var _ref2 = error.shakaError.detail || error.shakaError,
          category = _ref2.category,
          code = _ref2.code,
          severity = _ref2.severity;

      var errorData = {
        code: category + '_' + code,
        description: 'Category: ' + category + ', code: ' + code + ', severity: ' + severity,
        level: severity === 1 ? _clappr.PlayerError.Levels.WARN : _clappr.PlayerError.Levels.FATAL,
        raw: err
      };
      var formattedError = this.createError(errorData);
      _clappr.Log.error('Shaka error event:', formattedError);
      this.trigger(_clappr.Events.PLAYBACK_ERROR, formattedError);
    }
  }, {
    key: '_onAdaptation',
    value: function _onAdaptation() {
      var activeVideo = this.videoTracks.filter(function (t) {
        return t.active === true;
      })[0];

      this._fillLevels();

      // update stats that may have changed before we trigger event
      // so that user can rely on stats data when handling event
      this._sendStats();

      if (this._pendingAdaptationEvent_) {
        this.trigger(_clappr.Events.PLAYBACK_LEVEL_SWITCH_END);
        this._pendingAdaptationEvent = false;
      }

      _clappr.Log.debug('an adaptation has happened:', activeVideo);
      this.highDefinition = activeVideo.height >= 720;
      this.trigger(_clappr.Events.PLAYBACK_HIGHDEFINITIONUPDATE, this.highDefinition);
      this.trigger(_clappr.Events.PLAYBACK_BITRATE, {
        bandwidth: activeVideo.bandwidth,
        width: activeVideo.width,
        height: activeVideo.height,
        level: activeVideo.id
      });
    }
  }, {
    key: '_destroy',
    value: function _destroy() {
      this._isShakaReadyState = false;
      _clappr.Log.debug('shaka was destroyed');
    }
  }, {
    key: 'isReady',
    get: function get() {
      return this._isShakaReadyState;
    }
  }, {
    key: 'textTracks',
    get: function get() {
      return this.isReady && this._player.getTextTracks();
    }
  }, {
    key: 'audioTracks',
    get: function get() {
      return this.isReady && this._player.getVariantTracks().filter(function (t) {
        return t.mimeType.startsWith('audio/');
      });
    }
  }, {
    key: 'videoTracks',
    get: function get() {
      return this.isReady && this._player.getVariantTracks().filter(function (t) {
        return t.mimeType.startsWith('video/');
      });
    }
  }, {
    key: 'closedCaptionsTracks',
    get: function get() {
      var id = 0;
      var trackId = function trackId() {
        return id++;
      };
      var tracks = this.textTracks || [];

      return tracks.filter(function (track) {
        return track.kind === 'subtitle';
      }).map(function (track) {
        return { id: trackId(), name: track.label || track.language, track: track };
      });
    }

    /**
     * @override
     */

  }, {
    key: 'closedCaptionsTrackId',
    get: function get() {
      return _get(DashShakaPlayback.prototype.__proto__ || Object.getPrototypeOf(DashShakaPlayback.prototype), 'closedCaptionsTrackId', this);
    }

    /**
     * @override
     */
    ,
    set: function set(trackId) {
      if (!this._player) {
        return;
      }

      var tracks = this.closedCaptionsTracks;
      var showingTrack = void 0;

      // Note: -1 is for hide all tracks
      if (trackId !== -1) {
        showingTrack = tracks.find(function (track) {
          return track.id === trackId;
        });
        if (!showingTrack) {
          _clappr.Log.warn('Track id "' + trackId + '" not found');
          return;
        }
        if (this._shakaTTVisible && showingTrack.track.active === true) {
          _clappr.Log.info('Track id "' + trackId + '" already showing');
          return;
        }
      }

      if (showingTrack) {
        this._player.selectTextTrack(showingTrack.track);
        this._enableShakaTextTrack(true);
      } else {
        this._enableShakaTextTrack(false);
      }

      this._ccTrackId = trackId;
      this.trigger(_clappr.Events.PLAYBACK_SUBTITLE_CHANGED, {
        id: trackId
      });
    }
  }]);

  return DashShakaPlayback;
}(_clappr.HTML5Video);

exports.default = DashShakaPlayback;
module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ })
/******/ ]);
});
//# sourceMappingURL=dash-shaka-playback.external.js.map