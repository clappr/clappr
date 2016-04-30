[![npm version](https://badge.fury.io/js/dash-shaka-playback.svg)](https://badge.fury.io/js/dash-shaka-playback)
[![license](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)
# dash-shaka-playback

A [clappr](https://github.com/clappr/clappr) playback to play dash based on [shaka-player](https://github.com/google/shaka-player).

> CDN: https://cdn.jsdelivr.net/clappr.dash-shaka-playback/latest/dash-shaka-playback.js
> 
> NPM: https://www.npmjs.com/package/dash-shaka-playback/

[![dash shaka playback screenshot](https://raw.githubusercontent.com/clappr/dash-shaka-playback/master/public/screen-shot-dash-clappr.png)](https://jsfiddle.net/m8ndduLo/)

# Usage

```html
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/clappr/latest/clappr.min.js"></script>
    <script src="https://cdn.jsdelivr.net/clappr.dash-shaka-playback/latest/dash-shaka-playback.js"></script>
  </head>

  <body>
    <div id="player"></div>
    <script>
      var player = new Clappr.Player(
        {
          source: 'https://shaka-player-demo.appspot.com/assets/angel_one.mpd?_=1446383792251',
          plugins: {
            playback: [DashShakaPlayback]
          },
          shakaConfiguration: {
            preferredAudioLanguage: 'pt-BR',
            streaming: {
              rebufferingGoal: 15
            }
          }
          parentId: '#player'
        });
    </script>
  </body>
</html>
```

# DRM

If need to protect your content (DRM) you must use the `shakaConfiguration` following the [shaka configuration](http://shaka-player-demo.appspot.com/docs/api/tutorial-drm-config.html) need.

# Development

Install dependencies:

`npm install`

Build:

`npm run build`

Run:

`npm start`

# "extra" features

This playback offers you an API for handling with: audio, video and text tracks.

```javascript
enableTextTrack(state)
textTracks()
selectTextTrack(id)
audioTracks()
selectAudioTrack(id)
videoTracks()
selectVideoTrack(id)
```

# observations

This playback supports the [browsers that shaka does](https://shaka-player-demo.appspot.com/docs/tutorial-porting.html) and it also has the same [content restrictions](https://shaka-player-demo.appspot.com/docs/tutorial-caveats.html).

