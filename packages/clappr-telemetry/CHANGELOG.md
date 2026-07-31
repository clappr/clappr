# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.2.7](https://github.com/clappr/clappr/compare/@clappr/telemetry@0.2.6...@clappr/telemetry@0.2.7) (2026-07-31)

**Note:** Version bump only for package @clappr/telemetry

## [0.2.6](https://github.com/clappr/clappr/compare/@clappr/telemetry@0.2.5...@clappr/telemetry@0.2.6) (2026-07-30)

**Note:** Version bump only for package @clappr/telemetry

## [0.2.5](https://github.com/clappr/clappr/compare/@clappr/telemetry@0.2.4...@clappr/telemetry@0.2.5) (2026-07-30)

**Note:** Version bump only for package @clappr/telemetry

## [0.2.4](https://github.com/clappr/clappr/compare/@clappr/telemetry@0.2.3...@clappr/telemetry@0.2.4) (2026-07-29)

**Note:** Version bump only for package @clappr/telemetry

## [0.2.3](https://github.com/clappr/clappr/compare/@clappr/telemetry@0.2.2...@clappr/telemetry@0.2.3) (2026-07-29)

### Bug Fixes

- **telemetry:** drop private flag to enable npm publishing ([b56a4b6](https://github.com/clappr/clappr/commit/b56a4b662dce0139ce1b85410dff7408e54e7d2b)), closes [#2470](https://github.com/clappr/clappr/issues/2470)

## [0.2.2](https://github.com/clappr/clappr/compare/@clappr/telemetry@0.2.1...@clappr/telemetry@0.2.2) (2026-07-29)

**Note:** Version bump only for package @clappr/telemetry

## [0.2.1](https://github.com/clappr/clappr/compare/@clappr/telemetry@0.2.0...@clappr/telemetry@0.2.1) (2026-07-29)

**Note:** Version bump only for package @clappr/telemetry

# 0.2.0 (2026-07-29)

### Bug Fixes

- adjust rollup.config.js indentation ([a23f6cd](https://github.com/clappr/clappr/commit/a23f6cd47eaf7f9d3dc74cd313034e2c64b7aa9b))
- **clappr-telemetry:** fixes applied by AI review agent under author supervision ([971d37d](https://github.com/clappr/clappr/commit/971d37d06f475636e6d8e729b5c9f5afc549ba55))
- remove comment from .gitkeep to maintain convention ([034f9f8](https://github.com/clappr/clappr/commit/034f9f82f6ccd06c7684abbfa97d4f90fe1f6839))
- remove trailing comma in mock definition ([a530b27](https://github.com/clappr/clappr/commit/a530b277ea9ab3f5873d6e7532ddcdd46c4ebccc))
- **telemetry:** add idempotency guard to bind() method in ShakaNetworkAdapter ([8f142e4](https://github.com/clappr/clappr/commit/8f142e4f24e0eba1790a994efa2d336e53d1974b))
- **telemetry:** apply post-review fixes to registry correctness and isolation ([b260e9d](https://github.com/clappr/clappr/commit/b260e9d4195e0db8beafe12d362165da106db39a))
- **telemetry:** correct test:watch path from absolute /src to relative src/ ([28a870d](https://github.com/clappr/clappr/commit/28a870d9b6f83994a7ce8db39a6c2976d84cb4a7))
- **telemetry:** destroy stale network adapter when no new adapter matches ([e2ebd25](https://github.com/clappr/clappr/commit/e2ebd25978cc1c9f4dc08cd794f6dc2699f6d1bc))
- **telemetry:** expose registries in UMD bundle and fix lint errors ([cda7e5d](https://github.com/clappr/clappr/commit/cda7e5df9e03f12b8675c34cd007097f30466eec))
- **telemetry:** fall through to shaka:ready when networking engine is null ([c4c75aa](https://github.com/clappr/clappr/commit/c4c75aa87a9c036896d66f1d8bf9d8c5d830a1ab))
- **telemetry:** fix lint errors — trailing comma and multi-spaces in comments ([901da8a](https://github.com/clappr/clappr/commit/901da8a828d1df239bfe74d4208d73f4f83f3509))
- **telemetry:** fix pending requests leaking on stalled responses ([672f54d](https://github.com/clappr/clappr/commit/672f54d0587efc6371241764cdff65a70d20e76c))
- **telemetry:** harden registry contracts and fix plugin lifecycle bugs ([dcaf2bf](https://github.com/clappr/clappr/commit/dcaf2bf916eadba82d83420c0b5de5c2e82ac684))
- **telemetry:** isolate registries per instance and harden register tracking ([8d6cfbb](https://github.com/clappr/clappr/commit/8d6cfbbb915ed785802fc7b1bcf8753c618c2067))
- **telemetry:** log emit failures in emitTelemetry ([e3bb07a](https://github.com/clappr/clappr/commit/e3bb07a4f5a49a281d884f9f6a465bfd8e4fbcb6))
- **telemetry:** prevent bind() from marking adapter bound when attachFilters fails ([8d19caf](https://github.com/clappr/clappr/commit/8d19cafb96e0ad771acf54311fe20667db50c59f))
- **telemetry:** prevent data loss when pendingRequests map reaches limit ([bce014f](https://github.com/clappr/clappr/commit/bce014f1c0f580317af06bc187df3099fed4b14e))
- **telemetry:** prevent duplicate shaka:ready listeners on repeated bind() calls ([aa792cf](https://github.com/clappr/clappr/commit/aa792cf18ae3f4861ced7e63c7362dfc824dfe46))
- **telemetry:** remove debug log and restore demo page controls ([9330ed4](https://github.com/clappr/clappr/commit/9330ed4b7bc9c7014b29e4aedb7394a23ad8b171))
- **telemetry:** remove duplicate display: none in custom-config ([440f518](https://github.com/clappr/clappr/commit/440f518d0d4d228b59b167c352c6c90e7704473f))
- **telemetry:** set \_isBound flag after attachFilters in early return path ([6789098](https://github.com/clappr/clappr/commit/67890984e2ea8f290d7e15954bbf1d5b7890a5ec))
- **telemetry:** set \_isBound when attachFilters fails and playback.on is unavailable ([8dea71e](https://github.com/clappr/clappr/commit/8dea71ed9307e1ccfe26765989508cd0a0d506a6))

### Features

- **adapters:** add BITRATE_INIT event and throughputEwmaMbps to HLS and Shaka ([77cb772](https://github.com/clappr/clappr/commit/77cb7726ab409e0472175e584115f53a90bf1aaf))
- **network-sampler:** add NetworkSampler ([596e531](https://github.com/clappr/clappr/commit/596e531df8c55fbc96bc3d1e24c6e57d321cfef9))
- **playback-state-sampler:** track bitrate via BITRATE_INIT and BITRATE_CHANGE events ([b387e63](https://github.com/clappr/clappr/commit/b387e638b0a24a79fd99d66b3d5e54015bef9484))
- **telemetry:** add buffer and decoding samplers with hardened lifecycle ([477c28c](https://github.com/clappr/clappr/commit/477c28cf9cb8d5cd69f33271e4bf41d53902c001))
- **telemetry:** add DRM session and expiration events to ShakaNetworkAdapter ([7101318](https://github.com/clappr/clappr/commit/71013187bec366d8d5cb77c561fb1f2907f7d4e4))
- **telemetry:** add esm named exports and separate umd entry ([a738f6d](https://github.com/clappr/clappr/commit/a738f6d853abfa217b1e960cd12a2ca87ae7d6cd))
- **telemetry:** add HLS.js network adapter and doc ([dbc7f3d](https://github.com/clappr/clappr/commit/dbc7f3d642670f11d5269223336ade02c4376185))
- **telemetry:** add ObserverRegistry, VideoEventObserver and PlaybackStateSampler ([9a2ae4c](https://github.com/clappr/clappr/commit/9a2ae4c6f89203b3f82767da542e0aed4910a447))
- **telemetry:** add per-component opt-out via cfg[name].enabled in all registries ([246f4ec](https://github.com/clappr/clappr/commit/246f4ece8b1102f9b5d7c868a7cfa16a61b0f90e))
- **telemetry:** add shaka ABR variant change events ([d8458b2](https://github.com/clappr/clappr/commit/d8458b2510111e8fd268de35f79f51ccc0aabd44))
- **telemetry:** adopt Clappr-style plugin registration for adapters and samplers ([f0a6936](https://github.com/clappr/clappr/commit/f0a6936857656764602eb146fd29ed0c99f9e1b4))
- **telemetry:** apply adapter-registry pattern to observers and samplers ([2cc1fd5](https://github.com/clappr/clappr/commit/2cc1fd5f9b3e3f52806590bc997210e6be4f5b3b))
- **telemetry:** introduce extensible AdapterRegistry for network adapters ([89b22a2](https://github.com/clappr/clappr/commit/89b22a2ce37cfde1b871555329ad813af938e546))
- **telemetry:** scaffold telemetry package with shaka adapter ([f154ce0](https://github.com/clappr/clappr/commit/f154ce07a9a81c1cba703b758f40e09651fc956d))
- **timing-sampler:** add PlaybackTimingSampler ([95c1fc0](https://github.com/clappr/clappr/commit/95c1fc06c481eaaa68372ec6bdc0f579ec13dd41))

### Reverts

- remove telemetry package ([1db1d77](https://github.com/clappr/clappr/commit/1db1d77aac74e40020fed427d09250155c2ecafa))

## [Unreleased]

### Added

- Initial release of @clappr/telemetry package
- Basic project structure with Rollup build configuration
- Shaka network adapter for telemetry collection
- Shaka `request:start` event: emitted when a network request is initiated
- Shaka `request:end` event: emitted when a network request completes
- Shaka `bitrate:change` event: emitted when the ABR algorithm switches to a different quality variant
- Shaka `drm:session:update` event: emitted when a DRM session is updated
- Shaka `drm:expiration:updated` event: emitted when a DRM license expiration time changes
- HLS.js network adapter for telemetry collection
- HLS.js `request:start` event: emitted when a fragment, manifest, or key request is initiated
- HLS.js `request:end` event: emitted when a fragment, manifest, or key request completes
- HLS.js `bitrate:change` event: emitted when the ABR algorithm switches to a different quality variant
- `VideoEventObserver` and `ObserverRegistry`: observe native `HTMLVideoElement` events and emit `media.event` traces
- `BufferSampler`: samples buffer state on each tick
- `DecodingSampler`: samples decoded/dropped frames on each tick
- `PlaybackStateSampler`: samples playback state on each tick
- `bitrate:init` event on HLS.js and Shaka adapters: emitted once when the initial quality variant is known
- `throughputEwmaMbps` field added to `request:end` on both adapters
- `PlaybackStateSampler`: now includes `bitrateKbps`, `width`, `height`, `switchesUp`, `switchesDown`
- `NetworkSampler`: samples request counters, throughput, quality classification, and segment history
- `PlaybackTimingSampler`: accumulates playing/waiting time, join time, and startup/load timing
- `StreamInfoSampler`: captures stream metadata (container, codecs, variant count)
- `stream:info` event on Shaka adapter: emitted when stream metadata is available
