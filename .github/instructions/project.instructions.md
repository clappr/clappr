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
  - `packages/clappr-zepto/` - Zepto.js build for Clappr
  - `packages/dash-shaka-playback/` - DASH playback with Shaka Player
  - `packages/hlsjs-playback/` - HLS playback with hls.js (`@clappr/hlsjs-playback`)

# Package Manager

Use Yarn with Lerna.

- `yarn install` - Install dependencies
- `yarn add <package> -W` - Add root dependencies
- `yarn workspace <package-name> add <dependency>` - Add dependency to specific package
- `lerna run <command>` - Run command in all packages
- `lerna run <command> --scope=<package-name>` - Run command in specific package
- `lerna publish` - Publish packages (independent versioning)

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
