<h1>
Clappr-plugins
</h1>

Clappr-plugins is part of Clappr project that contains the main builtins plugins of the Clappr Player.

Clappr is under development but production-ready. Feel free to open issues and send us pull requests.

<p>
  <a href="https://badge.fury.io/js/%40clappr%2Fplugins"><img src="https://badge.fury.io/js/%40clappr%2Fplugins.svg"></a>
  <a href="https://bundlephobia.com/result?p=@clappr/plugins@latest"><img src="https://img.shields.io/bundlephobia/min/@clappr/plugins"></a>
  <a href="https://travis-ci.org/clappr/clappr-plugins"><img src="https://travis-ci.org/clappr/clappr-plugins.svg?branch=master"></a>
  <a href="https://coveralls.io/github/clappr/clappr-plugins?branch=master"><img src="https://coveralls.io/repos/github/clappr/clappr-plugins/badge.svg?branch=master"></a>
  <a href="https://github.com/clappr/clappr-plugins/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-BSD--3--Clause-blue.svg"></a>
  <a href="https://www.jsdelivr.com/package/npm/@clappr/plugins"><img alt="jsDelivr hits (npm)" src="https://img.shields.io/jsdelivr/npm/hm/@clappr/plugins?color=orange"></a>
</p>

This project exports individually and as a single object (Plugins) the builtins plugins to create the Clappr Player. Those plugins are:

