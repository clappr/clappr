# @clappr/zepto

Permanent fork of [Zepto.js](https://github.com/madrobby/zepto) v1.2.0 used by Clappr
(`Clappr.$`). Modules included: `zepto`, `ajax`, `callbacks`, `deferred`, `event`, `ie`,
`selector`.

This package is **not regenerated** from upstream. The source in `src/zepto.js` is maintained
in this repository (including Clappr-specific patches). Do not reintroduce a clone/build
script that overwrites it.

Internal only (`private: true`); consumed by `@clappr/core` and inlined into its published
bundle. Version **2.0.0** marks the identity break from the old vendored `clappr-zepto@0.x`
lineage (new name, owned source, Rollup `dist/` entry) — not a rewrite of Zepto's API.

## Build

```shell
yarn build
```

Runs Rollup and writes UMD + ESM outputs to `dist/`. There is no minified artifact here —
minification is `@clappr/core`'s responsibility.

## Test

```shell
yarn test
```

## License

MIT — see [LICENSE](./LICENSE) (Thomas Fuchs / Zepto original copyright).
