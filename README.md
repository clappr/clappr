<h1>
Clappr-core
</h1>

Clappr-core is part of Clappr player that contains the main architecture of the Clappr project.

Clappr is under development but production-ready. Feel free to open issues and send us pull requests.

<p>
  <a href="https://badge.fury.io/js/%40clappr%2Fcore"><img src="https://badge.fury.io/js/%40clappr%2Fcore.svg"></a>
  <a href="https://bundlephobia.com/result?p=@clappr/core@latest"><img src="https://img.shields.io/bundlephobia/min/@clappr/core"></a>
  <a href="https://coveralls.io/github/clappr/clappr-core?branch=master"><img src="https://coveralls.io/repos/github/clappr/clappr-core/badge.svg?branch=master"></a>
  <a href="https://github.com/clappr/clappr-core/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-BSD--3--Clause-blue.svg"></a>
</p>

:video_camera: Demo
---
[Live demo](http://clappr.io/demo/) to test with support for external plugins.

:triangular_flag_on_post: Table of Contents
-----
* [Demo](https://github.com/clappr/clappr-core#video_camera-demo)
* [Table of Contents](https://github.com/clappr/clappr-core#triangular_flag_on_post-table-of-contents)
* [Features](https://github.com/clappr/clappr-core#gem-features)
* [Usage](https://github.com/clappr/clappr-core#clapper-Usage)
* [API Documentation](https://github.com/clappr/clappr-core#books-api-documentation)
* [Configuration](https://github.com/clappr/clappr-core#hammer_and_wrench-configuration)
* [Development](https://github.com/clappr/clappr-core#computer-development)
* [Contributors](https://github.com/clappr/clappr-core#raised_hands-contributors)
* [Sponsor](https://github.com/clappr/clappr-core#money_with_wings-sponsor)

:gem: Features
---
* Uses the [HTM5 video tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
  * Makes it easy to use while maintaining high platform support.
* Plugin architecture
  * Add new features without impacting other functions.
* Extensible
  * Add support for other video formats or modify already existing plugins.

:clapper: Usage
---
### Via script tag:

Add the following script in your HTML `<head>`:
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@clappr/core@latest/dist/clappr-core.min.js"></script>
```

Now, create the player by adding the following to your `<body>`:
```html
<div class="player"></div>
<script>
	var playerElement = document.querySelector(".player");
	var player = new Clappr.Player({
		source: "http://your.video/here.mp4",
		parent: playerElement,
	});
</script>
```

### Via npm module:

This project is available on npm at https://www.npmjs.com/package/@clappr/core

`yarn install @clappr/core --save-dev`

You should specify the base URL for where the assets are located using the `baseUrl` option:
```javascript
  var player = new Clappr.Player({
  	source: "http://your.video/here.mp4",
	  baseUrl: "http://example.com/assets/clappr"
  });
```
In the above case, Clappr will expect all of the [assets (in the dist folder)](https://github.com/clappr/clappr-core/tree/master/dist) to be accessible at "http://example.com/assets/clappr-core".
You need to arrange the assets to be located at `baseUrl` during your build process.

#### Installing for [webpack](https://webpack.github.io/):
By default, webpack will look at the `main` field in `package.json` and use the built version of the project. If this is all you want, there is nothing else for you to do.

If you would like to build Clappr yourself into your project during your build process then add the following to your webpack config:
```javascript
resolve: {
    alias: { Clappr: '@clappr/core/src/main.js' },
    root: [path.resolve(__dirname, 'node_modules/@clappr/core/src')],
    extensions: ['', '.js'],
}
```

#### Installing for [browserify](http://browserify.org/):
Browserify will look at the `main` field in `package.json` and use the built version of the project.

:books: API Documentation
---
Create an instance:

```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.mp4",
  parentId: "#player"
});
```

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.attachTo(element)
You can use this method to attach the player to a given element. You don't need to do this when specifying it during the player instantiation passing the `parentId` param.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.play()

Plays the current source.


### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.pause()

Pauses the current source.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.stop()
Stops the current source.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.mute()
Mutes the current source.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.unmute()
Unmutes the current source.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.seek(value)
Seeks the current video (`source`). For example, `player.seek(120)` will seek to second 120 (2 minutes) of the current video.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.seekPercentage(value)
Seeks the current video (`source`). For example, `player.seek(50)` will seek to the middle of the current video.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.isPlaying()
Returns `true` if the current source is playing, otherwise returns `false`.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.getPlugin(pluginName)
Returns the plugin instance. Example:
```javascript
var strings = player.getPlugin('strings');
```
This method searches the `Core` and `Container` plugins by name and returns the first one found.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.getCurrentTime()
Returns the current time (in seconds) of the current source.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.getDuration()
Returns the duration (in seconds) of the current source.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.resize(size)
Resizes the current player canvas. The `size` parameter should be a literal object with `height` and `width`. Example:
```javascript
player.resize({height: 360, width: 640});
```

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.destroy()
Destroy the current player and removes it from the DOM.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.load(source)
Loads a new source.

### <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.configure(options)
Enables to configure a player after its creation.

:hammer_and_wrench: Configuration
---
All parameters listed below shall be added on `Clappr.Player` object instantiation or  via `player.configure`.

Example:
```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.mp4",
  parameter1: "value1",
  parameter2: "value2",
});

// or

player.configure({
  parameter3: "value3",
  parameter4: "value4",
})
```

Note that some options passed via `configure` as not applied instantly. In this case, these options are applied in the next video.

### Player Configuration

#### parent
Used to specify where the player should be attached using the DOM element.

#### parentId
Used to specify where the player should be attached using a id of one DOM element.

<!-- add this on the version 0.0.5 -->
<!-- #### parentSelector
Used to specify where the player should be attached using a class of one DOM element. -->

#### source
Sets media source URL to play. You can set the media source accordingly to existing playbacks.

#### sources
An array of sources. Used to play the next media source on array if the previous one was invalid.

#### mimeType
Sets the media source format used on the `source` option. Use if you need to use a media URL without extension.

#### events
Object to add callbacks on mapped events. The current list of mapped events is:

```javascript
{
  events: {
    onReady: function() { ... },//Fired when the player is ready on startup
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

If you want to listen for events from other layers, **you need to add the bind for the specific scope**.

For example, the `CONTAINER_STATE_BUFFERING` event is triggered by the `container`, so if you want to listen for events from the container layer on your code, you can bind events like the example below:

```javascript
player.core.activeContainer.on(Clappr.Events.CONTAINER_STATE_BUFFERING, function() { ... })
```

See all existing events on Clappr [here](https://github.com/clappr/clappr-core/blob/master/src/base/events/events.js#L227).

#### plugins
An object used to config external plugins instances and plugins behaviors to Clappr.

```javascript
{
  plugins: {
    core: [CorePlugin],
    container: [ContainerPlugin],
    playback: [Playbacks],
    loadExternalPluginsFirst: true,
    loadExternalPlaybacksFirst: true,
  }
}
```

Example of external plugins config:

```html
// Playback
<script src='https://cdn.jsdelivr.net/npm/@clappr/hlsjs-playback@latest/dist/hlsjs-playback.min.js'></script>

// Container
<script src='https://cdn.jsdelivr.net/npm/@clappr/stats-plugin@latest/dist/clappr-stats.min.js'></script>
```

```javascript
{
  plugins: {
    container: [ClapprStats],
    playback: [HlsjsPlayback],
  }
}
```

You can pass plugins of any category in on flat array too. Example:

```javascript
{
  plugins: [ClapprStats, HlsjsPlayback]
}
```

#### plugins.loadExternalPluginsFirst
> Default Value: `true`

Force external plugins to be loaded before default Clappr plugins.

#### plugins.loadExternalPlaybacksFirst
> Default Value: `true`

Force external playbacks to be loaded before default Clappr playbacks.

#### height
> Default Value: `360px`

Sets player height. You can set using px (`500px`) or percentage (`100%`).

#### width
> Default Value: `640px`

Sets player width. You can set using px (`500px`) or percentage (`100%`).

#### autoPlay
> Default Value: `false`

Configure Clappr to play media after the player is ready to play.

#### mute
> Default Value: `false`

Set volume to zero enabling the [video tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) muted attribute.

#### loop
> Default Value: `false`

Restart video after the video ends enabling the [video tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) loop attribute.


#### language
> Default Value: `en-US`

Sets one of the current languages supported on Clappr. You can check all supported languages on the [Strings plugin](https://github.com/clappr/clappr-core/blob/master/src/plugins/strings/strings.js#L35-93).

If you want to provide your translations, create a PR by editing the [Strings plugin](https://github.com/clappr/clappr-core/blob/master/src/plugins/strings/strings.js).

#### playbackNotSupportedMessage
> Default Value: The `playback_not_supported` string on [Strings Plugin](https://github.com/clappr/clappr-core/blob/master/src/plugins/strings/strings.js)

Define a custom message to be displayed when playback is not supported.

#### useCodePrefix
> Default value: `true`

Clappr has a pattern to create the `code` attribute on the `error` object using the name of the component where an error occurs with the original error code.

Example: `hls:networkError_manifestLoadError (component_name:error_code)`

You can disable this pattern. Just use the original error code setting this option with the value `false`.

#### autoSeekFromUrl
> Default value: `true`

By default, if the URL contains a time then the media will seek to this point.

Example: `example.com?t=100` would start the media at 100 seconds.

You can disable this behaviour setting this option with the value `false`.

#### includeResetStyle
> Default value: `true`

By default, Clappr reset a bunch of styles that may impact your own style. With this option, it's possible to enable/disable  the use of [_resets.scss](https://github.com/clappr/clappr-core/blob/master/src/base/scss/_reset.scss).

### Playback Configuration
Clappr has a specific set of options for playbacks. The configuration for the playback, it's still only compatible with `html5_video` playback (and derived playbacks).

Below, the description of each one:

```javascript
playback: {
  preload: 'metadata',
  disableContextMenu: false,
  controls: true,
  crossOrigin: 'use-credentials',
  playInline: true,
  minimumDvrSize: null,
  externalTracks: [],
  hlsjsConfig: {},
  shakaConfiguration: {},
}
```

#### preload
> Default value: `metadata`

In case you're loading an on-demand video (`mp4`), it's possible to define the way the video will be preloaded according to preload attribute options.

See more about the video tag preload attribute [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video).

#### disableContextMenu
> Default value: `false`

Disable possibility to activate the context menu.

#### controls
> Default value: `true`

Use to enable or disable the [HTML5 video tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) controls.

#### crossOrigin
> Default value: `use-credentials`

Use to set one of the possible values supported on the HTML5 video tag.

See more about the video tag crossOrigin attribute [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video).

#### playInline
> Default value: `true`

Enable or Disable the [HTML5 video tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) playInline attribute.

#### minimumDvrSize
Use to set the minimum value to active DVR for live media. This option is only used for HTML5Playback at this moment.

#### externalTracks
An array of tracks. Each track must have the attributes `src`, `lang` and `label`. The attribute `kind` on track object is optional because of the default value `subtitles`.

See more about tracks on the video tag element [here](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video).


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

:computer: Development
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

This command will start an HTTP Server on port 8080, you can check a sample page with Clappr on http://localhost:8080/

:raised_hands: Contributors
---
This project exists thanks to all the people who [contribute](https://github.com/clappr/clappr-core/graphs/contributors).

:money_with_wings: Sponsor
---
[![image](https://cloud.githubusercontent.com/assets/244265/5900100/ef156258-a54b-11e4-9862-7e5851ed9b81.png)](http://globo.com)
