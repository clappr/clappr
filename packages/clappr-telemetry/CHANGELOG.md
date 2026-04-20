# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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