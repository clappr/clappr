<h1>
<!-- <img src="https://cloud.githubusercontent.com/assets/244265/6373134/a845eb50-bce7-11e4-80f2-592ba29972ab.png" width="300"> -->
Clappr-core
</h1>

Clappr-core is part of Clappr player that contains the main architecture of the Clappr project.

Clappr is under development but production-ready. Feel free to open issues and send us pull requests.

<p>
  <a href="https://badge.fury.io/js/%40clappr%2Fcore"><img src="https://badge.fury.io/js/%40clappr%2Fcore.svg"></a>
  <a href="https://bundlephobia.com/result?p=@clappr/core@latest"><img src="https://img.shields.io/bundlephobia/min/@clappr/core"></a>
  <a href="https://travis-ci.org/clappr/clappr-core"><img src="https://travis-ci.org/clappr/clappr-core.svg?branch=master"></a>
  <a href="https://coveralls.io/github/clappr/clappr-core?branch=master"><img src="https://coveralls.io/repos/github/clappr/clappr-core/badge.svg?branch=master"></a>
  <a href="https://github.com/clappr/clappr-core/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-BSD--3--Clause-blue.svg"></a>
</p>

CLAPPR CORE USAGE GIF

:video_camera: Demo
---
[Live demo](http://clappr.io/demo/) to test with a possibility to add external plugins.

:triangular_flag_on_post: Table of Contents
-----
* [Demo](https://github.com/clappr/clappr-core#demo)
* [Features](https://github.com/clappr/clappr-core#features)
* [Usage](https://github.com/clappr/clappr-core#Usage)
* [API Documentation](https://github.com/clappr/clappr-core#api-documentation)
* [Configuration](https://github.com/clappr/clappr-core#configuration)
* [Development](https://github.com/clappr/clappr-core#development)
* [Contributors](https://github.com/clappr/clappr-core#contributors)
* [Sponsor](https://github.com/clappr/clappr-core#sponsor)

Features
---


Usage
---
### Via script tag:

Add the following script on your HTML:
```html
<head>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/clappr/core@latest/dist/clappr.min.js"></script>
</head>
```
Now, create the player:
```html
<body>
  <div id="player"></div>
  <script>
    var player = new Clappr.Player({
      source: "http://your.video/here.mp4",
      parentId: "#player"
    });
  </script>
</body>
```

### Via npm module:

The project is on npm at https://www.npmjs.com/package/@clappr/core

`yarn install @clappr/core --save-dev`

You should specify the base url for where the assets are located using the `baseUrl` option:
```javascript
  var player = new Clappr.Player({
  	source: "http://your.video/here.mp4",
	  baseUrl: "http://example.com/assets/clappr"
  });
```
In the above case Clappr will expect all of the [assets (in the dist folder)](https://github.com/clappr/clappr-core/tree/master/dist) to be accessible at "http://example.com/assets/clappr-core".
You need to arrange for the assets to be located at `baseUrl` during your build process.

#### Installing for [webpack](https://webpack.github.io/):
By default webpack will look at the `main` field in `package.json` and use the built version of the project. If this is all you want there is nothing else for you to do.

If you would like to build the project yourself into your project during your build process then add the following to your webpack config:
```javascript
resolve: {
    alias: { Clappr: '@clappr/core/src/main.js' },
    root: [path.resolve(__dirname, 'node_modules/@clappr/core/src')],
    extensions: ['', '.js'],
}
```

#### Installing for [browserify](http://browserify.org/):
Browserify will look at the `main` field in `package.json` and use the built verison of the project.

API Documentation
---
Create an instance:

```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.mp4",
  parentId: "#player"
});
```

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.attachTo(element)

You can use this method to attach the player to a given `element`. You don't need to do this when you specify it during the player instantiation passing the `parentId` param.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.play()

Plays the current source.


### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.pause()

Pauses the current source.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.stop()
Stops the current source.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.seek(value)
The `value` should be a number between 0 and 100. For example, `player.seek(50)` will seek to the middle of the current source.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.isPlaying()
Returns `true` if the current source is playing, otherwise returns `false`.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.getPlugin(pluginName)
Returns the plugin instance. Example:
```javascript
var strings = player.getPlugin('strings');
```
This search the `Core` and `Container` plugins by name, and returns the first one found.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.getCurrentTime()
Returns the current time(in seconds) of the current source.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.getDuration()
Returns the duration(in seconds) of the current source.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.resize(size)
Resizes the current player canvas. The `size` parameter should be a literal object with `height` and `width`. Example:
```javascript
player.resize({height: 360, width: 640});
```

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.destroy()
Destroy the current player and removes it from the DOM.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.load(source)
Loads a new source.

Configuration
---
All parameters listed below shall be added on `Clappr.Player` object instantiation. Example:
```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.mp4",
  parameter1: "value1",
  parameter2: "value2",
});
```

### Player Configuration

#### parent
Used to specify where the player should be attached using the DOM element.

#### parentSelector
Used to specify where the player should be attached using a class of one DOM element.

#### source
Sets media source URL to play. You can set the media source accordingly to existing playbacks.

#### sources
Array of sources. Used to play next media source on array if the previous fail.

#### mimeType
Sets the media source format used on `source` option. Use if you need to use a media url without extension.

#### height
> Default Value: `360px`

Sets player height. You can set using px (`500px`) or percentage (`100%`).

#### width
> Default Value: `640px`

Sets player width. You can set using px (`500px`) or percentage (`100%`).

#### autoPlay
> Default Value: `false`

Configure Clappr to play media after the player is attached.

#### mute
> Default Value: `false`

Enable the [video tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) muted attribute.

<!-- #### disableCanAutoPlay
> Default Value: `false`

By default, Clappr will do its best to detect if the browser can play video automatically. If you want to disable this behaviour, you can set this option with the value `false`. -->

#### loop
> Default Value: `false`

Enable the [video tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) loop attribute.

#### language
> Default Value: `en-US`

Sets one of current laguanges supported on Clappr. You can check all supported languages on [Strings plugin](https://github.com/clappr/clappr-core/blob/master/src/plugins/strings.js#L35-93).

If you want to provide your translations, create a PR by editing the [Strings plugin](https://github.com/clappr/clappr-core/blob/master/src/plugins/strings.js).

#### playbackNotSupportedMessage
> Default Value: The `playback_not_supported` string on [Strings Plugin](https://github.com/clappr/clappr-core/blob/master/src/plugins/strings.js)

Define a custom message to be displayed when a playback is not supported.

#### useCodePrefix
> Default value: `true`

Clappr has pattern to create the `code` attribute on `error` object using the name of the component where an error occurs with the original error code.

Example: `hls:networkError_manifestLoadError (component_name:error_code)`

You can disable this pattern to just use the original error code setting this option with the value `false`.

#### autoSeekFromUrl
> Default value: `true`

By default if the URL contains a time then the media will seek to this point.

Example: `example.com?t=100` would start the media at 100 seconds.

You can disable this behavior setting this options with the value `false`.

#### plugins
Array used to pass external plugins instances to Clappr.

You can pass plugins of any category in this array. Example:

```html
// Playback
<script src='https://cdn.jsdelivr.net/npm/@clappr/hlsjs-playback@latest/dist/hlsjs-playback.min.js'></script>

// Container
<script src='https://cdn.jsdelivr.net/npm/@clappr/stats-plugin@latest/dist/clappr-stats.min.js'></script>
```

```javascript
{
  plugins: [ClapprStats, HlsjsPlayback]
}
```

#### events
Object to add callbacks on mapped events.

The current list of mapped events is:
```javascript
{
  events: {
    onReady: function() { ... }, //Fired when the player is ready on startup
    onResize: function() { ... },//Fired when player resizes
    onPlay: function() { ... },//Fired when player starts to play
    onPause: function() { ... },//Fired when player pauses
    onStop: function() { ... },//Fired when player stops
    onEnded: function() { ... },//Fired when player ends the video
    onSeek: function() { ... },//Fired when player seeks the video
    onError: function() { ... },//Fired when player receives an error
    onTimeUpdate: function() { ... },//Fired when the time is updated on player
    onVolumeUpdate: function() { ... },//Fired when player updates its volume
    onSubtitleAvailable: function() { ... },//Fired when subtitles is available
  }
}
```

If you want to listen for events from other layers, you need to add the bind for the specific scope.

For example, the `CONTAINER_STATE_BUFFERING` event is triggered by the `container`, so if you want to listen for events from the container layer on your code, here is how:

```javascript
player.core.activeContainer.on(Clappr.Events.CONTAINER_STATE_BUFFERING, function() { ... })
```

See all Clappr events [here](https://github.com/clappr/clappr-core/blob/master/src/base/events.js#L227).

<!-- parent -->
<!-- parentSelector -->
<!-- source -->
<!-- sources -->
<!-- height -->
<!-- width -->
<!-- autoPlay -->
<!-- mute -->
<!-- loop -->
<!-- language -->
<!-- mimeType -->
<!-- playbackNotSupportedMessage -->
<!-- useCodePrefix -->
<!-- autoSeekFromUrl -->
<!-- baseUrl -->
<!-- plugins -->
<!-- events -->

<!-- disableCanAutoPlay //deprecated
autoPlayTimeout // deprecated
useVideoTagDefaultControls // deprecated
persistConfig //deprecated
disableVideoTagcontextMenu //deprecated
preload // deprecated
maxBufferLength // deprecated
maxBufferLength // deprecated

chromeless // plugins options

allowUserInteraction // click to pause plugin

mediacontrol // media control
hideMediaControl // media control
hideVolumeBar // media control
disableKeyboardShortcuts // media control
exitFullscreenOnEnd // media control
actualLiveTime // media control
actualLiveServerTime // media control

poster // poster plugin

gaAccount // ga plugin
gaAccount // ga plugin
gaTrackerName // ga plugin

watermark // watermark plugin
watermarkLink // watermark plugin

disableErrorScreen // error screen plugin -->

### Playback Configuration
Clappr has specific set of options for playbacks. The configuration for the playback, it's still only compatible with `html5_video` playback (and derived).

Above, the description of each one:

```javascript
playback: {
  preload: 'metadata',
  disableContextMenu: false,
  controls: true,
  crossOrigin: 'use-credentials',
  playInline: true,
  externalTracks: [],
  hlsjsConfig: {},
  shakaConfiguration: {}, // Needs to pass this object to playback object scope
  // audioOnly: false, //  not document yet
  // maxBufferLength: , // NOT EXIST
  // maxBackBufferLength: , // NOT EXIST
  // minBufferLength: ,  // NOT EXIST
  // initialBandwidthEstimate: , // NOT EXIST
  // maxAdaptiveBitrate: , // NOT EXIST
  // maxAdaptiveVideoDimensions: , // NOT EXIST
  // enableAutomaticABR: , // NOT EXIST
  // preferredTextLanguage: 'pt-BR', // shaka playback option
  // preferredAudioLanguage: 'pt-BR', // shaka playback option
}
```

#### preload
> Default value: `metadata`

In case you're loading a on demand video (`mp4`), it's possible to define the way the video will be preloaded according to preload attribute options.

See more about video tag preload attribute [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video).

#### disableContextMenu
> Default value: `false`

disable possibility to active context menu.

#### controls
> Default value: `true`

Use to enable or disable the [video tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) controls property.

#### crossOrigin
> Default value: `use-credentials`

Use to set one of possible values supported on video tag.

See more about video tag crossOrigin attribute [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video).

#### playInline
> Default value: `true`

Enable or Disable the [video tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) playInline attribute.

#### externalTracks
Array of tracks. Each track must have the attributes `src`, `lang` and `label`. The attribute `kind` on track object is optional because of the default value `subtitles`.

See more about tracks on video tag element [here](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video).


#### hlsjsConfig
Any specific settings for [hls.js](https://github.com/video-dev/hls.js/blob/master/docs/API.md) should be in this option.

```javascript
{
  playback: {
    hlsjsConfig: {
      // hls.js specific options
    }
  }
}
```

#### shakaConfiguration
Any specific settings for [shaka-player](https://shaka-player-demo.appspot.com/docs/api/tutorial-config.html) should be in this option.

```javascript
{
  playback: {
    shakaConfiguration: {
      // shaka-player specific options
    }
  }
}
```

Development
---
Enter the project directory and install the dependencies:

`yarn install`

Make your changes and run the tests:

`yarn test`

Build your own version:

`yarn build`

Check the result on `dist/` folder.

Starting a local server:

`yarn start`

This command will start a HTTP Server on port 8080, you can check a sample page with Clappr on http://localhost:8080/

Contributors
---
This project exists thanks to all the people who [contribute](https://github.com/clappr/clappr-core/graphs/contributors).

Sponsor
---
[![image](https://cloud.githubusercontent.com/assets/244265/5900100/ef156258-a54b-11e4-9862-7e5851ed9b81.png)](http://globo.com)
