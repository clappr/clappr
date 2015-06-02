[![Build Status](https://travis-ci.org/clappr/clappr.svg?branch=master)](https://travis-ci.org/clappr/clappr)
[![Dependency Status](https://gemnasium.com/clappr/clappr.svg)](https://gemnasium.com/clappr/clappr)
[![Coverage Status](https://coveralls.io/repos/clappr/clappr/badge.svg?branch=master)](https://coveralls.io/r/clappr/clappr?branch=master)
<div align=center>
<img src="https://cloud.githubusercontent.com/assets/244265/6373134/a845eb50-bce7-11e4-80f2-592ba29972ab.png"><br><br>
<img src="https://i.cloudup.com/GSbXxvCsBK.png">
</div>

### Using the Player

[![Join the chat at https://gitter.im/clappr/clappr](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/clappr/clappr?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Add the following script on your HTML:
```html
<head>
  <script type="text/javascript" src="http://cdn.clappr.io/latest/clappr.min.js"></script>
</head>
```
Now, create the player:
```html
<body>
  <div id="player"></div>
  <script>
    var player = new Clappr.Player({source: "http://your.video/here.mp4", parentId: "#player"});
  </script>
</body>
```

## Supported Formats

Format       |HLS|MP4|MP3|WEBM| DASH | RTMP | JPG/PNG/GIF |
-------------|---|---|---|----|------|------|-------------|
IE10         | ✔ | ✔ | ✔ |  ✘ | ✘ | ![rtmp](http://flv.io/external3.png) | ✔
IE11         | ✔ | ✔ | ✔ |  ✘ | ✘ | ![rtmp](http://flv.io/external3.png) | ✔
Firefox      | ✔ | ✔ | ✔ |  ✔ | ✘ | ![rtmp](http://flv.io/external3.png) | ✔
Chrome       | ✔ | ✔ | ✔ |  ✔ | ![dash](http://flv.io/external3.png) | ![rtmp](http://flv.io/external3.png) | ✔
Safari       | ✔ | ✔ | ✔ |  ✘ | ✘ | ![rtmp](http://flv.io/external3.png) | ✔
iPhone       | ✔ | ✔ | ✔ |  ✘ | ✘ | ✘ | ✔
iPad         | ✔ | ✔ | ✔ |  ✘ | ✘ | ✘ | ✔
Android      | ✔ | ✔ | ✔ |  ✘ | ✘ | ✘ | ✔
WiiU Browser | ✔ | ✔ | ✘ |  ? | ✘ | ✘ | ✔
PS4 Browser  | ✔ | ✔ | ✘ |  ? | ✘ | ✘ | ✔

![rtmp](http://flv.io/external3.png) means that the support is made by an external plugin.

## External Plugins

- RTMP: https://github.com/flavioribeiro/clappr-rtmp-plugin
- DASH: https://github.com/shankardevy/clappr-dash-plugin
- HLS+P2P: http://bem.tv
- Comments on seekbar: http://labs.jordane.net/clappr-comment/
- Level Selector: https://github.com/lucasmundim/clappr-level-selector-plugin
- Control the player with your voice: https://github.com/flavioribeiro/clappr-speech-control-plugin

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

##### Auto Play
Add `autoPlay: true` if you want the video to automatically play after page load.

##### Loop
Add `loop: true` if you want the video to automatically replay after it ends.

##### Chromeless
Add `chromeless: 'true'` if you want the player to act in chromeless mode.

##### Mute
Add `mute: true` if you want to start player with no sound.

##### Configuration persistance
Add `persistConfig: false` if you don't want to persist player's volume through your videos, by **default it saves**. These configuration are being saved at user's browser ([through localStorage](http://diveintohtml5.info/storage.html)).

##### Preload
In case you're loading a on demand video (mp4), it's possible to define the way the video will be preloaded according to [preload](http://www.stevesouders.com/blog/2013/04/12/html5-video-preload/) attribute options. Add `preload: <type>` on embed parameters. By default, Clappr will try to download only video metadata (`preload: 'metadata'`).

##### HLS Buffer Length
The default behavior for the HLS playback is to keep buffering indefinitely, even on VoD. This replicates the behavior for progressive download, which continues buffering when pausing the video, thus making the video available for playback even on slow networks. To change this behavior, add `maxBufferLength: <value>` to embed parameters, where `value` is in seconds.

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

##### Media Control Auto Hide

If you want to disable media control auto hide, add `hideMediaControl: false` in your embed parameters.

##### Hide Volume Bar

When embedded with width less than 320, volume bars are hidden. You can force this behavior for all sizes by adding `hideVolumeBar: true`.

##### Watermark
Put `watermark: http://url/img.png` on your embed parameters to automatically add watermark on your video. Choose corner position by defining position parameter. Positions can be `bottom-left`, `bottom-right`, `top-left` and `top-right`. Example:

```javascript
  var player = new Clappr.Player({
    source: "http://your.video/here.mp4",
    watermark: "http://url/img.png", position: 'top-right'
  });
```

##### Poster
Define a poster by adding `poster: http://url/img.png` on your embed parameters. It will appear after video embed, disappear on play and go back when user stops the video.

##### Stats
Clappr has a native statistics plugin that accounts QoE metrics such playing time, rebuffering time, total rebuffers, etc. Metrics report happens periodically, learn how to access these numbers on [Create your own plugin](https://github.com/globocom/generator-clappr-plugin) session.


### Status

Clappr is under heavy development but production-ready. Feel free to open issues and send us pull requests.

### Installing for development

Clone the project and install gulp:

`npm install -g gulp`

Then enter the project directory and install the dependencies:

`npm install`

Make your changes and run the tests:

`npm test`

Build your own version:

`gulp build`

Check the result on `dist/` folder.

### Contributors

The culprits of this project are listed [here](https://github.com/globocom/clappr/graphs/contributors).

### Contributing

In general, we follow the fork-and-pull git workflow:

1. Fork the repository on GitHub
2. Commit changes to a branch in your fork
3. Pull request "upstream" with your changes
4. Merge changes in to "upstream" repository

:warning: Be sure to merge the latest from "upstream" before making a pull request.

### Sponsor

[![image](https://cloud.githubusercontent.com/assets/244265/5900100/ef156258-a54b-11e4-9862-7e5851ed9b81.png)](http://globo.com)
