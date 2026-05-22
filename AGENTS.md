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
  - `packages/clappr-telemetry/` — Telemetry helpers

## Tooling

### Package manager

- `yarn install` — Install dependencies
- `yarn add <package> -W` — Root dependencies
- `yarn workspace <package-name> add <dependency>` — Package-specific dependency
- `lerna run <command>` — All packages
- `lerna run <command> --scope=<package-name>` — Single package
- `yarn release` — Publish (`lerna publish`, independent versioning)

### Running projects

- Player dev: `yarn dev` → `@clappr/player` (http://localhost:8080)
- Core: `lerna run start --scope=@clappr/core`
- Plugins: `lerna run start --scope=@clappr/plugins`
- Docs site: `yarn workspace clappr-docs start`

### Build, lint, test

- `yarn build` — Build player and dependencies
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
| HLS / DASH playback | `packages/hlsjs-playback/README.md`, `packages/dash-shaka-playback/README.md` |

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
