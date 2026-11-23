---
applyTo: '**'
---

# Project Structure

This project is a monorepo managed by Lerna using Yarn workspaces. Each package has its own `package.json` file.

- `apps/` - Contains applications:
  - `apps/clappr.io/` - Documentation website (Docusaurus)
- `packages/` - Contains all packages:
  - `packages/player/` - Main player bundle (`@clappr/player`)
  - `packages/clappr-core/` - Core player components (`@clappr/core`)
  - `packages/clappr-plugins/` - Main player plugins (`@clappr/plugins`)
  - `packages/clappr-telemetry/` - Playback telemetry and metrics (`@clappr/telemetry`)
  - `packages/clappr-zepto/` - Zepto.js build for Clappr
  - `packages/dash-shaka-playback/` - DASH playback with Shaka Player
  - `packages/hlsjs-playback/` - HLS playback with hls.js (`@clappr/hlsjs-playback`)
  - `packages/html5-tvs-playback/` - HTML5 playback for HbbTV smart TVs (`@clappr/clappr-html5-tvs-playback`)

# Package Manager

Use Yarn with Lerna.

- `yarn install` - Install dependencies
- `yarn add <package> -W` - Add root dependencies
- `yarn workspace <package-name> add <dependency>` - Add dependency to specific package
- `lerna run <command>` - Run command in all packages
- `lerna run <command> --scope=<package-name>` - Run command in specific package

# Release

`Release` is **manual only** (Actions → **Release** → Run workflow); merging to main publishes nothing. It refuses to run unless it is on main and CI for that exact commit concluded `success` — a CI run still in progress is refused too. There is no override. If Validate finds no CI run (e.g. a past `[skip ci]` tip), Actions → **CI** → Run workflow on `main`, then re-dispatch Release.

Each run releases **one package** (`package` input) with the `bump` you choose (`patch`, `minor`, `major`). Ritual: merge → wait for CI green → dispatch with `preview` checked (the default) to see the version and the changelog section → dispatch again with it unchecked. The changelog section lists the title of each merged PR that touched the package. The `@clappr/player` run fails while `@clappr/core`, `@clappr/plugins` or `@clappr/hlsjs-playback` has unreleased PRs. If a tag is on main but its version is missing from npm, dispatching the same package again only publishes it.

Failures are not announced anywhere — the red run in Actions is the only signal.

# Release notes

`Release notes` is a separate **manual** workflow (Actions → **Release notes** → Run workflow); `Release` never calls it. It drafts a **draft** GitHub Release anchored on a `@clappr/player@*` tag (`player_tag` input, empty = latest) with the section `Release` wrote to the Player changelog. A draft is updated, a published release is left untouched, and a tag without a changelog section fails.

# Running Projects

## Player Development

- `yarn dev` - Start player development server (`@clappr/player`)
- `lerna run start --scope=@clappr/core` - Start core development server
- `lerna run start --scope=@clappr/plugins` - Start plugins development server

## Documentation Site

- `yarn workspace clappr-docs start` - Start documentation site (Docusaurus)

## Individual Packages

Each package has its own `start` script. Use `lerna run start --scope=<package-name>` to run a specific package's dev server.

# Conventional Commits

- Always use Conventional commits for new commits
- Format: `<type>(<scope>): <description>`
