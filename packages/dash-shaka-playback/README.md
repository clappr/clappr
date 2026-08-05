# dash-shaka-playback

A [clappr](https://github.com/clappr/clappr) playback to play dash based on the amazing [shaka-player](https://github.com/google/shaka-player).

[![CI](https://github.com/clappr/clappr/actions/workflows/ci.yml/badge.svg)](https://github.com/clappr/clappr/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/dash-shaka-playback.svg?color=cb3837)](https://www.npmjs.com/package/dash-shaka-playback)
[![License](https://img.shields.io/github/license/clappr/clappr)](https://github.com/clappr/clappr/blob/main/LICENSE)
[![minified size](https://img.shields.io/bundlephobia/min/dash-shaka-playback)](https://bundlephobia.com/package/dash-shaka-playback)
[![jsDelivr monthly downloads](https://img.shields.io/jsdelivr/npm/hm/dash-shaka-playback?color=orange)](https://www.jsdelivr.com/package/npm/dash-shaka-playback)

> **Breaking change in 5.0.0 —** `shaka-player` is no longer bundled. Every artifact now expects
> you to provide it. See the migration note below.

## Usage

You can use it from JSDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/@clappr/player@latest/dist/clappr.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/shaka-player@4/dist/shaka-player.compiled.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dash-shaka-playback@5/dist/dash-shaka-playback.min.js"></script>
```

or as an npm package:

```bash
yarn add dash-shaka-playback shaka-player@^4
# or
npm install dash-shaka-playback shaka-player@^4
```

### Which artifact to load

| Scenario | Artifact |
|---|---|
| `<script>` / CDN, after `@clappr/player` (or `@clappr/core`) and `shaka-player` | `dist/dash-shaka-playback.min.js` |
| Bundler, CommonJS / UMD entry | `dist/dash-shaka-playback.js` (package `main`) |
| Bundler, ESM entry | `dist/dash-shaka-playback.esm.mjs` (package `module`) |

**Migration note (5.0+):** Every artifact now expects `shaka-player` from the page or bundler. If you loaded `dash-shaka-playback.min.js` with a single script tag, add `shaka-player` before it. If you aliased the deep path to avoid the bundled copy, remove that entry from your bundler's `resolve.alias` (webpack) or equivalent (Vite `resolve.alias`, Rollup `alias`) — the default entry is external now:

```diff
- 'dash-shaka-playback': 'dash-shaka-playback/dist/dash-shaka-playback.external.js',
```

Then just add `DashShakaPlayback` into the list of plugins of your player instance:

```javascript
import Clappr from '@clappr/core'
import DashShakaPlayback from 'dash-shaka-playback'

const player = new Clappr.Player({
  source: '//storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
  plugins: [DashShakaPlayback],
  shakaConfiguration: {
    preferredAudioLanguage: 'pt-BR',
    streaming: { rebufferingGoal: 15 }
  },
  shakaOnBeforeLoad: function (shaka_player) {
    // shaka_player.getNetworkingEngine().registerRequestFilter() ...
  },
  parentId: '#player'
})
```

`shaka-player` (`^3 || ^4`) is a **required peer dependency**. CI and the demo exercise
Shaka 4 only; 3.x remains in the peer range for existing consumers but is untested.
Shaka 5+ is not supported.

# Demo

[![dash shaka playback screenshot](https://raw.githubusercontent.com/clappr/dash-shaka-playback/master/public/screen-shot-dash-clappr.png)](https://jsfiddle.net/m8ndduLo/69/)

# DRM

If need to protect your content (DRM) you must use the `shakaConfiguration` following the [shaka configuration](http://shaka-player-demo.appspot.com/docs/api/tutorial-drm-config.html) need.

# License Wrapping

If need to wrap DRM license requests or responses you use `shakaOnBeforeLoad` following [shaka License Wrapping](http://shaka-player-demo.appspot.com/docs/api/tutorial-license-wrapping.html) guide.

# Development

Install yarn:

https://yarnpkg.com/lang/en/docs/install/

Install dependencies from the monorepo root:

`yarn install`

Run the Rollup dev server:

`yarn start`

By default, the dev server listens on `http://0.0.0.0:8080`.

Build the published artifacts (UMD, minified UMD, and ESM):

`yarn release`

All artifacts keep `shaka-player` external — provide it from the page or bundler.

# "extra" features

This playback offers you an API for handling with: audio, video and text tracks.

```javascript
selectTrack(track)
textTracks()
audioTracks()
videoTracks()
```

# For the older versions [check](https://github.com/clappr/dash-shaka-playback/tree/releases)
