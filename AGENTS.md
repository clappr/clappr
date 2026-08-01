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

## Dependencies and shared config

**Rule:** a dependency used by **2+ packages** lives in the root `devDependencies`. Single-use stays in the owning package. Packages are not expected to install in isolation — the monorepo is the only entry.

Shared config locations:

| Config | Path | Notes |
|--------|------|-------|
| Babel | `babel.base.json` | Packages extend via `.babelrc` |
| Browserslist | `.browserslistrc` | Matches autoprefixer `defaults` (`> 0.5%` / `last 2 versions` / `Firefox ESR` / `not dead`); `apps/clappr.io` keeps its own field |
| ESLint | `eslint.config.js` | Flat config; `eslint` + `@eslint/js` declared at the root. Root `yarn lint` runs `lerna run lint` so package configs (`*.js` at package root) are covered |

Conscious exceptions:

- **`clappr-zepto` `.babelrc`** — stays standalone. Babel merges preset arrays and cannot clear the inherited `modules: false`, which would change zepto's Rollup build.
- **`dash-shaka-playback` `.babelrc`** — extends the base and overrides `modules: "commonjs"` plus `add-module-exports`.
- **`clappr-core` Jest transform** — uses `babelrc: false` / `configFile: false`, but reads presets from `babel.base.json` `env.test` (with `modules: 'commonjs'` forced). `env.test` targets `node: current` so the root browserslist does not under-transpile tests.
- **Deferred to later phases** — Jest family (`jest`, `babel-jest`, `jest-environment-jsdom`, `jest-mock-console`); `@rollup/plugin-replace`, `rollup-plugin-filesize`, `rollup-plugin-serve` (major divergence).

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
- `yarn build:dist` — Run each package's `release` script (minimized artifacts CI also verifies). For 6 of 7 publishable packages this matches `prepublishOnly`; `dash-shaka-playback` uses `yarn dist` (`lint && build && release`) instead — same webpack output, with package lint already covered by root `yarn lint`
- `yarn lint` / `yarn lint:fix` — ESLint
- `yarn format` / `yarn format:check` — Prettier
- `yarn test` — Tests for `@clappr/core` (root default)
- Per package: `lerna run test --scope=@clappr/plugins`, `@clappr/hlsjs-playback`, etc.
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
