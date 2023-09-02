<h2 align=center><b>Huge changes in the latest version. See <a href=https://github.com/clappr/clappr/releases/tag/0.4.0>0.4.0 version changelog</a> for more information</b></h2>

<p align=center>
  <a href="https://badge.fury.io/js/%40clappr%2Fplayer"><img src="https://badge.fury.io/js/%40clappr%2Fplayer.svg"></a>
  <a href="https://bundlephobia.com/result?p=@clappr/player@latest"><img src="https://img.shields.io/bundlephobia/min/@clappr/player"></a>
  <a href="https://app.travis-ci.com/github/clappr/clappr"><img src="https://travis-ci.com/clappr/clappr.svg?branch=dev"></a>
  <a href="https://github.com/clappr/clappr/blob/dev/LICENSE"><img src="https://img.shields.io/badge/license-BSD--3--Clause-blue.svg"></a>
  <a href="https://www.jsdelivr.com/package/npm/@clappr/player"><img alt="jsDelivr hits (npm scoped)" src="https://img.shields.io/jsdelivr/npm/hm/@clappr/player?color=orange"></a>
</p>
<br>

# <div align=center><a href="http://clappr.io"><img src="https://cloud.githubusercontent.com/assets/244265/6373134/a845eb50-bce7-11e4-80f2-592ba29972ab.png" height=100px></a></div>

Clappr is an extensible media player for the web. Your architecture is projected primarily into plugins, adding low accoupling by design to the project and the possibility to add infinitely features easily.

Clappr uses [HTMLVideoElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement) by default, which guarantees support to many platforms. You have the possibility to extend the default HTML5 playback or the playback interface to create a new media support, just like a plugin!

