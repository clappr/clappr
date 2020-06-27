# HlsjsPlayback

A [Clappr](https://github.com/clappr/clappr) playback to play HTTP Live Streaming (HLS) based on the [hls.js](https://github.com/video-dev/hls.js).

<p>
  <a href="https://www.npmjs.com/package/@clappr/hlsjs-playback"><img src="https://badge.fury.io/js/%40clappr%2Fhlsjs-playback.svg"></a>
  <a href="https://bundlephobia.com/result?p=@clappr/hlsjs-playback@latest"><img src="https://img.shields.io/bundlephobia/min/@clappr/hlsjs-playback"></a>
  <a href="https://travis-ci.org/clappr/hlsjs-playback"><img src="https://travis-ci.org/clappr/hlsjs-playback.svg?branch=master"></a>
  <a href="https://coveralls.io/github/clappr/hlsjs-playback?branch=master"><img src="https://coveralls.io/repos/github/clappr/hlsjs-playback/badge.svg?branch=master"></a>
  <a href="https://github.com/clappr/hlsjs-playback/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-BSD--3--Clause-blue.svg"></a>
  <a href="https://www.jsdelivr.com/package/npm/@clappr/hlsjs-playback"><img alt="jsDelivr hits (npm)" src="https://img.shields.io/jsdelivr/npm/hm/@clappr/hlsjs-playback?color=orange"></a>
</p>


## Usage

You can use it from JSDelivr:

`https://cdn.jsdelivr.net/npm/clappr/hlsjs-playback@latest/dist/hlsjs-playback.min.js`

or as an npm package:

`yarn add clappr-context-menu-plugin`

Then just add `HlsjsPlayback` into the list of plugins of your player instance:

```javascript
var player = new Clappr.Player(
  {
    source: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    plugins: [HlsjsPlayback],
  });
```

## Configuration

The options for this playback are shown below:

```javascript
var player = new Clappr.Player(
  {
    source: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    plugins: [HlsjsPlayback],
    hlsUseNextLevel: false,
    hlsMinimumDvrSize: 60,
    hlsRecoverAttempts: 16,
    playback: {
      extrapolatedWindowNumSegments: 2,
      triggerFatalErrorOnResourceDenied: false,
      hlsjsConfig: {
        // hls.js specific options
      },
    },
  });
```

#### hlsUseNextLevel
> Default value: `false`

The default behavior for the HLS playback is to use [hls.currentLevel](https://github.com/video-dev/hls.js/blob/master/docs/API.md#hlscurrentlevel) to switch current level. To change this behaviour and force HLS playback to use [hls.nextLevel](https://github.com/video-dev/hls.js/blob/master/docs/API.md#hlsnextlevel), add `hlsUseNextLevel: true` to embed parameters.

#### hlsMinimumDvrSize
> Default value: `60 (seconds)`

Option to define the minimum DVR size to active seek on Clappr live mode.

#### extrapolatedWindowNumSegments
> Default value: `2`

Configure the size of the start time extrapolation window measured as a multiple of segments.

Should be 2 or higher, or 0 to disable. It should only need to be increased above 2 if more than one segment is removed from the start of the playlist at a time.

E.g.: If the playlist is cached for 10 seconds and new chunks are added/removed every 5.

#### hlsRecoverAttempts
> Default value: `16`

The `hls.js` have recover approaches for some fatal errors. This option sets the max recovery attempts number for those errors.

#### triggerFatalErrorOnResourceDenied
> Default value: `false`

If this option is set to true, the playback will triggers fatal error event if decrypt key http response code is greater than or equal to 400. This option is used to attempt to reproduce iOS devices behaviour which internally use html5 video playback.

#### hlsjsConfig

As `HlsjsPlayback` is based on `hls.js`, it's possible to use the available `hls.js` configs too. You can check them out [here](https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning).

To use these settings, use the `hlsjsConfig` object.

Example:

```javascript
var player = new Clappr.Player(
  {
    ...
    playback: {
      hlsjsConfig: {
        debug: true, // https://github.com/video-dev/hls.js/blob/master/docs/API.md#debug
        enableworker: false, // https://github.com/video-dev/hls.js/blob/master/docs/API.md#enableworker
        ...
      },
    },
  });
```

## Development

Enter the project directory and install the dependencies:

`yarn install`

Make your changes and run the tests:

`yarn test`

Build your own version:

`yarn build`

Check the result on `dist/` folder.

Starting a local server:

`yarn start`

This command will start an HTTP Server on port 8080. You can check a sample page with Clappr-core using the HlsjsPlayback on http://localhost:8080/