- [MediaControl](https://github.com/clappr/clappr-plugins#media-control)
- [ClickToPausePlugin](https://github.com/clappr/clappr-plugins#click-to-pause)
- [ClosedCaptions](https://github.com/clappr/clappr-plugins#closed-captions)
- [DVRControls](https://github.com/clappr/clappr-plugins#dvr-controls)
- [ErrorScreen](https://github.com/clappr/clappr-plugins#error-screen)
- [GoogleAnalytics](https://github.com/clappr/clappr-plugins#google-analytics)
- [PosterPlugin](https://github.com/clappr/clappr-plugins#poster)
- [SeekTime](https://github.com/clappr/clappr-plugins#seek-time)
- [SpinnerThreeBouncePlugin](https://github.com/clappr/clappr-plugins#spinner-three-bounce)
- [StatsPlugin](https://github.com/clappr/clappr-plugins#stats)
- [WaterMarkPlugin](https://github.com/clappr/clappr-plugins#watermark)
- [EndVideo](https://github.com/clappr/clappr-plugins#end-video)
- [Favicon](https://github.com/clappr/clappr-plugins#favicon)

## About plugins

A plugin can add new capabilities to Clappr or extend an existing one. A plugin can also be either visual (change or add some behavior in the user interface) or internal, collecting data from the video that is playing, for example.

The plugins are organized into categories that define their responsibility and level of permission to access the internal components of the player. For more information, see the section about [plugin types](https://github.com/clappr/clappr-plugins#types-of-plugins).

## Types of plugins

A plugin can be loaded within an internal permission level (scope) of the Player and must extend some base type supported by Clappr.

The scopes are: [Core](https://github.com/clappr/clappr-plugins#core), [Container](https://github.com/clappr/clappr-plugins#container) and [Playback](https://github.com/clappr/clappr-plugins#playback). To learn more about the Clappr architecture, visit: https://github.com/clappr/clappr/wiki/Architecture

Following the classes that a plugin can extend, this will define its type and structure.

Plugins that do not handle UI, can extend from: [CorePlugin](https://github.com/clappr/clappr-plugins#coreplugin), [ContainerPlugin](https://github.com/clappr/clappr-plugins#containerplugin) or [Playback](https://github.com/clappr/clappr-plugins#playback).

Plugins that need to manipulate the UI must extend from: [UICorePlugin]() or [UIContainerPlugin]().

## Scope of Plugins

### Core

The plugin has full access to the player, being able to access all events and internal data or manage and/or create an internal layer (Container for example).

Examples: [MediaControl](https://github.com/clappr/clappr-plugins/blob/master/src/plugins/media_control/media_control.js), [ClosedCaptions](https://github.com/clappr/clappr-plugins/blob/master/src/plugins/closed_captions/closed_captions.js), [EndVideo](https://github.com/clappr/clappr-plugins/blob/master/src/plugins/end_video.js), and others.

#### CorePlugin Class

| Methods    | Description |
|------------|-----------|
| bindEvents | A method called in the `constructor` where listeners for the desired events must be created. |
| enable     | Method to activate the plugin. The default implementation calls the `bindEvents` method and changes the value of the `this.enabled` flag to `true` if the plugin is disabled. |
| disable    | Method to disable the plugin. The default implementation removes existing listeners and changes the value of the `this.enabled` flag to `false` if the plugin is enabled. |
| destroy    | A method that destroys the plugin's listeners. |

#### UICorePlugin Class

| Methods    | Description |
|------------|-----------|
| bindEvents | A method called in the `constructor` where listeners for the desired events must be created. |
| enable     | Method to activate the plugin. The default implementation calls the `bindEvents` method, changes the value of the `this.enabled` flag to `true` and leaves the plugin visible in the Player if it's disabled. |
| disable    | Method to disable the plugin. The default implementation removes existing listeners, changes the value of the `this.enabled` flag to `false` and hides the plugin in the player if it's enabled. |
| render     | A method called in the `constructor` of the base class where the element that will be rendered in the player must be filled out. |
| destroy    | A method that removes the plugin of the `DOM`. |

---

### Container

The plugin has control only within the scope of the media.

Examples: [SpinnerThreeBounce](https://github.com/clappr/clappr-plugins/blob/master/src/plugins/spinner_three_bounce/spinner_three_bounce.js), [WaterMark](https://github.com/clappr/clappr-plugins/blob/master/src/plugins/watermark/watermark.js), [Stats](https://github.com/clappr/clappr-plugins/blob/master/src/plugins/stats/stats.js) and others.

#### ContainerPlugin Class

| Métodos    | Description |
|------------|-----------|
| bindEvents |A method called in the `constructor` where listeners for the desired events must be created. |
| enable     | Method to activate the plugin. The default implementation calls the `bindEvents` method and changes the value of the` this.enabled` flag to `true` if the plugin is disabled. |
| disable    |  Method to disable the plugin. The default implementation removes existing listeners, changes the value of the `this.enabled` flag to` false` and hides the plugin in the player if it's enabled. |
| destroy    |  A method that destroys the plugin's listeners. |

#### UIContainerPlugin Class

| Métodos    | Description |
|------------|-----------|
| bindEvents | A method called in the `constructor` where listeners for the desired events must be created. |
| enable     | Method to activate the plugin. The default implementation calls the `bindEvents` method, changes the value of the `this.enabled` flag to `true` and leaves the plugin visible in the Player if it's disabled. |
| disable    | Method to disable the plugin. The default implementation removes existing listeners, changes the value of the `this.enabled` flag to `false` and hides the plugin in the player if it's enabled. |
| render     | A method called in the `constructor` of the base class where the element that will be rendered in the player must be filled out. |
| destroy    | A method that removes the plugin of the `DOM`. |

---

### Playback

Controls execution and adds support for different types of media. Since playback plugins are intended to support a specific type of media, the plugin is extended from some other existing playback plugin or the base playback class.

More information about the Playback base class in the Clappr-core repository: https://github.com/clappr/clappr-core/blob/master/src/base/playback/playback.js

Exemplos: [HlsPlayback](https://github.com/clappr/hlsjs-playback), [DashShakaPlayback](https://github.com/clappr/dash-shaka-playback), [HTML5Video](https://github.com/clappr/clappr-core/blob/master/src/playbacks/html5_video/html5_video.js) and others.


## Plugins Description

### Media Control
A plugin that renders the interface over the video container and add the possibility to control playback actions (play, pause, stop).

### Click to pause
Adds the possibility to toggle between the `play`/`pause` playback states by clicking on the container element.

### Closed captions
Adds the possibility to customize the label and title of the subtitles.
```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.mp4",
  closedCaptionsConfig: {
    title: 'Subtitles', // default is none
    ariaLabel: 'Closed Captions', // Default is 'cc-button'
    labelCallback: function (track) { return track.name }, // track is an object with id, name and track properties (track is TextTrack object)
  },
});
```

### DVR controls
Add controls to interact with the media in DVR mode.

### Error screen
Add a screen to inform the error name and the possibility to retry to play the media.

### Google analytics
Enable Google Analytics events dispatch (play/pause/stop/buffering/etc) adding your `gaAccount`. Optionally, pass your favorite trackerName as `gaTrackerName`.
```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.mp4",
  gaAccount: 'UA-44332211-1',
  gaTrackerName: 'MyPlayerInstance'
});
```
### Poster
Defines a poster image by adding the poster option to Clappr player. It will appear after video embed, disappear on play and go back when user stops the video. For audio broadcasts, the poster stays visible while playing.
```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.mp4",
  poster: "http://url/img.png"
});
```

### Seek time
Inform the current time when a hover on media control seekbar occurs.

### Spinner three bounce
Signals when player enter on buffering state.

### Stats
A native statistics plugin that accounts QoE metrics such playing time, rebuffering time, total rebuffer count, etc.

### Watermark
Add a watermark over the video. Put `watermark` option on your embed parameters to automatically add watermark on your video.

Choose corner position by defining `position` option.

Positions can be `bottom-left`, `bottom-right`, `top-left` and `top-right`. To define an URL to open when the watermark is clicked, use `watermarkLink` option.

If the `watermarkLink` parameter not defined, the watermark will not be clickable.
```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.mp4",
  watermark: "http://url/img.png",
  position: 'top-right',
  watermarkLink: "http://example.net/"
});
```
### End video
Add the possibility to exit from fullscreen mode when the video ends. The option `exitFullscreenOnEnd` disable this behavior.
```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.mp4",
  exitFullscreenOnEnd: false
});
```
### Favicon
Add a favicon with the current state of the playback.
