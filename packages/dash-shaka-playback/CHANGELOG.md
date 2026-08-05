# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.1.3](https://github.com/clappr/clappr/compare/dash-shaka-playback%404.1.2...dash-shaka-playback%404.1.3) (2026-08-05)

### Bug Fixes

- **dash-shaka-playback:** assert dist artifacts and clarify Shaka 3 support ([23a7b45](https://github.com/clappr/clappr/commit/23a7b45f6817c42cf27f74c783518fe499c329cf))
- **dash-shaka-playback:** require shaka.Player in the load-time guard ([9b191f4](https://github.com/clappr/clappr/commit/9b191f41f617afcf9694cd8ba0ef1319238ad4c0))

## [4.1.2](https://github.com/clappr/clappr/compare/dash-shaka-playback%404.1.1...dash-shaka-playback%404.1.2) (2026-08-05)

**Note:** Version bump only for package dash-shaka-playback

## [4.1.1](https://github.com/clappr/clappr/compare/dash-shaka-playback%404.1.0...dash-shaka-playback%404.1.1) (2026-08-05)

### Bug Fixes

- **test:** harden dist smoke coverage from review feedback ([55a558c](https://github.com/clappr/clappr/commit/55a558ce25d154823294b4aa0fa3460c3b8c77dd))

# [4.1.0](https://github.com/clappr/clappr/compare/dash-shaka-playback%404.0.0...dash-shaka-playback%404.1.0) (2026-08-04)

### Features

- **dash-shaka-playback:** accept shaka-player v3 and v4 as peers ([f96d6f4](https://github.com/clappr/clappr/commit/f96d6f4843770543521c43b1144280fa0e8f989e))

# [4.0.0](https://github.com/clappr/clappr/compare/dash-shaka-playback%403.7.2...dash-shaka-playback%404.0.0) (2026-08-04)

- feat(dash-shaka-playback)!: add ESM build with shaka-player as a peer dependency ([7cfa67d](https://github.com/clappr/clappr/commit/7cfa67d87b360d1cbb0756400c336cb187a91d45))

### Bug Fixes

- **dash-shaka-playback:** address review on peer, ESM and test hygiene ([2a91878](https://github.com/clappr/clappr/commit/2a91878021e7e5286949a42c6f1d027802c8458f))
- **dash-shaka-playback:** drop LevelSelector from demos against modern player ([7627b9e](https://github.com/clappr/clappr/commit/7627b9e7d38960924cd2f042c8dd391678b625ef))
- **dash-shaka-playback:** drop unused player binding in demo pages ([f847d9a](https://github.com/clappr/clappr/commit/f847d9ab888798a3877bfc9555d36d59647532ee))
- **dash-shaka-playback:** import core from @clappr/core instead of unresolvable clappr ([4e3959c](https://github.com/clappr/clappr/commit/4e3959cf0b9a3e9a19fa98eef70785f873167ac5))
- **dash-shaka-playback:** read shaka version from shaka.Player ([4e29c16](https://github.com/clappr/clappr/commit/4e29c1609099c526fbccf2b3a8c4f0d8180b0e7a))
- **dash-shaka-playback:** satisfy eslint for rollup config and smoke test ([2168420](https://github.com/clappr/clappr/commit/216842096e0abb13c1b507badf7d52735d2fc8cc))

### BREAKING CHANGES

- bundler consumers now receive the ESM entry with
  shaka-player external and must install it. The UMD CDN builds are unchanged.

## [3.7.2](https://github.com/clappr/clappr/compare/dash-shaka-playback@3.7.1...dash-shaka-playback@3.7.2) (2026-08-01)

### Bug Fixes

- **deps:** align browserslist defaults and finish phase-1 cleanup ([65ca7ce](https://github.com/clappr/clappr/commit/65ca7cecfeaf0bad9679fe5717eed7daf79882c9))

## [3.7.1](https://github.com/clappr/clappr/compare/dash-shaka-playback@3.7.0...dash-shaka-playback@3.7.1) (2026-07-29)

### Bug Fixes

- **ci:** align package repository URLs for npm provenance ([a14cd90](https://github.com/clappr/clappr/commit/a14cd90ffe64715d691230f4a50ae3e0b0c15b9a)), closes [#2455](https://github.com/clappr/clappr/issues/2455)

# [3.7.0](https://github.com/clappr/dash-shaka-playback/compare/dash-shaka-playback@3.6.3...dash-shaka-playback@3.7.0) (2026-07-29)

### Bug Fixes

- **webpack:** correct devtool option from 'source-maps' to 'source-map' ([b27b1f6](https://github.com/clappr/dash-shaka-playback/commit/b27b1f69f6d770db4ee0b4898d442f24082ebd1e))

### Features

- **actions:** improve gh actions release ([6aeb74f](https://github.com/clappr/dash-shaka-playback/commit/6aeb74f7c9a40e816ae870e3bc7298b5aa5fc00e))

## [3.6.3](https://github.com/clappr/dash-shaka-playback/compare/dash-shaka-playback@3.6.2...dash-shaka-playback@3.6.3) (2025-09-09)

### Bug Fixes

- **playbacks:** add eslint as dev dependencies ([fe9ce5e](https://github.com/clappr/dash-shaka-playback/commit/fe9ce5e5ab0177f4745991c8d279c5bce5c6760b))

## [3.6.2](https://github.com/clappr/dash-shaka-playback/compare/dash-shaka-playback@3.6.1...dash-shaka-playback@3.6.2) (2025-09-09)

**Note:** Version bump only for package dash-shaka-playback

## [3.6.1](https://github.com/clappr/dash-shaka-playback/compare/dash-shaka-playback@3.6.0...dash-shaka-playback@3.6.1) (2025-09-09)

### Bug Fixes

- **package:** remove eslint as dependency ([2d8b935](https://github.com/clappr/dash-shaka-playback/commit/2d8b93547785044fd39c92e60504ce1cb012839a))

# [3.6.0](https://github.com/clappr/dash-shaka-playback/compare/dash-shaka-playback@3.5.1...dash-shaka-playback@3.6.0) (2025-09-08)

### Features

- **shaka-player:** add video source frame rate getter ([72fff70](https://github.com/clappr/dash-shaka-playback/commit/72fff70a800f450cc77bdc29fb232c34391093d4))

## [3.5.1](https://github.com/clappr/dash-shaka-playback/compare/dash-shaka-playback@3.5.0...dash-shaka-playback@3.5.1) (2025-08-05)

**Note:** Version bump only for package dash-shaka-playback
