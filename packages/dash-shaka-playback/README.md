[![npm version](https://badge.fury.io/js/dash-shaka-playback.svg)](https://badge.fury.io/js/dash-shaka-playback)
[![license](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)

# dash-shaka-playback

A [clappr](https://github.com/clappr/clappr) playback to play dash based on the amazing [shaka-player](https://github.com/google/shaka-player).

> CDN JSDELIVR: https://cdn.jsdelivr.net/gh/clappr/dash-shaka-playback@latest/dist/dash-shaka-playback.min.js
>
> CDNJS: https://cdnjs.cloudflare.com/ajax/libs/dash-shaka-playback/2.0.5/dash-shaka-playback.js
>
> NPM: https://www.npmjs.com/package/dash-shaka-playback/

## Changelog

* supports closed caption (subtitles)

# Demo

[![dash shaka playback screenshot](https://raw.githubusercontent.com/clappr/dash-shaka-playback/master/public/screen-shot-dash-clappr.png)](https://jsfiddle.net/m8ndduLo/69/)

# Installation

```bash
yarn add dash-shaka-playback shaka-player@^4
# or shaka-player@^3 if you need to stay on Shaka 3
# or
npm install dash-shaka-playback shaka-player@^4
```

## Peer dependency

`shaka-player` (`^3 || ^4`) is a **required peer dependency**. npm 7+ / yarn will install it for every consumer of this package — including those who only load the UMD build that already embeds Shaka (`dash-shaka-playback.js` / `.min.js`).

That is intentional: the package `exports` map routes `import` to the ESM entry (`dash-shaka-playback.esm.mjs`), which keeps `shaka-player` external. A single peer declaration covers bundler and ESM consumers without maintaining a separate optional peer path. CDN / `<script>` users who never install from npm are unaffected.

The `.external` / `.esm` builds expect the peer (Shaka 3 or 4) to be provided by the page or bundler. The default UMD build still embeds Shaka 3 for drop-in script tags.

Shaka 5+ is not supported yet: APIs this playback still uses (`new shaka.Player(mediaElement)`, `setTextTrackVisibility`) were removed in v5.

```javascript
import Clappr from '@clappr/core'
import DashShakaPlayback from 'dash-shaka-playback'
// shaka-player is resolved via the peer dependency; no side-effect import needed

const player = new Clappr.Player({
  source: '//storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
  plugins: [DashShakaPlayback],
  parentId: '#player'
})
```

Deep imports of specific artifacts (for example to avoid the embedded shaka blob) remain supported:

```javascript
import DashShakaPlayback from 'dash-shaka-playback/dist/dash-shaka-playback.external.js'
```

# Usage

```html
<html>
  <head>
    <script src="https://cdn.jsdelivr.net/npm/@clappr/player@latest/dist/clappr.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dash-shaka-playback@latest/dist/dash-shaka-playback.min.js"></script>
  </head>

  <body>
    <div id="player"></div>
    <script>
      var player = new Clappr.Player(
        {
          source: '//storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd',
          plugins: [DashShakaPlayback],
          shakaConfiguration: {
            preferredAudioLanguage: 'pt-BR',
            streaming: {
              rebufferingGoal: 15
            }
          },
          shakaOnBeforeLoad: function(shaka_player) {
            // shaka_player.getNetworkingEngine().registerRequestFilter() ...
          },
          parentId: '#player'
        });
    </script>
  </body>
</html>
```

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

By default, Shaka player is bundled with the main UMD plugin. Lightweight builds without shaka embedded — `dash-shaka-playback.external.js` / `.external.min.js` and `dash-shaka-playback.esm.mjs` — expect `shaka-player` to be provided by the page or bundler.

# "extra" features

This playback offers you an API for handling with: audio, video and text tracks.

```javascript
selectTrack(track)
textTracks()
audioTracks()
videoTracks()
```

# For the older versions [check](https://github.com/clappr/dash-shaka-playback/tree/releases)
