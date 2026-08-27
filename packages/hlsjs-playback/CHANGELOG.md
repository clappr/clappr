# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.1.0](https://github.com/clappr/clappr/compare/%40clappr%2Fhlsjs-playback%403.0.3...%40clappr%2Fhlsjs-playback%403.1.0) (2026-08-27)

### Bug Fixes

- **vite:** serve package demos as HTML entries without query suffixes in src ([ce3534d](https://github.com/clappr/clappr/commit/ce3534dfd004a34a8943ac907b74dce14a896a00))

### Features

- **hls:** add PLAYBACK_ERROR_WARNING event ([bed7502](https://github.com/clappr/clappr/commit/bed75020c68a597d7498f3f649facce06678d21b))

## [3.0.3](https://github.com/clappr/clappr/compare/%40clappr%2Fhlsjs-playback%403.0.2...%40clappr%2Fhlsjs-playback%403.0.3) (2026-08-15)

**Note:** Version bump only for package @clappr/hlsjs-playback

## [3.0.2](https://github.com/clappr/clappr/compare/%40clappr%2Fhlsjs-playback%403.0.1...%40clappr%2Fhlsjs-playback%403.0.2) (2026-08-06)

**Note:** Version bump only for package @clappr/hlsjs-playback

## [3.0.1](https://github.com/clappr/clappr/compare/%40clappr%2Fhlsjs-playback%403.0.0...%40clappr%2Fhlsjs-playback%403.0.1) (2026-08-05)

### Bug Fixes

- **dash-shaka-playback:** assert dist artifacts and clarify Shaka 3 support ([23a7b45](https://github.com/clappr/clappr/commit/23a7b45f6817c42cf27f74c783518fe499c329cf))

# [3.0.0](https://github.com/clappr/clappr/compare/%40clappr%2Fhlsjs-playback%402.0.1...%40clappr%2Fhlsjs-playback%403.0.0) (2026-08-05)

- feat(hlsjs-playback)!: stop embedding hls.js in published artifacts ([8b2e9ae](https://github.com/clappr/clappr/commit/8b2e9aee7a0a308a052a549b038f7c4af6de35ac)), closes [#2538](https://github.com/clappr/clappr/issues/2538)

### BREAKING CHANGES

- CDN and script consumers must load hls.js before
  hlsjs-playback. Bundlers that aliased dist/hlsjs-playback.external.js can
  drop the alias — the default entry is external now.

## [2.0.1](https://github.com/clappr/clappr/compare/%40clappr%2Fhlsjs-playback%402.0.0...%40clappr%2Fhlsjs-playback%402.0.1) (2026-08-05)

### Bug Fixes

- **hlsjs-playback:** honor hlsRecoverAttempts of zero ([70bded0](https://github.com/clappr/clappr/commit/70bded04576c330321173dc74bf1344c89cd7853))
- **hlsjs-playback:** treat seekPercentage(0) as start of timeline ([57db510](https://github.com/clappr/clappr/commit/57db510159fb8333b925604d04c29cb2938957fe))
- **test:** harden dist smoke coverage from review feedback ([55a558c](https://github.com/clappr/clappr/commit/55a558ce25d154823294b4aa0fa3460c3b8c77dd))

# [2.0.0](https://github.com/clappr/clappr/compare/%40clappr%2Fhlsjs-playback%401.9.13...%40clappr%2Fhlsjs-playback%402.0.0) (2026-08-04)

- feat(hlsjs-playback)!: stop embedding @clappr/core in minified UMD builds ([38fae12](https://github.com/clappr/clappr/commit/38fae1259c0d46f9a7cf6865e45557c5272cb0dd))

### Bug Fixes

- **hlsjs-playback:** address review on dead config, ESM comment and migration note ([0feb731](https://github.com/clappr/clappr/commit/0feb73194675deea35b4b0642110a37ebd875976))

### BREAKING CHANGES

- CDN consumers of `hlsjs-playback.min.js` must now load
  `@clappr/core` (or `@clappr/player`) first so a global `Clappr` exists.
  The bundler entries (`main`, `module`) and the `.external` builds are
  unchanged.

## [1.9.13](https://github.com/clappr/clappr/compare/%40clappr%2Fhlsjs-playback%401.9.12...%40clappr%2Fhlsjs-playback%401.9.13) (2026-08-04)

**Note:** Version bump only for package @clappr/hlsjs-playback

## [1.9.12](https://github.com/clappr/clappr/compare/@clappr/hlsjs-playback@1.9.11...@clappr/hlsjs-playback@1.9.12) (2026-08-01)

### Bug Fixes

- **deps:** align browserslist defaults and finish phase-1 cleanup ([65ca7ce](https://github.com/clappr/clappr/commit/65ca7cecfeaf0bad9679fe5717eed7daf79882c9))

## [1.9.11](https://github.com/clappr/clappr/compare/@clappr/hlsjs-playback@1.9.10...@clappr/hlsjs-playback@1.9.11) (2026-07-31)

**Note:** Version bump only for package @clappr/hlsjs-playback

## [1.9.10](https://github.com/clappr/clappr/compare/@clappr/hlsjs-playback@1.9.9...@clappr/hlsjs-playback@1.9.10) (2026-07-30)

**Note:** Version bump only for package @clappr/hlsjs-playback

## [1.9.9](https://github.com/clappr/clappr/compare/@clappr/hlsjs-playback@1.9.8...@clappr/hlsjs-playback@1.9.9) (2026-07-30)

**Note:** Version bump only for package @clappr/hlsjs-playback

## [1.9.8](https://github.com/clappr/clappr/compare/@clappr/hlsjs-playback@1.9.7...@clappr/hlsjs-playback@1.9.8) (2026-07-29)

**Note:** Version bump only for package @clappr/hlsjs-playback

## [1.9.7](https://github.com/clappr/clappr/compare/@clappr/hlsjs-playback@1.9.6...@clappr/hlsjs-playback@1.9.7) (2026-07-29)

**Note:** Version bump only for package @clappr/hlsjs-playback

## [1.9.6](https://github.com/clappr/clappr/compare/@clappr/hlsjs-playback@1.9.5...@clappr/hlsjs-playback@1.9.6) (2026-07-29)

### Bug Fixes

- **ci:** align package repository URLs for npm provenance ([a14cd90](https://github.com/clappr/clappr/commit/a14cd90ffe64715d691230f4a50ae3e0b0c15b9a)), closes [#2455](https://github.com/clappr/clappr/issues/2455)

## [1.9.5](https://github.com/clappr/hlsjs-playback/compare/@clappr/hlsjs-playback@1.9.4...@clappr/hlsjs-playback@1.9.5) (2026-07-29)

**Note:** Version bump only for package @clappr/hlsjs-playback

## [1.9.4](https://github.com/clappr/hlsjs-playback/compare/@clappr/hlsjs-playback@1.9.3...@clappr/hlsjs-playback@1.9.4) (2025-10-15)

**Note:** Version bump only for package @clappr/hlsjs-playback

## [1.9.3](https://github.com/clappr/hlsjs-playback/compare/@clappr/hlsjs-playback@1.9.2...@clappr/hlsjs-playback@1.9.3) (2025-10-09)

**Note:** Version bump only for package @clappr/hlsjs-playback

## [1.9.2](https://github.com/clappr/hlsjs-playback/compare/@clappr/hlsjs-playback@1.9.1...@clappr/hlsjs-playback@1.9.2) (2025-09-09)

### Bug Fixes

- **playbacks:** add eslint as dev dependencies ([fe9ce5e](https://github.com/clappr/hlsjs-playback/commit/fe9ce5e5ab0177f4745991c8d279c5bce5c6760b))

## [1.9.1](https://github.com/clappr/hlsjs-playback/compare/@clappr/hlsjs-playback@1.9.0...@clappr/hlsjs-playback@1.9.1) (2025-09-09)

**Note:** Version bump only for package @clappr/hlsjs-playback

# [1.9.0](https://github.com/clappr/hlsjs-playback/compare/@clappr/hlsjs-playback@1.8.5...@clappr/hlsjs-playback@1.9.0) (2025-09-08)

### Features

- **hls:** add video source frame rate getter ([4a6a9a7](https://github.com/clappr/hlsjs-playback/commit/4a6a9a71786caeda5f0d894140e25553fdbeb0a8))

## [1.8.5](https://github.com/clappr/hlsjs-playback/compare/@clappr/hlsjs-playback@1.8.4...@clappr/hlsjs-playback@1.8.5) (2025-09-08)

**Note:** Version bump only for package @clappr/hlsjs-playback

## [1.8.4](https://github.com/clappr/hlsjs-playback/compare/@clappr/hlsjs-playback@1.8.3...@clappr/hlsjs-playback@1.8.4) (2025-08-05)

**Note:** Version bump only for package @clappr/hlsjs-playback

## [1.8.3](https://github.com/clappr/hlsjs-playback/compare/@clappr/hlsjs-playback@1.8.2...@clappr/hlsjs-playback@1.8.3) (2025-07-02)

**Note:** Version bump only for package @clappr/hlsjs-playback

## [1.8.2](https://github.com/clappr/hlsjs-playback/compare/@clappr/hlsjs-playback@1.8.1...@clappr/hlsjs-playback@1.8.2) (2025-06-03)

**Note:** Version bump only for package @clappr/hlsjs-playback

## [1.8.1](https://github.com/clappr/hlsjs-playback/compare/@clappr/hlsjs-playback@1.8.0...@clappr/hlsjs-playback@1.8.1) (2025-05-15)

**Note:** Version bump only for package @clappr/hlsjs-playback

# [1.8.0](https://github.com/clappr/hlsjs-playback/compare/@clappr/hlsjs-playback@1.7.4...@clappr/hlsjs-playback@1.8.0) (2025-04-24)

### Features

- **hlsjs:** add liveSyncPosition getter ([04543db](https://github.com/clappr/hlsjs-playback/commit/04543db8352222de217aa281c3bb9bc354950f93))

## [1.7.4](https://github.com/clappr/hlsjs-playback/compare/@clappr/hlsjs-playback@1.7.3...@clappr/hlsjs-playback@1.7.4) (2025-01-05)

**Note:** Version bump only for package @clappr/hlsjs-playback

## [1.7.3](https://github.com/clappr/hlsjs-playback/compare/@clappr/hlsjs-playback@1.7.2...@clappr/hlsjs-playback@1.7.3) (2024-10-29)

**Note:** Version bump only for package @clappr/hlsjs-playback

## [1.7.2](https://github.com/clappr/hlsjs-playback/compare/@clappr/hlsjs-playback@1.7.1...@clappr/hlsjs-playback@1.7.2) (2024-10-29)

**Note:** Version bump only for package @clappr/hlsjs-playback

## [1.7.1](https://github.com/clappr/hlsjs-playback/compare/@clappr/hlsjs-playback@1.7.0...@clappr/hlsjs-playback@1.7.1) (2024-10-29)

**Note:** Version bump only for package @clappr/hlsjs-playback
