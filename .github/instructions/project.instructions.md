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
- `lerna publish` - Publish packages (independent versioning)

# Release notes

After `Release` successfully publishes `@clappr/player` to npm, it calls **Generate release notes**, which creates a **draft** GitHub Release anchored on `@clappr/player@*`. Manual dispatch (Actions → **Generate release notes**) can regenerate/update a draft.

This is intentional: `@clappr/player` is the public umbrella announcement. Empty Release runs, non-player-only publishes, runs where the player version was already on npm (nothing new published), and git tags that never reached npm do **not** create a GitHub Release — npm + package CHANGELOGs remain the source of truth for those. Manual dispatch is the way to regenerate notes in those cases.

If a draft was opened for a player tag that is not on npm: delete the draft, recover with Release `publish_only`, then re-run **Generate release notes** if needed.

Optional repo secret for prose Highlights:

- `COPILOT_GITHUB_TOKEN` — fine-grained PAT with **Copilot Requests: Read** (token owner needs an active Copilot license). Without it, the draft still ships with a mechanical Highlights fallback.
- Style guide: `.github/release-notes-instructions.md`
- Logic: `.github/scripts/generate-release-notes.sh`

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
