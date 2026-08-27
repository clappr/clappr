# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.14.4](https://github.com/clappr/clappr/compare/%40clappr%2Fplayer%400.14.3...%40clappr%2Fplayer%400.14.4) (2026-08-27)

### Bug Fixes

- **vite:** serve package demos as HTML entries without query suffixes in src ([ce3534d](https://github.com/clappr/clappr/commit/ce3534dfd004a34a8943ac907b74dce14a896a00))

## [0.14.3](https://github.com/clappr/clappr/compare/%40clappr%2Fplayer%400.14.2...%40clappr%2Fplayer%400.14.3) (2026-08-15)

**Note:** Version bump only for package @clappr/player

## [0.14.2](https://github.com/clappr/clappr/compare/%40clappr%2Fplayer%400.14.1...%40clappr%2Fplayer%400.14.2) (2026-08-06)

**Note:** Version bump only for package @clappr/player

## [0.14.1](https://github.com/clappr/clappr/compare/%40clappr%2Fplayer%400.14.0...%40clappr%2Fplayer%400.14.1) (2026-08-05)

### Bug Fixes

- **dash-shaka-playback:** assert dist artifacts and clarify Shaka 3 support ([23a7b45](https://github.com/clappr/clappr/commit/23a7b45f6817c42cf27f74c783518fe499c329cf))

# [0.14.0](https://github.com/clappr/clappr/compare/%40clappr%2Fplayer%400.13.0...%40clappr%2Fplayer%400.14.0) (2026-08-05)

- feat(hlsjs-playback)!: stop embedding hls.js in published artifacts ([8b2e9ae](https://github.com/clappr/clappr/commit/8b2e9aee7a0a308a052a549b038f7c4af6de35ac)), closes [#2538](https://github.com/clappr/clappr/issues/2538)

### Bug Fixes

- **test:** parse dist with Babel when guarding native class ([3de7895](https://github.com/clappr/clappr/commit/3de7895baf114fdda69270d5c98215b497dd497e))

### BREAKING CHANGES

- CDN and script consumers must load hls.js before
  hlsjs-playback. Bundlers that aliased dist/hlsjs-playback.external.js can
  drop the alias — the default entry is external now.

# [0.13.0](https://github.com/clappr/clappr/compare/%40clappr%2Fplayer%400.12.10...%40clappr%2Fplayer%400.13.0) (2026-08-05)

- feat(player)!: emit UMD instead of IIFE for the minified builds ([fd074d8](https://github.com/clappr/clappr/commit/fd074d8b7e288b2225a587f98b469601cac1a757))

### Bug Fixes

- **test:** declare jsdom for UMD smoke sandboxes ([9afcd38](https://github.com/clappr/clappr/commit/9afcd3800ad84d01153104330a141cd9ec3d8355))
- **test:** harden dist smoke coverage from review feedback ([55a558c](https://github.com/clappr/clappr/commit/55a558ce25d154823294b4aa0fa3460c3b8c77dd))
- **test:** load UMD smoke sandboxes via JSDOM ([e2f2be5](https://github.com/clappr/clappr/commit/e2f2be5557786f7cc5d7ce2d477f529f7d96a62c))

### BREAKING CHANGES

- when an AMD loader is present on the page, the
  minified builds no longer set the global `Clappr` (UMD defers to
  `define` instead of the previous IIFE assignment).

## [0.12.10](https://github.com/clappr/clappr/compare/%40clappr%2Fplayer%400.12.9...%40clappr%2Fplayer%400.12.10) (2026-08-04)

**Note:** Version bump only for package @clappr/player

## [0.12.9](https://github.com/clappr/clappr/compare/%40clappr%2Fplayer%400.12.8...%40clappr%2Fplayer%400.12.9) (2026-08-04)

**Note:** Version bump only for package @clappr/player

## [0.12.8](https://github.com/clappr/clappr/compare/@clappr/player@0.12.7...@clappr/player@0.12.8) (2026-08-01)

**Note:** Version bump only for package @clappr/player

## [0.12.7](https://github.com/clappr/clappr/compare/@clappr/player@0.12.6...@clappr/player@0.12.7) (2026-07-31)

**Note:** Version bump only for package @clappr/player

## [0.12.6](https://github.com/clappr/clappr/compare/@clappr/player@0.12.5...@clappr/player@0.12.6) (2026-07-30)

### Bug Fixes

- **player:** use textContent for demo editor hash payload ([8542bca](https://github.com/clappr/clappr/commit/8542bcaba9ba911ae4d5003c2c62b594b3571385))

## [0.12.5](https://github.com/clappr/clappr/compare/@clappr/player@0.12.4...@clappr/player@0.12.5) (2026-07-30)

**Note:** Version bump only for package @clappr/player

## [0.12.4](https://github.com/clappr/clappr/compare/@clappr/player@0.12.3...@clappr/player@0.12.4) (2026-07-30)

### Bug Fixes

- **player:** resolve workspace dist files to avoid CI ENOTDIR ([a3df0eb](https://github.com/clappr/clappr/commit/a3df0ebb323e2c94c88d95d55e171ec6b9aff235))

## [0.12.3](https://github.com/clappr/clappr/compare/@clappr/player@0.12.2...@clappr/player@0.12.3) (2026-07-29)

**Note:** Version bump only for package @clappr/player

## [0.12.2](https://github.com/clappr/clappr/compare/@clappr/player@0.12.1...@clappr/player@0.12.2) (2026-07-29)

**Note:** Version bump only for package @clappr/player

## [0.12.1](https://github.com/clappr/clappr/compare/@clappr/player@0.12.0...@clappr/player@0.12.1) (2026-07-29)

### Bug Fixes

- **ci:** align package repository URLs for npm provenance ([a14cd90](https://github.com/clappr/clappr/commit/a14cd90ffe64715d691230f4a50ae3e0b0c15b9a)), closes [#2455](https://github.com/clappr/clappr/issues/2455)

# [0.12.0](https://github.com/clappr/clappr/compare/@clappr/player@0.11.16...@clappr/player@0.12.0) (2026-07-29)

### Features

- add website cross-linking and fix documentation ([99f6be7](https://github.com/clappr/clappr/commit/99f6be70cbc7b7ee2b9ce1432b32a75ab461fb0a))

## [0.11.16](https://github.com/clappr/clappr/compare/@clappr/player@0.11.15...@clappr/player@0.11.16) (2025-10-15)

**Note:** Version bump only for package @clappr/player

## [0.11.15](https://github.com/clappr/clappr/compare/@clappr/player@0.11.14...@clappr/player@0.11.15) (2025-10-09)

**Note:** Version bump only for package @clappr/player

## [0.11.14](https://github.com/clappr/clappr/compare/@clappr/player@0.11.13...@clappr/player@0.11.14) (2025-09-09)

**Note:** Version bump only for package @clappr/player

## [0.11.13](https://github.com/clappr/clappr/compare/@clappr/player@0.11.12...@clappr/player@0.11.13) (2025-09-09)

**Note:** Version bump only for package @clappr/player

## [0.11.12](https://github.com/clappr/clappr/compare/@clappr/player@0.11.11...@clappr/player@0.11.12) (2025-09-08)

**Note:** Version bump only for package @clappr/player

## [0.11.11](https://github.com/clappr/clappr/compare/@clappr/player@0.11.10...@clappr/player@0.11.11) (2025-09-08)

**Note:** Version bump only for package @clappr/player

## [0.11.10](https://github.com/clappr/clappr/compare/@clappr/player@0.11.9...@clappr/player@0.11.10) (2025-08-05)

**Note:** Version bump only for package @clappr/player

## [0.11.9](https://github.com/clappr/clappr/compare/@clappr/player@0.11.8...@clappr/player@0.11.9) (2025-07-02)

**Note:** Version bump only for package @clappr/player

## [0.11.8](https://github.com/clappr/clappr/compare/@clappr/player@0.11.7...@clappr/player@0.11.8) (2025-06-03)

**Note:** Version bump only for package @clappr/player

## [0.11.7](https://github.com/clappr/clappr/compare/@clappr/player@0.11.6...@clappr/player@0.11.7) (2025-05-15)

**Note:** Version bump only for package @clappr/player

## [0.11.6](https://github.com/clappr/clappr/compare/@clappr/player@0.11.5...@clappr/player@0.11.6) (2025-04-24)

**Note:** Version bump only for package @clappr/player

## [0.11.5](https://github.com/clappr/clappr/compare/@clappr/player@0.11.4...@clappr/player@0.11.5) (2025-01-05)

**Note:** Version bump only for package @clappr/player

## [0.11.4](https://github.com/clappr/clappr/compare/@clappr/player@0.11.3...@clappr/player@0.11.4) (2024-12-19)

**Note:** Version bump only for package @clappr/player

## [0.11.3](https://github.com/clappr/clappr/compare/@clappr/player@0.11.2...@clappr/player@0.11.3) (2024-10-29)

**Note:** Version bump only for package @clappr/player

## [0.11.2](https://github.com/clappr/clappr/compare/@clappr/player@0.11.1...@clappr/player@0.11.2) (2024-10-29)

**Note:** Version bump only for package @clappr/player

## [0.11.1](https://github.com/clappr/clappr/compare/@clappr/player@0.11.0...@clappr/player@0.11.1) (2024-10-29)

**Note:** Version bump only for package @clappr/player
