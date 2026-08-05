# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.15.0](https://github.com/clappr/clappr/compare/%40clappr%2Fcore%400.14.8...%40clappr%2Fcore%400.15.0) (2026-08-05)

- feat(core)!: emit UMD instead of IIFE for the minified build ([a4a92f2](https://github.com/clappr/clappr/commit/a4a92f245b094abbd217196292e59bda344cc534))

### Bug Fixes

- **test:** declare jsdom for UMD smoke sandboxes ([9afcd38](https://github.com/clappr/clappr/commit/9afcd3800ad84d01153104330a141cd9ec3d8355))
- **test:** harden dist smoke coverage from review feedback ([55a558c](https://github.com/clappr/clappr/commit/55a558ce25d154823294b4aa0fa3460c3b8c77dd))
- **test:** load UMD smoke sandboxes via JSDOM ([e2f2be5](https://github.com/clappr/clappr/commit/e2f2be5557786f7cc5d7ce2d477f529f7d96a62c))

### BREAKING CHANGES

- when an AMD loader is present on the page, the
  minified build no longer sets the global `Clappr` (UMD defers to
  `define` instead of the previous IIFE assignment).

## [0.14.8](https://github.com/clappr/clappr/compare/%40clappr%2Fcore%400.14.7...%40clappr%2Fcore%400.14.8) (2026-08-04)

**Note:** Version bump only for package @clappr/core

## [0.14.7](https://github.com/clappr/clappr/compare/@clappr/core@0.14.6...@clappr/core@0.14.7) (2026-08-01)

### Bug Fixes

- **deps:** align browserslist defaults and finish phase-1 cleanup ([65ca7ce](https://github.com/clappr/clappr/commit/65ca7cecfeaf0bad9679fe5717eed7daf79882c9))

## [0.14.6](https://github.com/clappr/clappr/compare/@clappr/core@0.14.5...@clappr/core@0.14.6) (2026-07-31)

**Note:** Version bump only for package @clappr/core

## [0.14.5](https://github.com/clappr/clappr/compare/@clappr/core@0.14.4...@clappr/core@0.14.5) (2026-07-30)

**Note:** Version bump only for package @clappr/core

## [0.14.4](https://github.com/clappr/clappr/compare/@clappr/core@0.14.3...@clappr/core@0.14.4) (2026-07-30)

### Bug Fixes

- **zepto:** address PR review — source aliases, housekeeping, coverage ([7748136](https://github.com/clappr/clappr/commit/77481369c26d68b62da44d0e1691d7d9a43e5f09))

## [0.14.3](https://github.com/clappr/clappr/compare/@clappr/core@0.14.2...@clappr/core@0.14.3) (2026-07-29)

**Note:** Version bump only for package @clappr/core

## [0.14.2](https://github.com/clappr/clappr/compare/@clappr/core@0.14.1...@clappr/core@0.14.2) (2026-07-29)

**Note:** Version bump only for package @clappr/core

## [0.14.1](https://github.com/clappr/clappr/compare/@clappr/core@0.14.0...@clappr/core@0.14.1) (2026-07-29)

### Bug Fixes

- **ci:** align package repository URLs for npm provenance ([a14cd90](https://github.com/clappr/clappr/commit/a14cd90ffe64715d691230f4a50ae3e0b0c15b9a)), closes [#2455](https://github.com/clappr/clappr/issues/2455)

# [0.14.0](https://github.com/clappr/clappr-core/compare/@clappr/core@0.13.2...@clappr/core@0.14.0) (2026-07-29)

### Bug Fixes

- **core:** handle fullscreen blocked by permissions policy ([d65ac1f](https://github.com/clappr/clappr-core/commit/d65ac1f87710342c1d0e2aef4bd3e8d9690972a7))
- **player:** prevent memory leak by cleaning up event listeners on destroy ([b55b035](https://github.com/clappr/clappr-core/commit/b55b035006e014ed6a874d1a99f2057c84f6d973))
- **security:** correct useless regex escapes in os_data.js ([9ac5e0c](https://github.com/clappr/clappr-core/commit/9ac5e0c6fed9082f5d42d256dcdcd0d598b7df46))
- **security:** remove useless regexp character escapes in browser detection ([1f0ad6f](https://github.com/clappr/clappr-core/commit/1f0ad6fdb028e6d414f4ebed965b3bdb8251192b))

### Features

- **telemetry:** scaffold telemetry package with shaka adapter ([f154ce0](https://github.com/clappr/clappr-core/commit/f154ce07a9a81c1cba703b758f40e09651fc956d))

## [0.13.2](https://github.com/clappr/clappr-core/compare/@clappr/core@0.13.1...@clappr/core@0.13.2) (2025-10-15)

**Note:** Version bump only for package @clappr/core

## [0.13.1](https://github.com/clappr/clappr-core/compare/@clappr/core@0.13.0...@clappr/core@0.13.1) (2025-10-09)

**Note:** Version bump only for package @clappr/core

# [0.13.0](https://github.com/clappr/clappr-core/compare/@clappr/core@0.12.1...@clappr/core@0.13.0) (2025-09-08)

### Features

- **playback:** add video source frame rate getter ([cbcfc7a](https://github.com/clappr/clappr-core/commit/cbcfc7a5c1b3ae6179b795dcfc6e98d49c7cc981))

## [0.12.1](https://github.com/clappr/clappr-core/compare/@clappr/core@0.12.0...@clappr/core@0.12.1) (2025-08-05)

### Bug Fixes

- **loader:** fix shadow variable ([2129c36](https://github.com/clappr/clappr-core/commit/2129c36e2821ac4d674c1689add8be6580f72a18))

# [0.12.0](https://github.com/clappr/clappr-core/compare/@clappr/core@0.11.5...@clappr/core@0.12.0) (2025-07-02)

### Features

- add CONTAINER_OPTIONS_WILL_CHANGE event to notify before options change ([4dbeac5](https://github.com/clappr/clappr-core/commit/4dbeac5ebcba6f2ff12a93a43e70e9cda7ae982f))
- add CORE_OPTIONS_WILL_CHANGE event to track configuration changes ([a355c50](https://github.com/clappr/clappr-core/commit/a355c50f2db1ad146fa73a067e404f64fde57f34))

## [0.11.5](https://github.com/clappr/clappr-core/compare/@clappr/core@0.11.4...@clappr/core@0.11.5) (2025-05-15)

**Note:** Version bump only for package @clappr/core

## [0.11.4](https://github.com/clappr/clappr-core/compare/@clappr/core@0.11.3...@clappr/core@0.11.4) (2025-01-05)

### Bug Fixes

- **core:** use playback element when no inner video tag is available ([c7fcec9](https://github.com/clappr/clappr-core/commit/c7fcec9bfda181095e4af88eed882498aafe38fb))

## [0.11.3](https://github.com/clappr/clappr-core/compare/@clappr/core@0.11.2...@clappr/core@0.11.3) (2024-10-29)

**Note:** Version bump only for package @clappr/core

## [0.11.2](https://github.com/clappr/clappr-core/compare/@clappr/core@0.11.1...@clappr/core@0.11.2) (2024-10-29)

### Bug Fixes

- add types to release ([287103c](https://github.com/clappr/clappr-core/commit/287103c543c2b1343cfed95efdb98abc34bd1d99))

## [0.11.1](https://github.com/clappr/clappr-core/compare/@clappr/core@0.11.0...@clappr/core@0.11.1) (2024-10-29)

**Note:** Version bump only for package @clappr/core
