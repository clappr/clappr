# Clappr Agent Guidelines

> **Project:** Clappr — open-source, plugin-oriented HTML5 media player for the web.
> **Central constraint:** Lerna + Yarn workspaces monorepo. Performance matters (streaming, DOM, bundle size).
>
> `CLAUDE.md` is a symlink to this file.

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

| Config       | Path                     | Notes                                                                                                                                                                                                                                                                                                                                                                     |
| ------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Babel        | `babel.base.json`        | Build preset with `modules: false`; the Vite factory applies it to published `dist/`                                                                                                                                                                                                                                                                                      |
| Vite         | `vite.config.base.mjs`   | Shared library-mode factory; each package has `vite.config.mjs`                                                                                                                                                                                                                                                                                                           |
| Vitest       | `vitest.config.base.mjs` | Shared test config (`jsdom`, `globals`, coverage v8); each package has `vitest.config.mjs`                                                                                                                                                                                                                                                                                |
| Browserslist | `.browserslistrc`        | Monorepo ES5 floor (`> 0.5%` / `last 2 versions` / `not ie <= 11`). Must keep at least one target without `class` support (do **not** add `not dead` — see #2540) because published `dist/` is subclassed by ES5 third-party plugins. Same query drives autoprefixer legacy prefixes required by `clappr-core` and `clappr-plugins`. `apps/clappr.io` keeps its own field |
| ESLint       | `eslint.config.js`       | Flat config; `eslint` + `@eslint/js` declared at the root. Root `yarn lint` runs `lerna run lint` so package configs (`*.js` at package root) are covered                                                                                                                                                                                                                 |
| Knip         | `knip.json`              | Single root config for all workspaces; run only from the repo root (`yarn knip`) so hoisted deps resolve. Specific workspace keys replace the `packages/*` glob (they do not merge) — repeat shared keys when overriding                                                                                                                                                  |

Exceptions worth knowing:

- **Bundle analysis:** every `bundle-check` / `ANALYZE_BUNDLE=true` uses `rollup-plugin-visualizer`.

When adding a shared tool, put it at the root and remove per-package copies. Prefer this over Yarn `resolutions`.

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
- `yarn knip` — Unused files, exports, and dependencies (root `knip.json`; must run from the repo root)
- `yarn format` / `yarn format:check` — Prettier
- `yarn test` — Vitest via `lerna run test --no-bail` across packages that define a `test` script, then a root `vitest run --dir test` pass
- `yarn test:smoke` — dist artifact smoke tests (`hlsjs-playback`, `dash-shaka-playback`, `clappr-zepto`); run after `yarn build:dist` (CI does). Locally: `yarn build:dist && yarn test:smoke`
- Per package: `lerna run test --scope=@clappr/plugins`, `@clappr/hlsjs-playback`, `dash-shaka-playback`, etc.
- Single file: `lerna run test --scope=@clappr/core -- path/to/test.test.js`
- From package root: `vitest run src/path/to/test.test.js`, `--testNamePattern`, `--watch`, `--coverage`

## Documentation (load on demand)

Do not read these by default — open only when the task involves the topic.

| Topic                          | Path                                                                                                                   |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Publishing / releasing         | `.github/RELEASING.md` — published packages, sourcemap policy, Release workflow, release notes                         |
| Architecture                   | `apps/clappr.io/docs/architecture.md`                                                                                  |
| Getting started                | `apps/clappr.io/docs/getting_started.md`                                                                               |
| Player API                     | `apps/clappr.io/docs/api.md`                                                                                           |
| Plugin development             | `apps/clappr.io/docs/guides/how_to_build_plugins.md`                                                                   |
| Events                         | `apps/clappr.io/docs/guides/events.md`                                                                                 |
| Supported formats              | `apps/clappr.io/docs/supported_formats.md`                                                                             |
| FAQ                            | `apps/clappr.io/docs/faq.md`                                                                                           |
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
- When staging and committing, read and execute `.agents/skills/commit/SKILL.md` (branch check, conventional format, English messages)

## Pull requests & code review

- For pull-request review, code review, or any structured pre-merge feedback on a diff: read and execute `.agents/skills/code-review/SKILL.md` — it defines the severities and the output template.

## Skills

When a task matches a skill, read its `SKILL.md` and execute the steps directly — do not invoke it through any tool. Do this before answering or running git, including "quick" PR reviews. If multiple skills apply, run them in a sensible order (for example, code-review before commit).

- `.agents/skills/code-review/SKILL.md` — complete code review.
- `.agents/skills/commit/SKILL.md` — staging and commit with conventional commits.

## Conventions

**Naming:** `is*` / `has*` / `can*` for booleans; verbs for methods; nouns for classes; `_prefix` for private; `UPPER_SNAKE_CASE` for constants.

**Architecture:** Prefer classes for player components; single responsibility; methods under ~30 lines; early returns; favor composition.

**Imports:** ES6 imports; prefer relative paths within a package.

**DOM & performance:** Batch DOM reads/writes; cache references; event delegation; debounce/throttle resize; passive touch/scroll listeners; `requestAnimationFrame`; prefer `transform`/`opacity`.

**Security:** Sanitize user content per context (HTML, JS, URL); validate keys when merging untrusted objects; CSRF on state-changing requests; validate `postMessage` `origin`; use specific `targetOrigin` (never `"*"`); validate URLs before redirects.

**TypeScript (when used):** Avoid `any`; use `unknown`; interfaces for shapes; type guards; keep types close to usage.

**Comments:** Explain "why", not "what".