Clappr is a composition of two other projects: [@clappr/core](https://github.com/clappr/clappr-core) and [@clappr/plugins](https://github.com/clappr/clappr-plugins).

The `@clappr/core` contains the basic functionalities from Clappr (plugin architecture, class abstractions, public interfaces, events handlers and etc) and the `@clappr/plugins` are the repository where the plugins maintained by the Clappr team lives. More info about those projects into your repositories.

All Clappr projects are written in `*.js` using the latest features of [ECMAScript](http://www.ecma-international.org/ecma-262/).

Clappr is under development but production-ready. Feel free to open issues and send pull requests.

:triangular_flag_on_post: Table of Contents
-----
* [Features](https://github.com/clappr/clappr#)
* [Table of Contents](https://github.com/clappr/clappr#triangular_flag_on_post-table-of-contents)
* [Usage](https://github.com/clappr/clappr#clapper-Usage)
* [Demo](https://github.com/clappr/clappr#video_camera-demo)
* [API Documentation](https://github.com/clappr/clappr#books-api-documentation)
* [Configuration](https://github.com/clappr/clappr#hammer_and_wrench-configuration)
* [Built-in Plugins](https://github.com/clappr/clappr#electric_plug-built-in-plugins)
* [Third party plugins/integrations](https://github.com/clappr/clappr#handshake-third-party-pluginsintegrations)
* [Supported Formats](https://github.com/clappr/clappr#film_strip-supported-formats)
* [About Autoplay](https://github.com/clappr/clappr#play_or_pause_button-about-autoplay)
* [FAQ & Troubleshooting](https://github.com/clappr/clappr#interrobang-faq--troubleshooting)
* [Companies using Clappr](https://github.com/clappr/clappr#rocket-companies-using-clappr)
* [Contributors](https://github.com/clappr/clappr#raised_hands-contributors)
* [Sponsor](https://github.com/clappr/clappr#star2-sponsor)

:clapper: Usage
---
### Via script tag:

Add the following script on your HTML:
```html
<head>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@clappr/player@latest/dist/clappr.min.js"></script>
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

:video_camera: Demo
---
[Live demo](http://clappr.io/demo/) to test, with a possibility to add external plugins.

:books: API Documentation
---
You can check the current API doc via `@clappr/core` [here](https://github.com/clappr/clappr-core#books-api-documentation).

:hammer_and_wrench: Configuration
---
You can check the embed parameters supported by `@clappr/core` [here](https://github.com/clappr/clappr-core#hammer_and_wrench-configuration).

:electric_plug: Built-in Plugins
---
You can check the plugins used on Clappr player via `@clappr/plugins` [here](https://github.com/clappr/clappr-plugins#plugins-description).

:handshake: Third party plugins/integrations
---

#### External Plugins

|Plugin         |Status|Compatible with latest Clappr|URL|
|-----------------------|--------|-------------------------------|--------------------------------------------------------|
|Media Control | Ready | Yes | https://github.com/joaopaulovieira/clappr-media-control-plugin |
|Video Queue (Playlist) | Ready | Yes | https://github.com/joaopaulovieira/clappr-queue-plugin |
|Thumbnails on seekbar| Ready | Yes | https://github.com/tjenkinson/clappr-thumbnails-plugin |
|Markers       | Ready | Yes | https://github.com/tjenkinson/clappr-markers-plugin |
|Level Selector| Ready | Yes | https://github.com/clappr/clappr-level-selector-plugin |
|360 videos| Ready | Yes | https://github.com/thiagopnts/video-360 |
|Chromecast| Ready | Yes | https://github.com/clappr/clappr-chromecast-plugin |
|DASH with shaka| Ready | Yes | https://github.com/clappr/dash-shaka-playback |
|Playback Speed | Ready | Yes | https://github.com/bikegriffith/clappr-playback-rate-plugin |
|Clappr Stats | Ready | Yes | https://github.com/leandromoreira/clappr-stats |
|Clappr Nerd Stats | Ready | Yes | https://github.com/lucasrodcosta/clappr-nerd-stats |
|Pause while far| Ready | Yes | https://github.com/leandromoreira/clappr-pause-tab-visibility |
|RTMP           | Ready | Yes | https://github.com/clappr/clappr-rtmp-plugin |
|Picture-in-Picture | Ready | Yes | https://github.com/tjenkinson/clappr-pip-plugin |
|Hybrid P2P & CDN| Ready | Yes | https://support.streamroot.io/hc/en-us/articles/360000913654-Clappr |
|Comments on seekbar| Ready | ? | https://github.com/Metrakit/clappr-comment-plugin |
|Voice control| Ready | ? | https://github.com/flavioribeiro/clappr-speech-control-plugin |
|Dash           | WIP | No | https://github.com/shankardevy/clappr-dash-plugin | |
|Youtube        | Ready | No | https://github.com/towerz/clappr-youtube-playback |
|Googel IMA Pre Roll| Ready | Yes | https://github.com/kslimani/clappr-google-ima-html5-preroll |
|VAST Ad plugin | WIP | No | https://github.com/vix-simplex/clappr-ad-plugin |
|Dynamic Overlay | Ready | Yes | https://github.com/Lethea/clappr-dynamic-text-overlay |
|Scroll Text Overlay | Ready | Yes | https://github.com/Lethea/clappr-marquee-overlay |
|Playback Speed Controller | Ready | Yes | https://github.com/Lethea/clapper-playback-speed-plugin-extended |
|FLV | Ready | Yes | https://github.com/andrefilimono/clappr-flvjs-playback |
|Context Menu | Ready | Yes | https://github.com/joaopaulovieira/clappr-context-menu-plugin |

#### External Integrations

|Integration         |Status|Compatible with latest Clappr|URL|
|-----------------------|--------|-------------------------------|--------------------------------------------------------|
|P2P Media Loader| Ready | Yes | https://github.com/Novage/p2p-media-loader |


:film_strip: Supported Formats
---

Format         |HLS|MP4|MP3|WEBM| DASH | RTMP | JPG/PNG/GIF | FLV |
---------------|---|---|---|----|------|------|-------------|-----|
IE10           | ✔ | ✔ | ✔ |  ✘ | ✘ | ![rtmp](http://flv.io/external3.png) | ✔ | ✘
IE11           | ✔ | ✔ | ✔ |  ✘ | ![rtmp](http://flv.io/external3.png) | ![rtmp](http://flv.io/external3.png) | ✔ | ![rtmp](http://flv.io/external3.png)
Microsoft Edge | ✔ | ✔ | ? |  ? | ![rtmp](http://flv.io/external3.png) | ![rtmp](http://flv.io/external3.png) | ? | ![rtmp](http://flv.io/external3.png)
Firefox        | ✔ | ✔ | ✔ |  ✔ | ![rtmp](http://flv.io/external3.png) | ![rtmp](http://flv.io/external3.png) | ![rtmp](http://flv.io/external3.png) | ![rtmp](http://flv.io/external3.png)
Chrome         | ✔ | ✔ | ✔ |  ✔ | ![rtmp](http://flv.io/external3.png) | ![rtmp](http://flv.io/external3.png) | ✔ | ![rtmp](http://flv.io/external3.png)
Safari         | ✔ | ✔ | ✔ |  ✘ | ![rtmp](http://flv.io/external3.png) | ![rtmp](http://flv.io/external3.png) | ![rtmp](http://flv.io/external3.png) | ![rtmp](http://flv.io/external3.png)
iPhone         | ✔ | ✔ | ✔ |  ✘ | ✘ | ✘ | ✔ | ✘
iPad           | ✔ | ✔ | ✔ |  ✘ | ✘ | ✘ | ✔ | ✘
Android        | ✔ | ✔ | ✔ |  ✘ | ![rtmp](http://flv.io/external3.png) | ![rtmp](http://flv.io/external3.png) | ✘ | ![rtmp](http://flv.io/external3.png)
WiiU Browser   | ✔ | ✔ | ✘ |  ? | ![rtmp](http://flv.io/external3.png) | ![rtmp](http://flv.io/external3.png) | ✘ | ?
PS4 Browser    | ✔ | ✔ | ✘ |  ? | ![rtmp](http://flv.io/external3.png) | ![rtmp](http://flv.io/external3.png) | ✘ | ?

![rtmp](http://flv.io/external3.png) means that the support is made by an external plugin.

:play_or_pause_button: About Autoplay
---
**Clappr has no control over `autoplay` Browser Policy.**

Therefore, we're not able to execute play and unmute actions sequentially in every situation. There are a series of scenarios where the Browser blocks these actions based on it’s own policy.

Each browser has their own different restrictions, and the usual behavior is to activate the sound only after a user interacts with the player.

For more info about the auto play video policy, you can read these docs:

- [Chrome Autoplay Policy](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes)
- [WebKit Autoplay Policy](https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/)

:interrobang: FAQ & Troubleshooting
---
### How to write a plugin?
See the [wiki](https://github.com/clappr/clappr/wiki) for more info.

### How can I disable or override a plugin?
Let's say you want to disable or override a plugin.

#### Disable a plugin
```javascript
// let's disable the loading animation (the 'spinner' plugin)
var player = new Clappr.Player({ ... });
// after attach
player.getPlugin('spinner').disable();
```

#### Override a plugin
```javascript
// let's disable the loading animation (the 'spinner' plugin)
export default class NoSpinner extends UIContainerPlugin {
  get name() { return 'spinner' }
}
new Clappr.Player({ plugins: [NoSpinner]})
```

### How can I use clappr with ReactJS?
https://medium.com/@bikegriffith/using-clappr-with-reactjs-14a338e3451f#.9a36w0dpj

### How can I use clappr with ionic/angular?
https://github.com/clappr/clappr/issues/933#issuecomment-228540381

### How can I use clappr with Vue.js?
https://github.com/vinayakkulkarni/v-clappr

### How can I Log messages with Clappr?
Add this snippet before you instantiate the player `Clappr.Log.setLevel(0)`

### Common steps to verify issues
Very often people open issues related to stream **not working, freezing, glitching, stopping, and so on**. You can try these steps below, taking notes about the results:

* try to run the same example at [CDN](http://cdn.clappr.io)
* check the [cors headers at your servers](https://github.com/clappr/clappr/issues/703)
* try to run it on [hls.js demo page](https://video-dev.github.io/hls.js/demo/)
* try to run it on [flashls. demo page](http://www.flashls.org/latest/examples/chromeless/)
* try to run on your page the following source: `http://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8`
* try different browsers/OS's to see if the problems remain
* try to use a tool to check the health of your stream (both input, ie: RTMP, and segmentation, ie: DASH or HLS): like [`mediainfo`](https://mediaarea.net/MediaInfo) (for instance you could: ` mediainfo http://www.example.com/my.m3u8`, Apple's [`mediastreamvalidator`](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/StreamingMediaGuide/UsingHTTPLiveStreaming/UsingHTTPLiveStreaming.html) too, [`hls-analyzer`](https://github.com/epiclabs-io/hls-analyzer) and etc.

```bash
//HLS-Analyzer usage example

pip install m3u8
git clone https://github.com/epiclabs-io/hls-analyzer.git
cd hls-analyzer
python hls-analyzer.py http://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8
```

### How to handle player fatal errors?
Player fatal errors can be handled using `onError` [API event](https://github.com/clappr/clappr-core#events).

```javascript
var player = new Clappr.Player({
  parent: '#myplayer',
  source: 'http://path.to/my/video.mp4',
  events: {
    onError: function(e) {
      // Here the code to handle the error
    }
  }
});
```

Note: the type of error event object depends on the type of playback component resolved to play the video.

#### Example
This is a simple example using the `no_op` playback to display error messages.

You can try the following Javascript code on [Clappr demo page](http://clappr.io/demo/):

```javascript
var playerElement = document.getElementById("player-wrapper");

var r = 3; // Retry attempts

var player = new Clappr.Player({
  // source: 'http://clappr.io/highline.mp4',
  source: 'http://clappr.io/bad_highline.mp4',
  disableErrorScreen: true, // Disable the internal error screen plugin
  height: 360,
  width: 640,
  events: {
    onError: function(e) {
      r--;
      var s = player.options.source;
      // Replace previous line by the following line to simulate successful recovery
      // var s = (r > 2) ? player.options.source : 'http://clappr.io/highline.mp4';
      var t = 10;
      var retry = function() {
        if (t === 0) {
          var o = player.options;
          o.source = s;
          player.configure(o);
          return;
        }
        Clappr.$('#retryCounter').text(t);
        t--;
        setTimeout(retry, 1000);
      };
      player.configure({
        autoPlay: true,
        source: 'playback.error',
        playbackNotSupportedMessage: 'Network fatal error.' + ((r > 0)
            ? ' Retrying in <span id="retryCounter"></span> seconds ...'
            : ' All retry attempts failed'),
      });
      if (r > 0) {
        retry();
      }
    }
  }
});

player.attachTo(playerElement);
```

#### Another example
This example uses a custom error container plugin to display error messages.

You can try the following Javascript code on [Clappr demo page](http://clappr.io/demo/):

```javascript
var playerElement = document.getElementById("player-wrapper");

var ErrorPlugin = Clappr.ContainerPlugin.extend({
  name: 'error_plugin',
  background: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAFoBAMAAAA1HFdiAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAG1BMVEX5+fn//wAA//8A/wD/AP//AAAAAP8XFxf///8H5gWfAAAAAWJLR0QIht6VegAAAAd0SU1FB98IBRIsAXmGk48AAAI5SURBVHja7dJBDYBADADBs4AFLGABC1iohbOPhv1BMvu+NLlp10odqTN1pe7Uk5pQ8wMIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECDA/wKWxzM71T7ZZrfltNnppgACBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAL8B+ALjSfYzPnmdzgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNS0wOC0wNVQxODo0NDowMSswMTowMCL95a4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTUtMDgtMDVUMTg6NDQ6MDErMDE6MDBToF0SAAAAAElFTkSuQmCC',
  bindEvents: function() { this.listenTo(this.container, Clappr.Events.CONTAINER_ERROR, this.onError) },
  hide: function() { this._err && this._err.remove() },
  show: function() {
    var $ = Clappr.$
    this.hide();
    var txt = (this.options.errorPlugin && this.options.errorPlugin.text) ? this.options.errorPlugin.text : 'A fatal error occured.';
    this._err = $('<div>')
      .css({
        'position': 'absolute',
        'z-index': '999',
        'width': '100%',
        'height': '100%',
        'background-image': 'url(' + this.background + ')',
        'background-size': 'contain',
        'background-repeat': 'no-repeat',
        'padding-top': '15%',
        'text-align': 'center',
        'font-weight': 'bold',
        'text-shadow': '1px 1px #fff',
      })
      .append($('<h2>')
        .text(txt)
        .css({
          'font-size': '200%',
        }))
      .append($('<p>').html('Retrying in <span class="retry-counter">10</span> seconds ...')
        .css({
          'font-size': '120%',
          'margin': '15px',
        }));
    this.container && this.container.$el.prepend(this._err);
  },
  onError: function(e) {
    if (!this.container) return;
    this.show();
    this.container.getPlugin('click_to_pause').disable();
    var tid, t = 10, retry = function() {
      clearTimeout(tid);
      if (t === 0) {
        this.container.getPlugin('click_to_pause').enable();
        if (this.options.errorPlugin && this.options.errorPlugin.onRetry) {
          this.options.errorPlugin.onRetry(e);
          return;
        } else {
          this.container.stop();
          this.container.play();
          return;
        }
      }
      $('.retry-counter').text(t);
      t--;
      tid = setTimeout(retry, 1000);
    }.bind(this);
    retry();
  }
});

var player = new Clappr.Player({
  disableErrorScreen: true, // Disable the internal error screen plugin
  source: 'http://clappr.io/bad_highline.mp4',
  plugins: [ErrorPlugin],
  errorPlugin: {
    // text: 'My custom error message.',
    onRetry: function(e) {
      // simulate successful recovery
      // or decide here what to do between each retry
      player.configure({
        source: 'http://clappr.io/highline.mp4',
        autoPlay: true,
      });
    }
  },
  height: 360,
  width: 640
});

player.attachTo(playerElement);
```

:rocket: Companies using Clappr
---
https://github.com/clappr/clappr/issues/522

:raised_hands: Contributors
---
This project exists thanks to all the people who [contribute](https://github.com/clappr/clappr/graphs/contributors).

:star2: Sponsor
---
[![image](https://cloud.githubusercontent.com/assets/244265/5900100/ef156258-a54b-11e4-9862-7e5851ed9b81.png)](http://globo.com)
