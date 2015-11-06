# dash-shaka-playback

A [clappr](https://github.com/clappr/clappr) playback to play dash based on [shaka-player](https://github.com/google/shaka-player).

> CDN: https://cdn.jsdelivr.net/clappr.dash-shaka-playback/latest/dash-shaka-playback.js
> 
> NPM: https://www.npmjs.com/package/dash-shaka-playback/

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

