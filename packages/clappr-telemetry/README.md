# @clappr/telemetry

[![npm version](https://img.shields.io/badge/npm-v0.1.0-cb3837)](https://www.npmjs.com/package/@clappr/telemetry)

A telemetry plugin for [Clappr](https://github.com/clappr/clappr). Collects network, engine, and MSE metrics from the player and exposes them through a single unified event on the container bus.

## Overview

`@clappr/telemetry` is a `ContainerPlugin` that automatically detects the active playback engine and activates the appropriate adapter for metrics collection. All telemetry data — regardless of source or event type — flows through the same registered event channel using a versioned envelope format, keeping consumers decoupled from internal implementation details.

The adapter architecture is extensible: new playback engines (HLS.js, Shaka, native playback, etc.) can be supported by adding an adapter without changing the plugin or consumer code.

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
      network: { enabled: true }
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
    network: { enabled: true }
  }
})
```

## Configuration

| Option                      | Type    | Default | Description                       |
| --------------------------- | ------- | ------- | --------------------------------- |
| `telemetry.network.enabled` | Boolean | `false` | Enables network request telemetry |

## Consuming telemetry events

All telemetry data is emitted on a single event registered by the plugin: `Clappr.Events.Custom.CONTAINER_TELEMETRY_TRACE`. The recommended way to consume it is via a `ContainerPlugin`, which handles lifecycle and cleanup automatically:

```javascript
class MyTelemetryConsumer extends Clappr.ContainerPlugin {
  get name() {
    return 'my_telemetry_consumer'
  }

  bindEvents() {
    this.listenTo(this.container, Clappr.Events.Custom.CONTAINER_TELEMETRY_TRACE, this.onTrace)
  }

  onTrace(envelope) {
    // Process the telemetry envelope
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

Every emission on `containerTelemetryTrace` carries a versioned envelope:

| Field    | Type   | Description                                                 |
| -------- | ------ | ----------------------------------------------------------- |
| `type`   | string | What happened — identifies the event within its source area |
| `source` | string | Where it came from — which telemetry area emitted the event |
| `data`   | object | Event-specific payload (varies by `type`)                   |
| `t`      | number | Monotonic timestamp from `performance.now()`                |
| `ts`     | number | Wall-clock timestamp from `Date.now()`                      |
| `v`      | string | Envelope contract version (`1.0`)                           |

### Event types (`type`)

The `type` field identifies what happened. As new telemetry areas are added (MSE, engine, playback state), new types will appear here.

| `type`          | `source`  | Description                     |
| --------------- | --------- | ------------------------------- |
| `request:start` | `network` | A network request was initiated |
| `request:end`   | `network` | A network request completed     |

### Sources (`source`)

The `source` field identifies which telemetry area emitted the event. Each adapter owns one source.

| `source`  | Area                                                    | Status    |
| --------- | ------------------------------------------------------- | --------- |
| `network` | Network request metrics (segments, manifests, licenses) | Available |

## Adapters

Adapters connect the plugin to specific playback engines. Each adapter implements `static isSupported(playback)` and `bind()`.

| Adapter                | Engine                | Status    |
| ---------------------- | --------------------- | --------- |
| `ShakaNetworkAdapter`  | `dash-shaka-playback` | Available |
| HLS.js Network Adapter | `hlsjs-playback`      | Planned   |

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
