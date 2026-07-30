# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 2.0.0

Marks the break from the externally-vendored `clappr-zepto` drop-in lineage.
The package is now `@clappr/zepto`, a permanent fork maintained in
[clappr/clappr](https://github.com/clappr/clappr) (`packages/clappr-zepto`),
built with Rollup to `dist/`, and no longer regenerable from upstream.

### Provenance (pre-2.0)

- **zepto:** remove resetting of read-only attribute ([af23414](https://github.com/clappr/clappr/commit/af234144954a5ee95a52df4ba0cb95e1781cd78c))
