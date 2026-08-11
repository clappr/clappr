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
| `dash-shaka-playback`               | `.js`, `.min.js`, `.esm.mjs`                                                                |
| `@clappr/clappr-html5-tvs-playback` | `.js`, `.min.js`, `.esm.js`                                                                 |

hlsjs/dash `test:smoke` asserts the dist-wide `.map` inventory so missing, unexpected, and
stale maps fail CI.

**Never tag the archived `clappr/dash-shaka-playback` repo again.** jsDelivr
`gh/clappr/dash-shaka-playback@latest` resolves to that archive's tags (**2.3.6** as of
2026-08-05) and still serves tens of millions of hits/month. A new tag would migrate
that traffic onto an external-first artifact with no consumer deploy.

## Running a release

`Release` runs **only by hand** — Actions → **Release** → Run workflow. Merging to main publishes nothing.

1. Merge to main, wait for **CI** to go green on the resulting commit.
2. Dispatch **Release** with `dry_run` checked. The job summary lists every package with its current and next version; nothing is committed, tagged or published.
3. Read the table. Wrong or missing bumps are almost always commits without a conventional prefix.
4. Dispatch again with `dry_run` unchecked.

The run refuses to start unless it is on main **and** CI for that exact commit concluded `success`. A CI run still in progress is refused too, so a dispatch fired seconds after merging fails on purpose — wait and dispatch again. There is no override input; fix the cause instead.

If Validate says there is **no CI run** for the tip SHA, GitHub never created one — usually a `[skip ci]` commit (or equivalent). `contributors.yml` no longer uses that marker; for any leftover or future case, Actions → **CI** → Run workflow on `main`, wait for green, then dispatch **Release**. That is still a real CI pass on the tip, not a gate bypass.

Resolving zero publishable packages **fails** the run (green only under `dry_run`). You asked for a release, so nothing to release is a mismatch worth surfacing rather than a silent green.

| Input          | Use                                                                                  |
| -------------- | ------------------------------------------------------------------------------------ |
| `dry_run`      | Preview only. A pure modifier — combine with `publish_only` to preview that path too |
| `publish_only` | Recovery: versions and tags already landed on main, publish `package.json` as-is     |

Nothing announces a failed release: the red run in Actions is the only signal.

## GitHub Release notes

After `Release` **successfully publishes `@clappr/player` to npm**, it calls **Generate release notes**, which opens a **draft** GitHub Release anchored on `@clappr/player@*`. That tag is the public umbrella announcement.

Notes do **not** run when:

- The Release run published nothing, or only non-player packages (e.g. `@clappr/telemetry` alone)
- The run did not actually publish the player — the version was already on npm and got skipped (common on `publish_only` recovery)

You can also run Actions → **Generate release notes** manually (updates an existing draft) — that is the way to regenerate notes in the cases above. `resolve` still requires the player version on npm; aimed by hand at a git-only tag it skips with a warning.

**When the player version is missing from npm, the two paths differ on purpose:**

| Path                                           | Missing on npm                                 | Why                                                                                                                                                                  |
| ---------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Called by `Release` (`published_in_run: true`) | **Fails** → red `notes` job on the Release run | The publish already succeeded, so absence contradicts the caller's own precondition. Whether it is registry lag or a real incident, a green run would notify nobody. |
| Manual dispatch                                | Skips with a warning                           | You aimed at that tag deliberately; failing would be noise.                                                                                                          |

The registry gets ~50s (`REGISTRY_ATTEMPTS: 6`) on the Release path before it counts as missing, so the failure means something is wrong rather than npm being slow.

Not finding a version and not being able to ask are also different things: if the npm registry cannot answer at all, the notes job **fails** on both paths instead of quietly skipping the draft.

Nothing needs re-publishing for any notes failure — "Re-run failed jobs" on the Release run re-runs only the notes job.

Optional repo secret `COPILOT_GITHUB_TOKEN` (fine-grained PAT with Copilot Requests: Read) enables prose Highlights via Copilot; without it the draft uses a mechanical fallback. See [`release-notes-instructions.md`](release-notes-instructions.md) and [`scripts/generate-release-notes.sh`](scripts/generate-release-notes.sh).

**Cleanup if a draft was created for a git-only player tag** (tag pushed, npm publish failed): delete that draft GitHub Release, recover with Release `workflow_dispatch` + `publish_only`, then run **Generate release notes** manually if needed.
