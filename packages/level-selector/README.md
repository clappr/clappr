# LevelSelector

A [Clappr](https://github.com/clappr/clappr) plugin that adds a quality picker for adaptive streams on the official MediaControl.

[![CI](https://github.com/clappr/clappr/actions/workflows/ci.yml/badge.svg)](https://github.com/clappr/clappr/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@clappr/level-selector.svg?color=cb3837)](https://www.npmjs.com/package/@clappr/level-selector)
[![License](https://img.shields.io/github/license/clappr/clappr)](https://github.com/clappr/clappr/blob/main/LICENSE)
[![minified size](https://img.shields.io/bundlephobia/min/@clappr/level-selector)](https://bundlephobia.com/package/@clappr/level-selector)
[![jsDelivr monthly downloads](https://img.shields.io/jsdelivr/npm/hm/@clappr/level-selector?color=orange)](https://www.jsdelivr.com/package/npm/@clappr/level-selector)

## Usage

You can use it from JSDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/@clappr/player@latest/dist/clappr.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@clappr/level-selector@1/dist/level-selector.min.js"></script>
```

or as an npm package:

```bash
yarn add @clappr/level-selector @clappr/player
# or
npm install @clappr/level-selector @clappr/player
```

### Which artifact to load

| Scenario                                            | Artifact                                        |
| --------------------------------------------------- | ----------------------------------------------- |
| `<script>` / CDN, after `@clappr/player` or core    | `dist/level-selector.min.js`                    |
| Bundler, CommonJS / UMD entry                       | `dist/level-selector.js` (package `main`)       |
| Bundler, ESM entry                                  | `dist/level-selector.esm.js` (package `module`) |

Then add `LevelSelector` to the plugins list of your player instance:

```javascript
import Clappr from '@clappr/player'
import LevelSelector from '@clappr/level-selector'

var player = new Clappr.Player({
  source: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  plugins: [LevelSelector]
})
```

The plugin peer-depends on `@clappr/core` only, but **the official MediaControl from `@clappr/player` (or an equivalent host that renders `.media-control-right-panel`) is required at runtime**. Without it the control is not shown.

## Configuration

Customize the menu with `levelSelectorConfig` on the player options:

```javascript
var player = new Clappr.Player({
  source: 'http://your.video/here.m3u8',
  plugins: [LevelSelector],
  levelSelectorConfig: {
    title: 'Quality',
    labels: {
      2: 'High', // 500kbps
      1: 'Med', // 240kbps
      0: 'Low' // 120kbps
    },
    labelCallback: function (playbackLevel, customLabel) {
      return customLabel + playbackLevel.level.height + 'p' // High 720p
    }
  }
})
```

Transform the levels before they render:

```javascript
var player = new Clappr.Player({
  source: 'http://your.video/here.m3u8',
  plugins: [LevelSelector],
  levelSelectorConfig: {
    onLevelsAvailable: function (levels) {
      return levels.reverse() // For example, reverse levels order
    }
  }
})
```

| Key                 | Description                                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| `title`             | Optional menu heading row                                                   |
| `labels`            | Map of level id → custom label string                                       |
| `labelCallback`     | `(playbackLevel, customLabel) => string` to format each row at runtime      |
| `onLevelsAvailable` | `(levels) => levels[]` receives a copy; return the array used for the menu |

## Playback contract

The active playback must implement the Clappr levels API:

- Emit `PLAYBACK_LEVELS_AVAILABLE` with an ordered array of `{ id, label }` objects
- Expose `levels` (array, filled after the event)
- Expose `currentLevel` (getter/setter); changing it switches quality
- Auto quality uses id `-1` (the plugin always adds its own Auto row)
- Optionally emit `PLAYBACK_LEVEL_SWITCH_START`, `PLAYBACK_LEVEL_SWITCH_END`, and `PLAYBACK_BITRATE` for switch feedback and current-row highlighting

HLS and DASH playbacks in this monorepo already implement this contract.

## Local demo

From the package directory:

```bash
yarn start
```

Open the Vite dev server and load `index.html` with a multi-bitrate HLS source.

## Credits

This package ports the community [clappr-level-selector-plugin](https://github.com/clappr/clappr-level-selector-plugin). The original work is MIT-licensed:

```
The MIT License (MIT)

Copyright (c) 2014 Lucas Mundim

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Contributors to the archived plugin include Nikita Makarin, Leandro Moreira, and others listed in that repository's history.
