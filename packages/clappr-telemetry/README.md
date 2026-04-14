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

### Public API (ES modules)

The `module` field points to `dist/clappr-telemetry.esm.js`, which exposes the plugin as the **default** export and these **named** exports (for tests, tooling, or custom adapters):

| Export                         | Description                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------ |
| `NetworkAdapters`              | Registry class — use to register and unregister adapters (none pre-registered) |
| `ShakaNetworkAdapter`          | Shaka network metrics adapter class — must be registered explicitly            |
| `HlsNetworkAdapter`            | HLS.js network metrics adapter class — must be registered explicitly           |
| `TELEMETRY_CONTRACT_VERSION`   | Semver string on each envelope (`v` field)                                     |
| `EVENT_TYPES`                  | Canonical `type` strings (`request:start`, `request:end`, etc.)                |
| `TELEMETRY_SOURCES`            | Canonical `source` values (e.g. `network`)                                     |
| `createEnvelope`               | Builds the versioned envelope object                                           |
| `emitTelemetry`                | Triggers `Events.Custom.CONTAINER_TELEMETRY_TRACE` on an emitter               |
| `calculateThroughput`          | Mbps helper used by network adapters                                           |

The UMD build (`dist/clappr-telemetry.js` / CDN) exposes **only** the plugin as the global `ClapprTelemetry`. Adapters must be registered explicitly via `ClapprTelemetry.NetworkAdapters` — no adapter is pre-registered in any build.

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

  get supportedVersion() {
    return { min: '0.13.1' }
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


## Adapters

Adapters connect the plugin to specific playback engines. Each adapter implements `static isSupported(playback)` and `bind()`.

| Adapter                | Engine                | Status    |
| ---------------------- | --------------------- | --------- |
| `ShakaNetworkAdapter`  | `dash-shaka-playback` | Available |
| `HlsNetworkAdapter`    | `hlsjs-playback`      | Available |

### Registering adapters

All adapters — including the built-ins — must be registered before the player is instantiated. The first registered adapter has the highest priority.

```javascript
import { NetworkAdapters, ShakaNetworkAdapter, HlsNetworkAdapter } from '@clappr/telemetry'

NetworkAdapters.register(ShakaNetworkAdapter)
NetworkAdapters.register(HlsNetworkAdapter)

// Custom adapters can also be registered
NetworkAdapters.register(MyCustomAdapter)

// Remove when no longer needed
NetworkAdapters.unregister(MyCustomAdapter)
```

**Adapter contract:**

| Member | Description |
| --- | --- |
| `static get name()` | String identifier (optional — used only in log messages) |
| `static isSupported(playback)` | Returns `true` when this adapter handles the given playback |
| `constructor(playback, container)` | Receives playback engine and container |
| `bind()` | Attaches listeners/hooks into the engine |
| `destroy()` | Detaches listeners and releases resources |

### Sources (`source`)

The `source` field identifies which telemetry area emitted the event. Each adapter owns one source.

| `source`  | Area                                                    | Status    |
| --------- | ------------------------------------------------------- | --------- |
| `network` | Network request metrics (segments, manifests, licenses) | Available |


### Event types (`type`)

The `type` field identifies what happened. As new telemetry areas are added (MSE, engine, playback state), new types will appear here.

| `type`                   | `source`  | Description                                           |
| ------------------------ | --------- | ----------------------------------------------------- |
| `request:start`          | `network` | A network request was initiated                       |
| `request:end`            | `network` | A network request completed                           |
| `request:error`  | `network` | A network request failed (includes `details` and `fatal`) |
| `bitrate:change`         | `network` | ABR algorithm switched to a different quality variant |
| `drm:session:update`     | `network` | A DRM session was updated                             |
| `drm:expiration:updated` | `network` | A DRM license expiration time was updated             |


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
