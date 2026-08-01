# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.1.2](https://github.com/clappr/clappr/compare/@clappr/zepto@2.1.1...@clappr/zepto@2.1.2) (2026-08-01)

**Note:** Version bump only for package @clappr/zepto

## [2.1.1](https://github.com/clappr/clappr/compare/@clappr/zepto@2.1.0...@clappr/zepto@2.1.1) (2026-07-30)

### Bug Fixes

- **zepto:** constrain handler index to number for CodeQL ([765b155](https://github.com/clappr/clappr/commit/765b155e315c8269a5a46e8234d430ed4490d62d)), closes [#118](https://github.com/clappr/clappr/issues/118)
- **zepto:** deny prototype keys before handler delete ([28c1073](https://github.com/clappr/clappr/commit/28c107316e229bc6e4715147e18406c975d67c7e))
- **zepto:** guard containers lookup against prototype chain ([e423c7f](https://github.com/clappr/clappr/commit/e423c7f05d0b7c041bbb9f9869f203f866a1b17c))
- **zepto:** guard handler delete against computed key ([327ce40](https://github.com/clappr/clappr/commit/327ce401fb2d2c4dbb4699de288485cd99e7ba07)), closes [#109](https://github.com/clappr/clappr/issues/109)
- **zepto:** make fragmentRE linear ([36e37f8](https://github.com/clappr/clappr/commit/36e37f827876eff8fba1fdfd82eec81e51d9125b))
- **zepto:** make tagExpanderRE linear and quote-aware ([7c84c00](https://github.com/clappr/clappr/commit/7c84c00b39a166f0324ead554b5acc363e709d28)), closes [#113](https://github.com/clappr/clappr/issues/113) [#111](https://github.com/clappr/clappr/issues/111) [#111](https://github.com/clappr/clappr/issues/111)
- **zepto:** remove scripts structurally in $.fn.load ([fcbac5d](https://github.com/clappr/clappr/commit/fcbac5d76643597182f6c2bef256e5e407f79b2a)), closes [#112](https://github.com/clappr/clappr/issues/112) [#110](https://github.com/clappr/clappr/issues/110)
- **zepto:** rewrite JSONP url without regex ([353da98](https://github.com/clappr/clappr/commit/353da9808ba134f4697186d79e252a25e0b40288)), closes [#117](https://github.com/clappr/clappr/issues/117)
- **zepto:** use null-prototype handlers map and numeric zid ([7a46542](https://github.com/clappr/clappr/commit/7a46542bfca084a80b9dec232ecd83bb66a03471))

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
