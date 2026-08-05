# Clappr Agent Guidelines

> **Project:** Clappr — open-source, plugin-oriented HTML5 media player for the web.
> **Central constraint:** Lerna + Yarn workspaces monorepo. Performance matters (streaming, DOM, bundle size).

**Authority for style and types:** ESLint, Prettier, package configs, and CI — do not repeat what they already enforce.

## Project structure

Monorepo managed by Lerna with Yarn workspaces. Each package has its own `package.json`.

- `apps/`
  - `apps/clappr.io/` — Documentation site (Docusaurus); canonical docs in `docs/`
- `packages/`
  - `packages/player/` — Main player bundle (`@clappr/player`), public entry point
  - `packages/clappr-core/` — Core architecture (`@clappr/core`): Player, Core, Container, Playback
  - `packages/clappr-plugins/` — Official plugins (`@clappr/plugins`)
  - `packages/clappr-zepto/` — Lightweight DOM utilities for Clappr UI
  - `packages/hlsjs-playback/` — HLS via hls.js (`@clappr/hlsjs-playback`)
  - `packages/dash-shaka-playback/` — MPEG-DASH via Shaka Player
  - `packages/html5-tvs-playback/` — HTML5 playback for HbbTV smart TVs (`@clappr/clappr-html5-tvs-playback`)
  - `packages/clappr-telemetry/` — Telemetry helpers
