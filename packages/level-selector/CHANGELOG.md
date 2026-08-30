# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 1.1.0 (2026-08-30)

### Bug Fixes

- **level-selector:** clear stale control on playback reload ([32d98c8](https://github.com/clappr/clappr/commit/32d98c87c4e030baf19269e3d16f39601a1517fb))
- **level-selector:** drop stale selection and control when levels change ([1cffc8a](https://github.com/clappr/clappr/commit/1cffc8af8d1e33a43dad0522c32e15d3aef3c346))
- **level-selector:** drop unused demo player binding ([5e4e944](https://github.com/clappr/clappr/commit/5e4e94414d5981d17caa4c28b60282d2eb9bf8f9))

### Features

- **level-selector:** add media-control aligned styles ([32d6538](https://github.com/clappr/clappr/commit/32d6538a88ad8e44ecec88913e52cf22b4301bda))
- **level-selector:** add quality menu template ([e63f7dc](https://github.com/clappr/clappr/commit/e63f7dc00bb2374a6f5614c1145ce500b9db2f07))
- **level-selector:** add UICorePlugin skeleton ([b7eac3e](https://github.com/clappr/clappr/commit/b7eac3ecf641928d24e4bdf44061f1af7ce452ed))
- **level-selector:** apply levelSelectorConfig labels and hooks ([b06cc0a](https://github.com/clappr/clappr/commit/b06cc0a8453b1407c3055a64fd547bb8145e9d20))
- **level-selector:** render quality control for ABR levels ([1f52517](https://github.com/clappr/clappr/commit/1f52517e2afe0e26aab864909c28361b084859ce))
- **level-selector:** select auto or explicit quality ([d45249e](https://github.com/clappr/clappr/commit/d45249ed5d6893afe25852581b6fa1205ccebca2))

# [1.0.0](https://github.com/clappr/clappr/tree/main/packages/level-selector) (2026-08-30)

### Features

- Initial release of `@clappr/level-selector` as the official quality picker plugin
- Port of the archived level-selector plugin with media-control-aligned styling
- `levelSelectorConfig` support for `title`, `labels`, `labelCallback`, and `onLevelsAvailable`
- Published UMD, minified, and ESM artifacts with dist smoke coverage
