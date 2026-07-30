# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 2.1.0 (2026-07-30)

### Bug Fixes

- **zepto:** address PR review — source aliases, housekeeping, coverage ([7748136](https://github.com/clappr/clappr/commit/77481369c26d68b62da44d0e1691d7d9a43e5f09))
- **zepto:** load Rollup config as CommonJS ([7486b9a](https://github.com/clappr/clappr/commit/7486b9ac1c87e6c12b5baf4f1cad74fcd6cf8454))
- **zepto:** remove resetting of read-only attribute ([af23414](https://github.com/clappr/clappr/commit/af234144954a5ee95a52df4ba0cb95e1781cd78c))

### Features

- **clappr-zepto:** create d.ts file ([5aba14a](https://github.com/clappr/clappr/commit/5aba14a436d892c13fb18effdecede9cced1a3c7))

## 2.0.0

Marks the break from the externally-vendored `clappr-zepto` drop-in lineage.
The package is now `@clappr/zepto`, a permanent fork maintained in
[clappr/clappr](https://github.com/clappr/clappr) (`packages/clappr-zepto`),
built with Rollup to `dist/`, and no longer regenerable from upstream.

### Provenance (pre-2.0)

- **zepto:** remove resetting of read-only attribute ([af23414](https://github.com/clappr/clappr/commit/af234144954a5ee95a52df4ba0cb95e1781cd78c))
