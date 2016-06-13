## Built-in Plugins & Embed Parameters

All parameters listed below shall be added on `Clappr.Player` object instantiation. Example:
```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.mp4",
  parameter1: "value1",
  parameter2: "value2",
});
```

##### Player Size
You can set the player size setting `width` and `height` parameters.

##### Player Location
You can specify where the player should be attached to using either the `parentId`, or `parent` option. `parentId` should be the id of the element you would like the player to be inserted into, or `parent` should be set to a reference to a dom element.

##### Auto Play
Add `autoPlay: true` if you want the video to automatically play after page load.

##### Loop
Add `loop: true` if you want the video to automatically replay after it ends.

##### Chromeless
Add `chromeless: true` if you want the player to act in chromeless mode.

##### Allow user interaction (in chromeless mode)
Add `allowUserInteraction: true` if you want the player to handle clicks/taps when in chromeless mode. By default it's set to `false` on desktop browsers, and `true` on mobile browsers (due to playback start only being allowed when started through user interaction).

##### Disable keyboard shortcuts.
Add `disableKeyboardShortcuts: true` if you want to disable keyboard control of the player. This is forced to `true` when `allowUserInteraction` is `false`.

##### Mute
Add `mute: true` if you want to start player with no sound.

##### Add mimeType for extension-less url
Add `mimeType: "mimetype-for-media"` if you need to use a media url without extension.

##### Actual live time
Add `actualLiveTime: true` if you want the time in the seek bar to be according to actual time.
Add `actualLiveServerTime: "2015/11/26 06:01:03"` if you want the time in the seek bar to match with a specified time.

##### Configuration persistance
Add `persistConfig: false` if you don't want to persist player's volume through your videos, by **default it saves**. These configuration are being saved at user's browser ([through localStorage](http://diveintohtml5.info/storage.html)).

##### Playback not supported custom message
Add `playbackNotSupportedMessage: 'Please try on a different browser'` to define a custom message to be displayed when a playback is not supported.

##### Preload
In case you're loading a on demand video (mp4), it's possible to define the way the video will be preloaded according to [preload](http://www.stevesouders.com/blog/2013/04/12/html5-video-preload/) attribute options. Add `preload: <type>` on embed parameters. By default, Clappr will try to download only video metadata (`preload: 'metadata'`).

##### HLS Buffer Length
The default behavior for the HLS playback is to keep buffering indefinitely, even on VoD. This replicates the behavior for progressive download, which continues buffering when pausing the video, thus making the video available for playback even on slow networks. To change this behavior, add `maxBufferLength: <value>` to embed parameters, where `value` is in seconds.

##### Playback configuration
The configuration for the playback, it's still only compatible with `html5_video` playback.

```javascript
{
  playbackConfig: {
    preload: 'metadata',
    controls: true,
    crossOrigin: 'use-credentials'
  }
}
```

##### Google Analytics Plugin
Enable Google Analytics events dispatch (play/pause/stop/buffering/etc) adding your `gaAccount`. Optionally, pass your favorite trackerName as `gaTrackerName`. Example:

```javascript
  var player = new Clappr.Player({
  	source: "http://your.video/here.mp4",
	gaAccount: 'UA-44332211-1',
	gaTrackerName: 'MyPlayerInstance'
  });
```

##### Control bar colors
Customize control bar colors adding `mediacontrol` hash. Example:

```javascript
  var player = new Clappr.Player({
    source: "http://your.video/here.mp4",
    mediacontrol: {seekbar: "#E113D3", buttons: "#66B2FF"}
  });
```
Result:

![Clappr with modified media control colors](https://s3.amazonaws.com/cdn.clappr.io/screenshot.png)

I'm sure you can do better than me.

For advanced configuration, you can create an entire `MediaControl` object. At its most basic,
you might consider subclassing the base `MediaControl` and using your own custom HTML and CSS.

```javascript
  // ES6-style code shown
  class MyMediaControl extends Clappr.MediaControl {
    get template() {
      return Clappr.template(
        `<div>My HTML here based on clappr/src/components/media_control/public/media-control.html</div>`
      )
    }
    get stylesheet () {
      return Clappr.Styler.getStyleFor(
        `.my-css-class { /* based on clappr/src/components/media_control/public/media-control.scss */ }`
      )
    }
    constructor(options) {
        super(options);
    }
  }
  let player = new Clappr.Player({
    source: "http://your.video/here.mp4",
    mediacontrol: MyMediaControl
  });
```

##### Media Control Auto Hide

If you want to disable media control auto hide, add `hideMediaControl: false` in your embed parameters.

##### Hide Volume Bar

When embedded with width less than 320, volume bars are hidden. You can force this behavior for all sizes by adding `hideVolumeBar: true`.

##### Watermark
Put `watermark: http://url/img.png` on your embed parameters to automatically add watermark on your video. Choose corner position by defining position parameter. Positions can be `bottom-left`, `bottom-right`, `top-left` and `top-right`. To define an URL to open when the watermark is clicked, use watermarkLink parameter. If the watermarkLink parameter not defined, the watermark will not be clickable. Example:

```javascript
  var player = new Clappr.Player({
    source: "http://your.video/here.mp4",
    watermark: "http://url/img.png", position: 'top-right',
    watermarkLink: "http://example.net/"
  });
```

##### Poster
Define a poster image by adding `poster: 'http://url/img.png'` on your player options. It will appear after video embed, disappear on play and go back when user stops the video. For audio broadcasts, the poster stays up while playing.

##### Audio Only Hint
Some audio-only sources (e.g. HLS) cannot be easily detected as such; for that you can add `audioOnly: true` to the options so clappr knows to treat the source as such.

##### Stats
Clappr has a native statistics plugin that accounts QoE metrics such playing time, rebuffering time, total rebuffers, etc. Metrics report happens periodically, learn how to access these numbers on [Create your own plugin](https://github.com/globocom/generator-clappr-plugin) session.

##### Automatically Seek To Point Specified in URL
By default if the URL contains a time then the media will seek to this point. E.g. example.com?t=100 would start the media at 100 seconds in.
To disable this add `autoSeekFromUrl: false`.

##### Disable HTML5 Video Context Menu
Add `disableVideoTagContextMenu: true` to disable the context menu (right click) on the HTML5 video element (in the case where a HTML5 playback is used).

##### Disable Exiting Full Screen When Media Ends
By default the player will automatically exit full screen when the media ends. To disable this add `exitFullscreenOnEnd: false` on your player options.
