# @clappr/telemetry

[![npm version](https://img.shields.io/badge/npm-v0.1.0-cb3837)](https://www.npmjs.com/package/@clappr/telemetry)

A telemetry plugin for [Clappr](https://github.com/clappr/clappr). Collects network, buffer, and decoding metrics from the player and exposes them through a single unified event on the container bus.

## Overview

`@clappr/telemetry` is a `ContainerPlugin` that automatically detects the active playback engine and activates the appropriate adapter for metrics collection. All telemetry data — regardless of source or event type — flows through the same registered event channel using a versioned envelope format, keeping consumers decoupled from internal implementation details.

The plugin is built around two extensible subsystems:

- **Network adapters** — hook into the streaming engine (Shaka, HLS.js) to capture request timings, bitrate changes, and DRM events
- **Sampler registry** — drives a set of periodic samplers from a single timer, emitting one `mse.sample` event per tick with buffer and decoding data grouped under their respective keys

## Installation

```bash
yarn add @clappr/telemetry
```

Via CDN (jsDelivr):

```html
<script src="https://cdn.jsdelivr.net/npm/@clappr/telemetry/dist/clappr-telemetry.js"></script>
```

## Usage

```html
<script src="https://cdn.jsdelivr.net/npm/@clappr/core/dist/clappr-core.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dash-shaka-playback/dist/dash-shaka-playback.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@clappr/telemetry/dist/clappr-telemetry.js"></script>

<div id="player"></div>
<script>
  const player = new Clappr.Player({
    parentId: '#player',
    source: 'https://example.com/stream.mpd',
    plugins: [DashShakaPlayback, ClapprTelemetry],
    telemetry: {
      network:        { enabled: true },
      bufferSample:   { enabled: true },
      decodingSample: { enabled: true }
    }
  })
</script>
```

With npm/ESM:

```javascript
import Clappr from '@clappr/core'
import DashShakaPlayback from 'dash-shaka-playback'
import ClapprTelemetry from '@clappr/telemetry'

const player = new Clappr.Player({
  parentId: '#player',
  source: 'https://example.com/stream.mpd',
  plugins: [DashShakaPlayback, ClapprTelemetry],
  telemetry: {
    network:        { enabled: true },
    bufferSample:   { enabled: true },
    decodingSample: { enabled: true }
  }
})
```

### Named exports (ES modules)

Available from `dist/clappr-telemetry.esm.js`:

**Adapters**

| Export                | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| `ShakaNetworkAdapter` | Shaka network metrics adapter class                                     |
| `HlsNetworkAdapter`   | HLS.js network metrics adapter class                                    |
| `findNetworkAdapter`  | Resolves the adapter class for a playback instance (used by the plugin) |

**Samplers**

| Export              | Description                                              |
| ------------------- | -------------------------------------------------------- |
| `SamplerRegistry`  | Registry class — use to register custom samplers         |
| `BufferSampler`     | Built-in buffer state sampler                            |
| `DecodingSampler`   | Built-in decoding quality sampler                        |

**Utils**

| Export                       | Description                                                      |
| ---------------------------- | ---------------------------------------------------------------- |
| `TELEMETRY_CONTRACT_VERSION` | Semver string on each envelope (`v` field)                       |
| `EVENT_TYPES`                | Canonical `type` strings (`request:start`, `mse.sample`, etc.)  |
| `TELEMETRY_SOURCES`          | Canonical `source` values (e.g. `network`)                       |
| `createEnvelope`             | Builds the versioned envelope object                             |
| `emitTelemetry`              | Triggers `CONTAINER_TELEMETRY_TRACE` on an emitter               |
| `calculateThroughput`        | Mbps helper used by network adapters                             |
| `getBufferAhead`             | Returns seconds buffered ahead of the current position           |
| `getBufferedRanges`          | Converts `TimeRanges` to a compact `[[start, end], ...]` array   |

The UMD build (`dist/clappr-telemetry.js` / CDN) exposes **only** the plugin as the global `ClapprTelemetry`. Use the ESM file if you need named exports.

## Configuration

All options are opt-in — nothing is collected by default.

| Option                                 | Type    | Default | Description                                               |
| -------------------------------------- | ------- | ------- | --------------------------------------------------------- |
| `telemetry.network.enabled`            | Boolean | `false` | Enables network request telemetry                         |
| `telemetry.bufferSample.enabled`       | Boolean | `false` | Enables periodic buffer state sampling                    |
| `telemetry.bufferSample.includeRanges` | Boolean | `true`  | Includes buffered time ranges in the `mse.sample` payload |
| `telemetry.decodingSample.enabled`     | Boolean | `false` | Enables periodic decoding quality sampling                |
| `telemetry.sampleIntervalMs`           | Number  | `0`     | Sampling frequency in ms. When `0` (default), no automatic interval is started and only on-demand snapshots via `snapshot()` are available |

## Consuming telemetry events

All telemetry data is emitted on a single event registered by the plugin: `Clappr.Events.Custom.CONTAINER_TELEMETRY_TRACE`. The recommended way to consume it is via a `ContainerPlugin`, which handles lifecycle and cleanup automatically:

```javascript
class MyTelemetryConsumer extends Clappr.ContainerPlugin {
  get name() {
    return 'my_telemetry_consumer'
  }

  get supportedVersion() {
    return { min: '0.13.1' }
  }

  bindEvents() {
    this.listenTo(this.container, Clappr.Events.Custom.CONTAINER_TELEMETRY_TRACE, this.onTrace)
  }

  onTrace(envelope) {
    if (envelope.type === 'mse.sample') {
      const { buffer, decoding } = envelope.data
      // buffer and decoding keys are only present when the respective sampler is enabled
    }
  }
}
```

## Event channel

All telemetry data flows through a **single registered event** on the container bus:

```javascript
Clappr.Events.Custom.CONTAINER_TELEMETRY_TRACE
```

This event is registered when the TelemetryPlugin is instantiated. It is the public contract of the plugin. Consumers never need to know which adapter or engine is active — they always listen to the same event and receive the same envelope shape.


## Envelope format

Every emission on `CONTAINER_TELEMETRY_TRACE` carries a versioned envelope:

| Field    | Type   | Description                                                 |
| -------- | ------ | ----------------------------------------------------------- |
| `type`   | string | What happened — identifies the event within its source area |
| `source` | string | Where it came from — which telemetry area emitted the event |
| `data`   | object | Event-specific payload (varies by `type`)                   |
| `t`      | number | Monotonic timestamp from `performance.now()`                |
| `ts`     | number | Wall-clock timestamp from `Date.now()`                      |
| `v`      | string | Envelope contract version (`1.0`)                           |


## Adapters

Adapters connect the plugin to specific playback engines. Each adapter implements `static isSupported(playback)` and `bind()`.

| Adapter               | Engine                | Status    |
| --------------------- | --------------------- | --------- |
| `ShakaNetworkAdapter` | `dash-shaka-playback` | Available |
| `HlsNetworkAdapter`   | `hlsjs-playback`      | Available |

### Sources (`source`)

| `source`            | Area                                                    |
| ------------------- | ------------------------------------------------------- |
| `network`           | Network request metrics (segments, manifests, licenses) |
| `sampler-registry` | Periodic MSE metrics (buffer state, decoding quality)   |


### Event types (`type`)

| `type`                   | `source`            | Description                                           |
| ------------------------ | ------------------- | ----------------------------------------------------- |
| `request:start`          | `network`           | A network request was initiated                       |
| `request:end`            | `network`           | A network request completed                           |
| `request:error`          | `network`           | A network request failed                              |
| `bitrate:change`         | `network`           | ABR algorithm switched to a different quality variant |
| `drm:session:update`     | `network`           | A DRM session was updated                             |
| `drm:expiration:updated` | `network`           | A DRM license expiration time was updated             |
| `mse.sample`             | `sampler-registry` | Periodic snapshot of buffer and/or decoding state     |

### `mse.sample` payload

Emitted once per tick by the `SamplerRegistry`. Each key is only present when the respective sampler is enabled and has data to report (the `decoding` key is absent on the first tick while the baseline is being established).

```javascript
{
  buffer: {
    bufferAhead:   20,       // seconds buffered ahead of current position
    currentTime:   10,       // current playback position in seconds
    rangesCompact: [[0, 30]] // buffered time ranges (omitted if includeRanges: false)
  },
  decoding: {
    decodedFps:   24,        // frames decoded per second in the interval
    droppedFps:    1,        // frames dropped per second in the interval
    dropRatio:  0.04,        // ratio of dropped frames over total in the interval
    currentTime:   10,       // current playback position in seconds
    totalDropped:   2,       // cumulative dropped frames since playback started
    totalDecoded: 537        // cumulative decoded frames since playback started
  }
}
```

## Custom samplers

The sampler registry is extensible. You can add your own sampler and have it participate in the same `mse.sample` tick without forking the package.

### Contract

A custom sampler must implement three members:

| Member | Description |
| --- | --- |
| `static isEnabled(cfg)` | Returns `true` when the sampler should be active. `cfg` is `container.options.telemetry` |
| `collect()` | Called every tick. Returns a plain object with the data to include, or `null` to skip this tick |
| `destroy()` | Called when the registry is destroyed. Clean up any internal state here |

### Example

```javascript
import {
  SamplerRegistry,
  emitTelemetry,
  getBufferAhead
} from '@clappr/telemetry'

class AudioSampler {
  static isEnabled(cfg) {
    return cfg?.audioSample?.enabled === true
  }

  constructor(playback) {
    this._playback = playback
  }

  collect() {
    const videoEl = this._playback?.el
    if (!videoEl) return null
    return { volume: videoEl.volume, muted: videoEl.muted }
  }

  destroy() {
    this._playback = null
  }
}

// register before instantiating the player
SamplerRegistry.register('audio', AudioSampler)

new Clappr.Player({
  plugins: [ClapprTelemetry],
  telemetry: {
    audioSample: { enabled: true }
  }
})
```

The result appears under the `audio` key in the `mse.sample` payload:

```javascript
{
  buffer:  { ... },
  decoding:{ ... },
  audio:   { volume: 1, muted: false }
}
```

To remove a previously registered sampler:

```javascript
SamplerRegistry.unregister('audio')
```

### On-demand snapshot

The `TelemetryPlugin` exposes a `snapshot` getter that returns the current sampler data immediately, without waiting for the next tick and without emitting any event:

```javascript
const telemetry = player.getPlugin('telemetry')
const data = telemetry.snapshot
// { buffer: { bufferAhead: 20, currentTime: 10 }, decoding: { ... } }
```

Returns an empty object if called before the player is ready.



## Development

This package lives in the Clappr monorepo under `packages/clappr-telemetry`. Install dependencies once at the **repository root**; build, dev server, and tests should be run with **`yarn workspace @clappr/telemetry`** so Yarn resolves the workspace correctly:

```bash
# From the monorepo root (not only inside this package)
yarn install

yarn workspace @clappr/telemetry build
yarn workspace @clappr/telemetry dev        # Rollup watch + demo at http://localhost:8080
yarn workspace @clappr/telemetry test
yarn workspace @clappr/telemetry test:watch
```

The demo page expects UMD builds from sibling packages (for example `@clappr/core` and `dash-shaka-playback`). If those `dist/` folders are missing, build them from the root (for example `lerna run build --scope=@clappr/core` and `lerna run build --scope=dash-shaka-playback`) before opening the dev server.

## License

BSD-3-Clause