- `test/` — Shared dist smoke helpers (e.g. ES5 subclassing contract for #2540)

## Dependencies and shared config

**Rule:** a dependency used by **2+ packages** lives in the root `devDependencies`. Single-use stays in the owning package. Packages are not expected to install in isolation — the monorepo is the only entry.

Shared config locations:

| Config | Path | Notes |
|--------|------|-------|
| Babel | `babel.base.json` | Packages extend via `.babelrc` |
| Jest | `jest.config.base.js` | Packages extend via spread; override `transform` when not resolving sibling ESM source |
| Browserslist | `.browserslistrc` | Monorepo ES5 floor (`> 0.5%` / `last 2 versions` / `not ie <= 11`). Must keep at least one target without `class` support (do **not** add `not dead` — see #2540) because published `dist/` is subclassed by ES5 third-party plugins. Same query drives autoprefixer legacy prefixes required by `html5-tvs-playback`. `apps/clappr.io` keeps its own field |
| ESLint | `eslint.config.js` | Flat config; `eslint` + `@eslint/js` declared at the root. Root `yarn lint` runs `lerna run lint` so package configs (`*.js` at package root) are covered |

Conscious exceptions:

- **`clappr-zepto` `.babelrc`** — stays standalone. Babel merges preset arrays and cannot clear the inherited `modules: false`, which would change zepto's Rollup build.
- **`jest.config.base.js` sibling-source transform** — default for packages that resolve `@clappr/core` / `@clappr/zepto` to source via `moduleNameMapper`: `babelrc: false` / `configFile: false`, presets from `babel.base.json` `env.test` with `modules: 'commonjs'` forced. **`clappr-zepto` and `clappr-telemetry`** override to plain `babel-jest` (no sibling ESM mapping; zepto's standalone `.babelrc` remains for Rollup).
- **Deferred to later phases** — `@rollup/plugin-replace`, `rollup-plugin-serve` (major divergence).
- **`rollup-plugin-analyzer`** — single-use in `clappr-plugins` (`bundle-check`); declared in that package, not the root.
- **Bundle analysis** — `bundle-check` / `ANALYZE_BUNDLE=true` runs `rollup-plugin-visualizer` on the product UMD output → `dist/bundle-stats.html`. Do not reintroduce `rollup-plugin-filesize` or `rollup-plugin-sizes`.
- **Browserslist vs Babel targets** — putting the JS floor in `babel.base.json` `targets` and returning `browserslist` only to `html5-tvs-playback` for CSS was evaluated and rejected: clearer separation, but two sources of truth for browser targets.

The Jest family (`jest`, `babel-jest`, `jest-environment-jsdom`, `jest-mock-console`) is fully unified at the root; no package declares a Jest dependency of its own. Test imports use the full path to the module file (`../base/events/events`), matching `src/` — there is no directory-named resolution in the Jest configs.

When adding a shared tool, put it at the root and remove per-package copies. Prefer this over Yarn `resolutions` when the packages do not need to install alone.

## Publishing

Packages published to npm (via the Release workflow / Trusted Publishers):

| Package | npm name |
|---------|----------|
| `packages/clappr-core/` | `@clappr/core` |
| `packages/clappr-plugins/` | `@clappr/plugins` |
| `packages/clappr-telemetry/` | `@clappr/telemetry` |
| `packages/player/` | `@clappr/player` |
| `packages/hlsjs-playback/` | `@clappr/hlsjs-playback` |
| `packages/dash-shaka-playback/` | `dash-shaka-playback` |
| `packages/html5-tvs-playback/` | `@clappr/clappr-html5-tvs-playback` |

Packages that do **not** publish to npm:

| Package | Reason |
|---------|--------|
| `packages/clappr-zepto/` | Internal only (`private: true`); bundled into `@clappr/core` |
| `apps/clappr.io/` | Docs site (`clappr-docs`, already `private: true`) |

### Sourcemaps

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

| Package | Maps shipped |
|---------|--------------|
| `@clappr/core` | `clappr-core.js`, `.min.js`, `.esm.js` |
| `@clappr/plugins` | `clappr-plugins.js`, `.min.js`, `.esm.js` |
| `@clappr/telemetry` | `clappr-telemetry.js`, `.min.js`, `.esm.js` |
| `@clappr/player` | `clappr.js`, `.min.js`, `clappr.plainhtml5.min.js` — not `clappr.plainhtml5.js` (demo-only) |
| `@clappr/hlsjs-playback` | `.js`, `.min.js`, `.esm.js` |
| `dash-shaka-playback` | `.js`, `.min.js`, `.esm.mjs` |
| `@clappr/clappr-html5-tvs-playback` | `.js`, `.min.js`, `.esm.js` |

hlsjs/dash `test:smoke` asserts the dist-wide `.map` inventory so missing, unexpected, and
stale maps fail CI.

**Never tag the archived `clappr/dash-shaka-playback` repo again.** jsDelivr
`gh/clappr/dash-shaka-playback@latest` resolves to that archive's tags (**2.3.6** as of
2026-08-05) and still serves tens of millions of hits/month. A new tag would migrate
that traffic onto an external-first artifact with no consumer deploy.

### Releasing

`Release` runs **only by hand** — Actions → **Release** → Run workflow. Merging to main publishes nothing.

1. Merge to main, wait for **CI** to go green on the resulting commit.
2. Dispatch **Release** with `dry_run` checked. The job summary lists every package with its current and next version; nothing is committed, tagged or published.
3. Read the table. Wrong or missing bumps are almost always commits without a conventional prefix.
4. Dispatch again with `dry_run` unchecked.

The run refuses to start unless it is on main **and** CI for that exact commit concluded `success`. A CI run still in progress is refused too, so a dispatch fired seconds after merging fails on purpose — wait and dispatch again. There is no override input; fix the cause instead.

If Validate says there is **no CI run** for the tip SHA, GitHub never created one — usually a `[skip ci]` commit (or equivalent). `contributors.yml` no longer uses that marker; for any leftover or future case, Actions → **CI** → Run workflow on `main`, wait for green, then dispatch **Release**. That is still a real CI pass on the tip, not a gate bypass.

Resolving zero publishable packages **fails** the run (green only under `dry_run`). You asked for a release, so nothing to release is a mismatch worth surfacing rather than a silent green.

| Input | Use |
|---|---|
| `dry_run` | Preview only. A pure modifier — combine with `publish_only` to preview that path too |
| `publish_only` | Recovery: versions and tags already landed on main, publish `package.json` as-is |

Nothing announces a failed release: the red run in Actions is the only signal.

### GitHub Release notes

After `Release` **successfully publishes `@clappr/player` to npm**, it calls **Generate release notes**, which opens a **draft** GitHub Release anchored on `@clappr/player@*`. That tag is the public umbrella announcement.

Notes do **not** run when:

- The Release run published nothing, or only non-player packages (e.g. `@clappr/telemetry` alone)
- The run did not actually publish the player — the version was already on npm and got skipped (common on `publish_only` recovery)

You can also run Actions → **Generate release notes** manually (updates an existing draft) — that is the way to regenerate notes in the cases above. `resolve` still requires the player version on npm; aimed by hand at a git-only tag it skips with a warning.

**When the player version is missing from npm, the two paths differ on purpose:**

| Path | Missing on npm | Why |
|---|---|---|
| Called by `Release` (`published_in_run: true`) | **Fails** → red `notes` job on the Release run | The publish already succeeded, so absence contradicts the caller's own precondition. Whether it is registry lag or a real incident, a green run would notify nobody. |
| Manual dispatch | Skips with a warning | You aimed at that tag deliberately; failing would be noise. |

The registry gets ~50s (`REGISTRY_ATTEMPTS: 6`) on the Release path before it counts as missing, so the failure means something is wrong rather than npm being slow.

Not finding a version and not being able to ask are also different things: if the npm registry cannot answer at all, the notes job **fails** on both paths instead of quietly skipping the draft.

Nothing needs re-publishing for any notes failure — "Re-run failed jobs" on the Release run re-runs only the notes job.

Optional repo secret `COPILOT_GITHUB_TOKEN` (fine-grained PAT with Copilot Requests: Read) enables prose Highlights via Copilot; without it the draft uses a mechanical fallback. See `.github/release-notes-instructions.md` and `.github/scripts/generate-release-notes.sh`.

**Cleanup if a draft was created for a git-only player tag** (tag pushed, npm publish failed): delete that draft GitHub Release, recover with Release `workflow_dispatch` + `publish_only`, then run **Generate release notes** manually if needed.

## Tooling

### Package manager

- `yarn install` — Install dependencies
- `yarn add <package> -W` — Root dependencies
- `yarn workspace <package-name> add <dependency>` — Package-specific dependency
- `lerna run <command>` — All packages
- `lerna run <command> --scope=<package-name>` — Single package
- `yarn release` — Version packages (`lerna version`); npm publish is done by the Release workflow via OIDC

### Running projects

- Player dev: `yarn dev` → `@clappr/player` (http://localhost:8080)
- Core: `lerna run start --scope=@clappr/core`
- Plugins: `lerna run start --scope=@clappr/plugins`
- Docs site: `yarn workspace clappr-docs start`

### Build, lint, test

- `yarn build` — Build player and dependencies (dev / contributor path)
- `yarn build:dist` — Run each package's `release` script (minimized artifacts CI also verifies). Matches `prepublishOnly` for all seven publishable packages
- `yarn lint` / `yarn lint:fix` — ESLint
- `yarn format` / `yarn format:check` — Prettier
- `yarn test` — `lerna run test --no-bail` across packages that define a `test` script (unit only)
- `yarn test:smoke` — dist artifact smoke tests (`hlsjs-playback`, `dash-shaka-playback`, `clappr-zepto`); run after `yarn build:dist` (CI does). Locally: `yarn build:dist && yarn test:smoke`
- Per package: `lerna run test --scope=@clappr/plugins`, `@clappr/hlsjs-playback`, `dash-shaka-playback`, etc.
- Single file: `lerna run test --scope=@clappr/core -- path/to/test.test.js`
- From package root: `jest src/path/to/test.test.js`, `--testNamePattern`, `--watch`, `--coverage`

## Documentation (load on demand)

Do not read these by default — open only when the task involves the topic.

| Topic | Path |
|-------|------|
| Architecture | `apps/clappr.io/docs/architecture.md` |
| Getting started | `apps/clappr.io/docs/getting_started.md` |
| Player API | `apps/clappr.io/docs/api.md` |
| Plugin development | `apps/clappr.io/docs/guides/how_to_build_plugins.md` |
| Events | `apps/clappr.io/docs/guides/events.md` |
| Supported formats | `apps/clappr.io/docs/supported_formats.md` |
| FAQ | `apps/clappr.io/docs/faq.md` |
| HLS / DASH / Smart TV playback | `packages/hlsjs-playback/README.md`, `packages/dash-shaka-playback/README.md`, `packages/html5-tvs-playback/README.md` |

### Code map

- Player: `packages/clappr-core/src/components/player/`
- Core: `packages/clappr-core/src/components/core/`
- Container: `packages/clappr-core/src/components/container/`
- Playback base: `packages/clappr-core/src/base/playback/`
- Media control: `packages/clappr-plugins/src/plugins/media_control/`

Plugin types: `CorePlugin`, `UICorePlugin`, `ContainerPlugin`, `UIContainerPlugin`, `Playback`, `MediaControl` — see architecture doc.

## Judgment boundaries

**NEVER**

- Commit secrets, tokens, or `.env` files
- Use `eval()` or the `Function` constructor
- Store tokens in `localStorage` (prefer httpOnly cookies or memory)
- Use `innerHTML` with untrusted user input
- Log or expose sensitive data in console, errors, or URLs

**ASK**

- Before adding new dependencies (bundle size, maintenance, alternatives)
- Before large or risky changes in shared packages (`@clappr/core`, `@clappr/plugins`, `@clappr/player`)

**ALWAYS**

- Conventional commits: `<type>(<scope>): <description>` (English descriptions)
- `async/await` over `.then()`; `Promise.all()` for parallel work
- Clean up: timers, listeners, observers, connections, media elements, Blob URLs
- Prefer composition over inheritance where it fits the codebase
- Test behavior, not implementation; independent tests with `afterEach`/`afterAll` cleanup

## Conventions

**Naming:** `is*` / `has*` / `can*` for booleans; verbs for methods; nouns for classes; `_prefix` for private; `UPPER_SNAKE_CASE` for constants.

**Architecture:** Prefer classes for player components; single responsibility; methods under ~30 lines; early returns; favor composition.

**Imports:** ES6 imports; prefer relative paths within a package.

**DOM & performance:** Batch DOM reads/writes; cache references; event delegation; debounce/throttle resize; passive touch/scroll listeners; `requestAnimationFrame`; prefer `transform`/`opacity`.

**Security:** Sanitize user content per context (HTML, JS, URL); validate keys when merging untrusted objects; CSRF on state-changing requests; validate `postMessage` `origin`; use specific `targetOrigin` (never `"*"`); validate URLs before redirects.

**TypeScript (when used):** Avoid `any`; use `unknown`; interfaces for shapes; type guards; keep types close to usage.

**Comments:** Explain "why", not "what".
