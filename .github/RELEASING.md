# Releasing

Operational runbook for publishing Clappr packages to npm and drafting the GitHub Release.
Code and convention guidance lives in [`AGENTS.md`](../AGENTS.md).

## Published packages

Packages published to npm (via the Release workflow / Trusted Publishers):

| Package                         | npm name                            |
| ------------------------------- | ----------------------------------- |
| `packages/clappr-core/`         | `@clappr/core`                      |
| `packages/clappr-plugins/`      | `@clappr/plugins`                   |
| `packages/clappr-telemetry/`    | `@clappr/telemetry`                 |
| `packages/player/`              | `@clappr/player`                    |
| `packages/hlsjs-playback/`      | `@clappr/hlsjs-playback`            |
| `packages/level-selector/`      | `@clappr/level-selector`            |
| `packages/dash-shaka-playback/` | `dash-shaka-playback`               |
| `packages/html5-tvs-playback/`  | `@clappr/clappr-html5-tvs-playback` |

`packages/clappr-zepto/` (bundled into `@clappr/core`) and `apps/clappr.io/` are `private: true`
and never publish.

## Sourcemaps

An artifact in `dist/` gets a sourcemap **iff** it is referenced by `main` / `module` /
`exports`, **or** documented as a consumer entry point, **or** minified.

Rationale:

- **Package entry points** (`main` / `module` / `exports`) and **documented consumer
  entry points** (e.g. deep `./dist/*` paths exposed via package `exports` that bundlers
  import by path) are what consumers load and debug — maps belong with them.
- **Minified** output is hard to read without a map; keep maps even when the unminified
  sibling is demo-only and has none (e.g. `clappr.plainhtml5.min.js`).
- Everything else (demo-only unminified bundles, leftover files in `dist/`) ships no map.
  `release` scripts wipe `dist/` first so stale maps cannot reach npm.

`clappr-zepto` is `private: true` and outside this policy. The sourcemap inventory is
enforced by each package's `test:smoke` (see [#2542](https://github.com/clappr/clappr/issues/2542)).

| Package                             | Maps shipped                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------------------- |
| `@clappr/core`                      | `clappr-core.js`, `.min.js`, `.esm.js`                                                      |
| `@clappr/plugins`                   | `clappr-plugins.js`, `.min.js`, `.esm.js`                                                   |
| `@clappr/telemetry`                 | `clappr-telemetry.js`, `.min.js`, `.esm.js`                                                 |
| `@clappr/player`                    | `clappr.js`, `.min.js`, `clappr.plainhtml5.min.js` — not `clappr.plainhtml5.js` (demo-only) |
| `@clappr/hlsjs-playback`            | `.js`, `.min.js`, `.esm.js`                                                                 |
| `@clappr/level-selector`            | `.js`, `.min.js`, `.esm.js`                                                                 |
| `dash-shaka-playback`               | `.js`, `.min.js`, `.esm.mjs`                                                                |
| `@clappr/clappr-html5-tvs-playback` | `.js`, `.min.js`, `.esm.js`                                                                 |

Each publishable package's `test:smoke` asserts its dist-wide `.map` inventory so missing,
unexpected, and stale maps fail CI (`clappr-zepto` is outside this policy).

**Never tag the archived `clappr/dash-shaka-playback` repo again.** jsDelivr
`gh/clappr/dash-shaka-playback@latest` resolves to that archive's tags (**2.3.6** as of
2026-08-05) and still serves tens of millions of hits/month. A new tag would migrate
that traffic onto an external-first artifact with no consumer deploy.

## Running a release

`Release` runs **only by hand** — Actions → **Release** → Run workflow. Merging to main publishes nothing.

Each run releases **one package** with the bump you choose.

1. Merge to main, wait for **CI** to go green on the resulting commit.
2. Dispatch **Release** with the `package` and `bump` you want, leaving `preview` checked (the default). The job summary shows the version change and the changelog section; nothing is committed, tagged or published.
3. Read the plan. The section lists one line per merged PR that touched the package, taken from the PR title.
4. Dispatch again with `preview` unchecked. The run commits `chore(release): <tag>`, pushes the commit and then the tag, and publishes to npm.

| Input     | Use                                                                   |
| --------- | --------------------------------------------------------------------- |
| `package` | The package to release (default `@clappr/player`)                     |
| `bump`    | `patch`, `minor` or `major` (default `patch`)                         |
| `preview` | On by default. Plan and stop; every step that changes something skips |

The run refuses to start unless it is on main **and** CI for that exact commit concluded `success`. A CI run still in progress is refused too, so a dispatch fired seconds after merging fails on purpose — wait and dispatch again. There is no override input; fix the cause instead.

If Validate says there is **no CI run** for the tip SHA, GitHub never created one — usually a `[skip ci]` commit (or equivalent). For any such case, Actions → **CI** → Run workflow on `main`, wait for green, then dispatch **Release**. That is still a real CI pass on the tip, not a gate bypass.

A package with no merged PR since its last tag fails the run (`Nothing to release`): you asked for a release, so nothing to release is a mismatch worth surfacing rather than a silent green.

### Releasing the Player

`@clappr/player` bundles `@clappr/core` (with `clappr-zepto`), `@clappr/plugins` and `@clappr/hlsjs-playback`. The Player run **fails** while any of them has PRs merged since its own last tag, naming the package and the PRs. Release those first, then the Player. The Player section lists the version of each bundled package before and now, and every PR since the previous Player tag with the packages it touched.

### Recovering a failed publish

If the tag is on main but the version is missing from npm, dispatch the same package again. The plan sees the tag without the version on npm and only publishes it; the `bump` is ignored.

Nothing announces a failed release: the red run in Actions is the only signal.

## GitHub Release notes

`Release notes` is a separate workflow, **manual only** — Actions → **Release notes** → Run workflow. `Release` never calls it, so releasing a package never drafts anything on its own.

Run it after the Player is released. It reads the section `Release` wrote to `packages/player/CHANGELOG.md` for the chosen Player tag and opens a **draft** GitHub Release anchored on that `@clappr/player@*` tag.

| Input        | Use                                                       |
| ------------ | --------------------------------------------------------- |
| `player_tag` | Tag to draft notes for. Empty means the latest Player tag |

| Situation                         | Result                                              |
| --------------------------------- | --------------------------------------------------- |
| No GitHub Release for the tag     | A draft is created from the changelog section       |
| A draft already exists            | Its body is replaced with the current section       |
| The release is already published  | Left untouched, with a warning                      |
| The changelog has no such section | The run fails with `No changelog section for <tag>` |

Edit the draft by hand before publishing: it carries the changelog section as written, with no generated prose.
