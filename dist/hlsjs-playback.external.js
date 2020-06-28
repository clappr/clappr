(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@clappr/core'), require('hls.js')) :
  typeof define === 'function' && define.amd ? define(['@clappr/core', 'hls.js'], factory) :
  (global = global || self, global.HlsjsPlayback = factory(global.Clappr, global.Hls));
}(this, (function (core, HLSJS) { 'use strict';

  HLSJS = HLSJS && Object.prototype.hasOwnProperty.call(HLSJS, 'default') ? HLSJS['default'] : HLSJS;

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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
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

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
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

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
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

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var now = core.Utils.now,
      assign = core.Utils.assign,
      listContainsIgnoreCase = core.Utils.listContainsIgnoreCase;
  var AUTO = -1;

  var HlsjsPlayback = /*#__PURE__*/function (_HTML5Video) {
    _inherits(HlsjsPlayback, _HTML5Video);

    var _super = _createSuper(HlsjsPlayback);

    _createClass(HlsjsPlayback, [{
      key: "name",
      get: function get() {
        return 'hls';
      }
    }, {
      key: "supportedVersion",
      get: function get() {
        return {
          min: "0.4.11"
        };
      }
    }, {
      key: "levels",
      get: function get() {
        return this._levels || [];
      }
    }, {
      key: "currentLevel",
      get: function get() {
        if (this._currentLevel === null || this._currentLevel === undefined) return AUTO;else return this._currentLevel; //0 is a valid level ID
      },
      set: function set(id) {
        this._currentLevel = id;
        this.trigger(core.Events.PLAYBACK_LEVEL_SWITCH_START);
        if (this.options.playback.hlsUseNextLevel) this._hls.nextLevel = this._currentLevel;else this._hls.currentLevel = this._currentLevel;
      }
    }, {
      key: "isReady",
      get: function get() {
        return this._isReadyState;
      }
    }, {
      key: "_startTime",
      get: function get() {
        if (this._playbackType === core.Playback.LIVE && this._playlistType !== 'EVENT') return this._extrapolatedStartTime;
        return this._playableRegionStartTime;
      }
    }, {
      key: "_now",
      get: function get() {
        return now();
      } // the time in the video element which should represent the start of the sliding window
      // extrapolated to increase in real time (instead of jumping as the early segments are removed)

    }, {
      key: "_extrapolatedStartTime",
      get: function get() {
        if (!this._localStartTimeCorrelation) return this._playableRegionStartTime;
        var corr = this._localStartTimeCorrelation;
        var timePassed = this._now - corr.local;
        var extrapolatedWindowStartTime = (corr.remote + timePassed) / 1000; // cap at the end of the extrapolated window duration

        return Math.min(extrapolatedWindowStartTime, this._playableRegionStartTime + this._extrapolatedWindowDuration);
      } // the time in the video element which should represent the end of the content
      // extrapolated to increase in real time (instead of jumping as segments are added)

    }, {
      key: "_extrapolatedEndTime",
      get: function get() {
        var actualEndTime = this._playableRegionStartTime + this._playableRegionDuration;
        if (!this._localEndTimeCorrelation) return actualEndTime;
        var corr = this._localEndTimeCorrelation;
        var timePassed = this._now - corr.local;
        var extrapolatedEndTime = (corr.remote + timePassed) / 1000;
        return Math.max(actualEndTime - this._extrapolatedWindowDuration, Math.min(extrapolatedEndTime, actualEndTime));
      }
    }, {
      key: "_duration",
      get: function get() {
        return this._extrapolatedEndTime - this._startTime;
      } // Returns the duration (seconds) of the window that the extrapolated start time is allowed
      // to move in before being capped.
      // The extrapolated start time should never reach the cap at the end of the window as the
      // window should slide as chunks are removed from the start.
      // This also applies to the extrapolated end time in the same way.
      //
      // If chunks aren't being removed for some reason that the start time will reach and remain fixed at
      // playableRegionStartTime + extrapolatedWindowDuration
      //
      //                                <-- window duration -->
      // I.e   playableRegionStartTime |-----------------------|
      //                               | -->   .       .       .
      //                               .   --> | -->   .       .
      //                               .       .   --> | -->   .
      //                               .       .       .   --> |
      //                               .       .       .       .
      //                                 extrapolatedStartTime

    }, {
      key: "_extrapolatedWindowDuration",
      get: function get() {
        if (this._segmentTargetDuration === null) return 0;
        return this._extrapolatedWindowNumSegments * this._segmentTargetDuration;
      }
    }], [{
      key: "HLSJS",
      get: function get() {
        return HLSJS;
      }
    }]);

    function HlsjsPlayback() {
      var _this;

      _classCallCheck(this, HlsjsPlayback);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args)); // backwards compatibility (TODO: remove on 0.3.0)

      _this.options.playback = _objectSpread2(_objectSpread2({}, _this.options), _this.options.playback);
      _this._minDvrSize = typeof _this.options.hlsMinimumDvrSize === 'undefined' ? 60 : _this.options.hlsMinimumDvrSize; // The size of the start time extrapolation window measured as a multiple of segments.
      // Should be 2 or higher, or 0 to disable. Should only need to be increased above 2 if more than one segment is
      // removed from the start of the playlist at a time. E.g if the playlist is cached for 10 seconds and new chunks are
      // added/removed every 5.

      _this._extrapolatedWindowNumSegments = !_this.options.playback || typeof _this.options.playback.extrapolatedWindowNumSegments === 'undefined' ? 2 : _this.options.playback.extrapolatedWindowNumSegments;
      _this._playbackType = core.Playback.VOD;
      _this._lastTimeUpdate = {
        current: 0,
        total: 0
      };
      _this._lastDuration = null; // for hls streams which have dvr with a sliding window,
      // the content at the start of the playlist is removed as new
      // content is appended at the end.
      // this means the actual playable start time will increase as the
      // start content is deleted
      // For streams with dvr where the entire recording is kept from the
      // beginning this should stay as 0

      _this._playableRegionStartTime = 0; // {local, remote} remote is the time in the video element that should represent 0
      //                 local is the system time when the 'remote' measurment took place

      _this._localStartTimeCorrelation = null; // {local, remote} remote is the time in the video element that should represents the end
      //                 local is the system time when the 'remote' measurment took place

      _this._localEndTimeCorrelation = null; // if content is removed from the beginning then this empty area should
      // be ignored. "playableRegionDuration" excludes the empty area

      _this._playableRegionDuration = 0; // #EXT-X-PROGRAM-DATE-TIME

      _this._programDateTime = 0; // true when the actual duration is longer than hlsjs's live sync point
      // when this is false playableRegionDuration will be the actual duration
      // when this is true playableRegionDuration will exclude the time after the sync point

      _this._durationExcludesAfterLiveSyncPoint = false; // #EXT-X-TARGETDURATION

      _this._segmentTargetDuration = null; // #EXT-X-PLAYLIST-TYPE

      _this._playlistType = null;
      _this._recoverAttemptsRemaining = _this.options.hlsRecoverAttempts || 16;
      return _this;
    }

    _createClass(HlsjsPlayback, [{
      key: "_setup",
      value: function _setup() {
        var _this2 = this;

        this._ccIsSetup = false;
        this._ccTracksUpdated = false;
        this._hls = new HLSJS(assign({}, this.options.playback.hlsjsConfig));

        this._hls.once(HLSJS.Events.MEDIA_ATTACHED, function () {
          return _this2._hls.loadSource(_this2.options.src);
        });

        this._hls.on(HLSJS.Events.LEVEL_LOADED, function (evt, data) {
          return _this2._updatePlaybackType(evt, data);
        });

        this._hls.on(HLSJS.Events.LEVEL_UPDATED, function (evt, data) {
          return _this2._onLevelUpdated(evt, data);
        });

        this._hls.on(HLSJS.Events.LEVEL_SWITCHING, function (evt, data) {
          return _this2._onLevelSwitch(evt, data);
        });

        this._hls.on(HLSJS.Events.FRAG_LOADED, function (evt, data) {
          return _this2._onFragmentLoaded(evt, data);
        });

        this._hls.on(HLSJS.Events.ERROR, function (evt, data) {
          return _this2._onHLSJSError(evt, data);
        });

        this._hls.on(HLSJS.Events.SUBTITLE_TRACK_LOADED, function (evt, data) {
          return _this2._onSubtitleLoaded(evt, data);
        });

        this._hls.on(HLSJS.Events.SUBTITLE_TRACKS_UPDATED, function () {
          return _this2._ccTracksUpdated = true;
        });

        this._hls.attachMedia(this.el);
      }
    }, {
      key: "render",
      value: function render() {
        this._ready();

        return _get(_getPrototypeOf(HlsjsPlayback.prototype), "render", this).call(this);
      }
    }, {
      key: "_ready",
      value: function _ready() {
        this._isReadyState = true;
        this.trigger(core.Events.PLAYBACK_READY, this.name);
      }
    }, {
      key: "_recover",
      value: function _recover(evt, data, error) {
        if (!this._recoveredDecodingError) {
          this._recoveredDecodingError = true;

          this._hls.recoverMediaError();
        } else if (!this._recoveredAudioCodecError) {
          this._recoveredAudioCodecError = true;

          this._hls.swapAudioCodec();

          this._hls.recoverMediaError();
        } else {
          core.Log.error('hlsjs: failed to recover', {
            evt: evt,
            data: data
          });
          error.level = core.PlayerError.Levels.FATAL;
          var formattedError = this.createError(error);
          this.trigger(core.Events.PLAYBACK_ERROR, formattedError);
          this.stop();
        }
      } // override

    }, {
      key: "_setupSrc",
      value: function _setupSrc(srcUrl) {// eslint-disable-line no-unused-vars
        // this playback manages the src on the video element itself
      }
    }, {
      key: "_startTimeUpdateTimer",
      value: function _startTimeUpdateTimer() {
        var _this3 = this;

        if (this._timeUpdateTimer) return;
        this._timeUpdateTimer = setInterval(function () {
          _this3._onDurationChange();

          _this3._onTimeUpdate();
        }, 100);
      }
    }, {
      key: "_stopTimeUpdateTimer",
      value: function _stopTimeUpdateTimer() {
        if (!this._timeUpdateTimer) return;
        clearInterval(this._timeUpdateTimer);
        this._timeUpdateTimer = null;
      }
    }, {
      key: "getProgramDateTime",
      value: function getProgramDateTime() {
        return this._programDateTime;
      } // the duration on the video element itself should not be used
      // as this does not necesarily represent the duration of the stream
      // https://github.com/clappr/clappr/issues/668#issuecomment-157036678

    }, {
      key: "getDuration",
      value: function getDuration() {
        return this._duration;
      }
    }, {
      key: "getCurrentTime",
      value: function getCurrentTime() {
        // e.g. can be < 0 if user pauses near the start
        // eventually they will then be kicked to the end by hlsjs if they run out of buffer
        // before the official start time
        return Math.max(0, this.el.currentTime - this._startTime);
      } // the time that "0" now represents relative to when playback started
      // for a stream with a sliding window this will increase as content is
      // removed from the beginning

    }, {
      key: "getStartTimeOffset",
      value: function getStartTimeOffset() {
        return this._startTime;
      }
    }, {
      key: "seekPercentage",
      value: function seekPercentage(percentage) {
        var seekTo = this._duration;
        if (percentage > 0) seekTo = this._duration * (percentage / 100);
        this.seek(seekTo);
      }
    }, {
      key: "seek",
      value: function seek(time) {
        if (time < 0) {
          core.Log.warn('Attempt to seek to a negative time. Resetting to live point. Use seekToLivePoint() to seek to the live point.');
          time = this.getDuration();
        } // assume live if time within 3 seconds of end of stream


        this.dvrEnabled && this._updateDvr(time < this.getDuration() - 3);
        time += this._startTime;

        _get(_getPrototypeOf(HlsjsPlayback.prototype), "seek", this).call(this, time);
      }
    }, {
      key: "seekToLivePoint",
      value: function seekToLivePoint() {
        this.seek(this.getDuration());
      }
    }, {
      key: "_updateDvr",
      value: function _updateDvr(status) {
        this.trigger(core.Events.PLAYBACK_DVR, status);
        this.trigger(core.Events.PLAYBACK_STATS_ADD, {
          'dvr': status
        });
      }
    }, {
      key: "_updateSettings",
      value: function _updateSettings() {
        if (this._playbackType === core.Playback.VOD) this.settings.left = ['playpause', 'position', 'duration'];else if (this.dvrEnabled) this.settings.left = ['playpause'];else this.settings.left = ['playstop'];
        this.settings.seekEnabled = this.isSeekEnabled();
        this.trigger(core.Events.PLAYBACK_SETTINGSUPDATE);
      }
    }, {
      key: "_onHLSJSError",
      value: function _onHLSJSError(evt, data) {
        var error = {
          code: "".concat(data.type, "_").concat(data.details),
          description: "".concat(this.name, " error: type: ").concat(data.type, ", details: ").concat(data.details),
          raw: data
        };
        var formattedError;
        if (data.response) error.description += ", response: ".concat(JSON.stringify(data.response)); // only report/handle errors if they are fatal
        // hlsjs should automatically handle non fatal errors

        if (data.fatal) {
          if (this._recoverAttemptsRemaining > 0) {
            this._recoverAttemptsRemaining -= 1;

            switch (data.type) {
              case HLSJS.ErrorTypes.NETWORK_ERROR:
                switch (data.details) {
                  // The following network errors cannot be recovered with HLS.startLoad()
                  // For more details, see https://github.com/video-dev/hls.js/blob/master/doc/design.md#error-detection-and-handling
                  // For "level load" fatal errors, see https://github.com/video-dev/hls.js/issues/1138
                  case HLSJS.ErrorDetails.MANIFEST_LOAD_ERROR:
                  case HLSJS.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
                  case HLSJS.ErrorDetails.MANIFEST_PARSING_ERROR:
                  case HLSJS.ErrorDetails.LEVEL_LOAD_ERROR:
                  case HLSJS.ErrorDetails.LEVEL_LOAD_TIMEOUT:
                    core.Log.error('hlsjs: unrecoverable network fatal error.', {
                      evt: evt,
                      data: data
                    });
                    formattedError = this.createError(error);
                    this.trigger(core.Events.PLAYBACK_ERROR, formattedError);
                    this.stop();
                    break;

                  default:
                    core.Log.warn('hlsjs: trying to recover from network error.', {
                      evt: evt,
                      data: data
                    });
                    error.level = core.PlayerError.Levels.WARN;

                    this._hls.startLoad();

                    break;
                }

                break;

              case HLSJS.ErrorTypes.MEDIA_ERROR:
                core.Log.warn('hlsjs: trying to recover from media error.', {
                  evt: evt,
                  data: data
                });
                error.level = core.PlayerError.Levels.WARN;

                this._recover(evt, data, error);

                break;

              default:
                core.Log.error('hlsjs: could not recover from error.', {
                  evt: evt,
                  data: data
                });
                formattedError = this.createError(error);
                this.trigger(core.Events.PLAYBACK_ERROR, formattedError);
                this.stop();
                break;
            }
          } else {
            core.Log.error('hlsjs: could not recover from error after maximum number of attempts.', {
              evt: evt,
              data: data
            });
            formattedError = this.createError(error);
            this.trigger(core.Events.PLAYBACK_ERROR, formattedError);
            this.stop();
          }
        } else {
          // Transforms HLSJS.ErrorDetails.KEY_LOAD_ERROR non-fatal error to
          // playback fatal error if triggerFatalErrorOnResourceDenied playback
          // option is set. HLSJS.ErrorTypes.KEY_SYSTEM_ERROR are fatal errors
          // and therefore already handled.
          if (this.options.playback.triggerFatalErrorOnResourceDenied && this._keyIsDenied(data)) {
            core.Log.error('hlsjs: could not load decrypt key.', {
              evt: evt,
              data: data
            });
            formattedError = this.createError(error);
            this.trigger(core.Events.PLAYBACK_ERROR, formattedError);
            this.stop();
            return;
          }

          error.level = core.PlayerError.Levels.WARN;
          core.Log.warn('hlsjs: non-fatal error occurred', {
            evt: evt,
            data: data
          });
        }
      }
    }, {
      key: "_keyIsDenied",
      value: function _keyIsDenied(data) {
        return data.type === HLSJS.ErrorTypes.NETWORK_ERROR && data.details === HLSJS.ErrorDetails.KEY_LOAD_ERROR && data.response && data.response.code >= 400;
      }
    }, {
      key: "_onTimeUpdate",
      value: function _onTimeUpdate() {
        var update = {
          current: this.getCurrentTime(),
          total: this.getDuration(),
          firstFragDateTime: this.getProgramDateTime()
        };
        var isSame = this._lastTimeUpdate && update.current === this._lastTimeUpdate.current && update.total === this._lastTimeUpdate.total;
        if (isSame) return;
        this._lastTimeUpdate = update;
        this.trigger(core.Events.PLAYBACK_TIMEUPDATE, update, this.name);
      }
    }, {
      key: "_onDurationChange",
      value: function _onDurationChange() {
        var duration = this.getDuration();
        if (this._lastDuration === duration) return;
        this._lastDuration = duration;

        _get(_getPrototypeOf(HlsjsPlayback.prototype), "_onDurationChange", this).call(this);
      }
    }, {
      key: "_onProgress",
      value: function _onProgress() {
        if (!this.el.buffered.length) return;
        var buffered = [];
        var bufferedPos = 0;

        for (var i = 0; i < this.el.buffered.length; i++) {
          buffered = [].concat(_toConsumableArray(buffered), [{
            // for a stream with sliding window dvr something that is buffered my slide off the start of the timeline
            start: Math.max(0, this.el.buffered.start(i) - this._playableRegionStartTime),
            end: Math.max(0, this.el.buffered.end(i) - this._playableRegionStartTime)
          }]);
          if (this.el.currentTime >= buffered[i].start && this.el.currentTime <= buffered[i].end) bufferedPos = i;
        }

        var progress = {
          start: buffered[bufferedPos].start,
          current: buffered[bufferedPos].end,
          total: this.getDuration()
        };
        this.trigger(core.Events.PLAYBACK_PROGRESS, progress, buffered);
      }
    }, {
      key: "play",
      value: function play() {
        if (!this._hls) this._setup();

        _get(_getPrototypeOf(HlsjsPlayback.prototype), "play", this).call(this);

        this._startTimeUpdateTimer();
      }
    }, {
      key: "pause",
      value: function pause() {
        if (!this._hls) return;

        _get(_getPrototypeOf(HlsjsPlayback.prototype), "pause", this).call(this);

        if (this.dvrEnabled) this._updateDvr(true);
      }
    }, {
      key: "stop",
      value: function stop() {
        this._stopTimeUpdateTimer();

        if (this._hls) {
          _get(_getPrototypeOf(HlsjsPlayback.prototype), "stop", this).call(this);

          this._hls.destroy();

          delete this._hls;
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._stopTimeUpdateTimer();

        if (this._hls) {
          this._hls.destroy();

          delete this._hls;
        }

        _get(_getPrototypeOf(HlsjsPlayback.prototype), "destroy", this).call(this);
      }
    }, {
      key: "_updatePlaybackType",
      value: function _updatePlaybackType(evt, data) {
        this._playbackType = data.details.live ? core.Playback.LIVE : core.Playback.VOD;

        this._onLevelUpdated(evt, data); // Live stream subtitle tracks detection hack (may not immediately available)


        if (this._ccTracksUpdated && this._playbackType === core.Playback.LIVE && this.hasClosedCaptionsTracks) this._onSubtitleLoaded();
      }
    }, {
      key: "_fillLevels",
      value: function _fillLevels() {
        this._levels = this._hls.levels.map(function (level, index) {
          return {
            id: index,
            level: level,
            label: "".concat(level.bitrate / 1000, "Kbps")
          };
        });
        this.trigger(core.Events.PLAYBACK_LEVELS_AVAILABLE, this._levels);
      }
    }, {
      key: "_onLevelUpdated",
      value: function _onLevelUpdated(evt, data) {
        this._segmentTargetDuration = data.details.targetduration;
        this._playlistType = data.details.type || null;
        var startTimeChanged = false;
        var durationChanged = false;
        var fragments = data.details.fragments;
        var previousPlayableRegionStartTime = this._playableRegionStartTime;
        var previousPlayableRegionDuration = this._playableRegionDuration;
        if (fragments.length === 0) return; // #EXT-X-PROGRAM-DATE-TIME

        if (fragments[0].rawProgramDateTime) this._programDateTime = fragments[0].rawProgramDateTime;

        if (this._playableRegionStartTime !== fragments[0].start) {
          startTimeChanged = true;
          this._playableRegionStartTime = fragments[0].start;
        }

        if (startTimeChanged) {
          if (!this._localStartTimeCorrelation) {
            // set the correlation to map to middle of the extrapolation window
            this._localStartTimeCorrelation = {
              local: this._now,
              remote: (fragments[0].start + this._extrapolatedWindowDuration / 2) * 1000
            };
          } else {
            // check if the correlation still works
            var corr = this._localStartTimeCorrelation;
            var timePassed = this._now - corr.local; // this should point to a time within the extrapolation window

            var startTime = (corr.remote + timePassed) / 1000;

            if (startTime < fragments[0].start) {
              // our start time is now earlier than the first chunk
              // (maybe the chunk was removed early)
              // reset correlation so that it sits at the beginning of the first available chunk
              this._localStartTimeCorrelation = {
                local: this._now,
                remote: fragments[0].start * 1000
              };
            } else if (startTime > previousPlayableRegionStartTime + this._extrapolatedWindowDuration) {
              // start time was past the end of the old extrapolation window (so would have been capped)
              // see if now that time would be inside the window, and if it would be set the correlation
              // so that it resumes from the time it was at at the end of the old window
              // update the correlation so that the time starts counting again from the value it's on now
              this._localStartTimeCorrelation = {
                local: this._now,
                remote: Math.max(fragments[0].start, previousPlayableRegionStartTime + this._extrapolatedWindowDuration) * 1000
              };
            }
          }
        }

        var newDuration = data.details.totalduration; // if it's a live stream then shorten the duration to remove access
        // to the area after hlsjs's live sync point
        // seeks to areas after this point sometimes have issues

        if (this._playbackType === core.Playback.LIVE) {
          var fragmentTargetDuration = data.details.targetduration;
          var hlsjsConfig = this.options.playback.hlsjsConfig || {};
          var liveSyncDurationCount = hlsjsConfig.liveSyncDurationCount || HLSJS.DefaultConfig.liveSyncDurationCount;
          var hiddenAreaDuration = fragmentTargetDuration * liveSyncDurationCount;

          if (hiddenAreaDuration <= newDuration) {
            newDuration -= hiddenAreaDuration;
            this._durationExcludesAfterLiveSyncPoint = true;
          } else {
            this._durationExcludesAfterLiveSyncPoint = false;
          }
        }

        if (newDuration !== this._playableRegionDuration) {
          durationChanged = true;
          this._playableRegionDuration = newDuration;
        } // Note the end time is not the playableRegionDuration
        // The end time will always increase even if content is removed from the beginning


        var endTime = fragments[0].start + newDuration;
        var previousEndTime = previousPlayableRegionStartTime + previousPlayableRegionDuration;
        var endTimeChanged = endTime !== previousEndTime;

        if (endTimeChanged) {
          if (!this._localEndTimeCorrelation) {
            // set the correlation to map to the end
            this._localEndTimeCorrelation = {
              local: this._now,
              remote: endTime * 1000
            };
          } else {
            // check if the correlation still works
            var _corr = this._localEndTimeCorrelation;

            var _timePassed = this._now - _corr.local; // this should point to a time within the extrapolation window from the end


            var extrapolatedEndTime = (_corr.remote + _timePassed) / 1000;

            if (extrapolatedEndTime > endTime) {
              this._localEndTimeCorrelation = {
                local: this._now,
                remote: endTime * 1000
              };
            } else if (extrapolatedEndTime < endTime - this._extrapolatedWindowDuration) {
              // our extrapolated end time is now earlier than the extrapolation window from the actual end time
              // (maybe a chunk became available early)
              // reset correlation so that it sits at the beginning of the extrapolation window from the end time
              this._localEndTimeCorrelation = {
                local: this._now,
                remote: (endTime - this._extrapolatedWindowDuration) * 1000
              };
            } else if (extrapolatedEndTime > previousEndTime) {
              // end time was past the old end time (so would have been capped)
              // set the correlation so that it resumes from the time it was at at the end of the old window
              this._localEndTimeCorrelation = {
                local: this._now,
                remote: previousEndTime * 1000
              };
            }
          }
        } // now that the values have been updated call any methods that use on them so they get the updated values
        // immediately


        durationChanged && this._onDurationChange();
        startTimeChanged && this._onProgress();
      }
    }, {
      key: "_onFragmentLoaded",
      value: function _onFragmentLoaded(evt, data) {
        this.trigger(core.Events.PLAYBACK_FRAGMENT_LOADED, data);
      }
    }, {
      key: "_onSubtitleLoaded",
      value: function _onSubtitleLoaded() {
        // This event may be triggered multiple times
        // Setup CC only once (disable CC by default)
        if (!this._ccIsSetup) {
          this.trigger(core.Events.PLAYBACK_SUBTITLE_AVAILABLE);
          var trackId = this._playbackType === core.Playback.LIVE ? -1 : this.closedCaptionsTrackId;
          this.closedCaptionsTrackId = trackId;
          this._ccIsSetup = true;
        }
      }
    }, {
      key: "_onLevelSwitch",
      value: function _onLevelSwitch(evt, data) {
        if (!this.levels.length) this._fillLevels();
        this.trigger(core.Events.PLAYBACK_LEVEL_SWITCH_END);
        this.trigger(core.Events.PLAYBACK_LEVEL_SWITCH, data);
        var currentLevel = this._hls.levels[data.level];

        if (currentLevel) {
          // TODO should highDefinition be private and maybe have a read only accessor if it's used somewhere
          this.highDefinition = currentLevel.height >= 720 || currentLevel.bitrate / 1000 >= 2000;
          this.trigger(core.Events.PLAYBACK_HIGHDEFINITIONUPDATE, this.highDefinition);
          this.trigger(core.Events.PLAYBACK_BITRATE, {
            height: currentLevel.height,
            width: currentLevel.width,
            bandwidth: currentLevel.bitrate,
            bitrate: currentLevel.bitrate,
            level: data.level
          });
        }
      }
    }, {
      key: "getPlaybackType",
      value: function getPlaybackType() {
        return this._playbackType;
      }
    }, {
      key: "isSeekEnabled",
      value: function isSeekEnabled() {
        return this._playbackType === core.Playback.VOD || this.dvrEnabled;
      }
    }, {
      key: "dvrEnabled",
      get: function get() {
        // enabled when:
        // - the duration does not include content after hlsjs's live sync point
        // - the playable region duration is longer than the configured duration to enable dvr after
        // - the playback type is LIVE.
        return this._durationExcludesAfterLiveSyncPoint && this._duration >= this._minDvrSize && this.getPlaybackType() === core.Playback.LIVE;
      }
    }]);

    return HlsjsPlayback;
  }(core.HTML5Video);

  HlsjsPlayback.canPlay = function (resource, mimeType) {
    var resourceParts = resource.split('?')[0].match(/.*\.(.*)$/) || [];
    var isHls = resourceParts.length > 1 && resourceParts[1].toLowerCase() === 'm3u8' || listContainsIgnoreCase(mimeType, ['application/vnd.apple.mpegurl', 'application/x-mpegURL']);
    return !!(HLSJS.isSupported() && isHls);
  };

  return HlsjsPlayback;

})));
