<p align="center">
  <a href="https://badge.fury.io/js/%40clappr%2Fplayer"><img src="https://badge.fury.io/js/%40clappr%2Fplayer.svg"></a>
  <a href="https://bundlephobia.com/result?p=@clappr/player@latest"><img src="https://img.shields.io/bundlephobia/min/@clappr/player"></a>
  <a href="https://app.travis-ci.com/github/clappr/clappr"><img src="https://api.travis-ci.com/clappr/clappr.svg?branch=dev"></a>
  <a href="https://github.com/clappr/clappr/blob/dev/LICENSE"><img src="https://img.shields.io/badge/license-BSD--3--Clause-blue.svg"></a>
  <a href="https://www.jsdelivr.com/package/npm/@clappr/player"><img src="https://img.shields.io/jsdelivr/npm/hm/@clappr/player?color=orange" alt="jsDelivr hits"></a>
</p>

<h1 align="center">
  <a href="http://clappr.io">
    <img src="https://cloud.githubusercontent.com/assets/244265/6373134/a845eb50-bce7-11e4-80f2-592ba29972ab.png" height="100">
  </a>
  <br>
  Clappr
</h1>

<p align="center">
  <b>Clappr</b> is an extensible, plugin-oriented, HTML5-first media player for the web.  
  It provides a modular architecture to build powerful playback experiences with ease.
</p>

## 🚀 Getting Started

Install via npm or yarn:

```bash
yarn add @clappr/player
# or
npm install @clappr/player
```

## 📦 Project Structure

This repository uses a monorepo layout:

| Directory | Description |
| ---------- | ------------ |
| [`/apps`](/apps/) | Applications such as [clappr.io](http://clappr.io/) and documentation site |
| [`/packages`](/packages/) | Core packages (e.g. `@clappr/player`, plugins, utilities) |
| [`/packages/player`](/packages/player) | The main **Clappr Player** package. Exposes the public API and serves as the entry point for embedding the player in web apps. |
| [`/packages/clappr-core`](/packages/clappr-core) | Contains the **core architecture** of the player — including components such as `Core`, `Container`, and `Playback` abstractions. |
| [`/packages/clappr-plugins`](/packages/clappr-plugins) | Official **plugin collection**, providing ready-to-use extensions (e.g., UI features, analytics integrations). |
| [`/packages/clappr-zepto`](/packages/clappr-zepto) | Lightweight **DOM utility layer**, a modernized fork of Zepto tailored for Clappr’s internal UI rendering. |
| [`/packages/hlsjs-playback`](/packages/hlsjs-playback) | Playback module that adds support for **HLS streams** using [hls.js](https://github.com/video-dev/hls.js). |
| [`/packages/dash-shaka-playback`](/packages/dash-shaka-playback) | Playback module that enables **MPEG-DASH** streaming via [Shaka Player](https://github.com/google/shaka-player). |

## 📚 Documentation

For the latest guides, examples, and architecture overviews, visit the resources below:

- [**Getting Started**](./apps/clappr.io/docs/getting_started.md): quick setup and integration examples.
- [**Architecture Overview**](./apps/clappr.io/docs/architecture.md): explains how the player, core, containers, and plugins interact.
- [**Plugin Development Guide**](./apps/clappr.io/docs/PLUGIN_GUIDE.md): how to create and register custom plugins.
- [**Changelog**](https://github.com/clappr/clappr/releases): highlights of each version and breaking changes.

Legacy references:

- [**API Docs (v0.2.x)**](https://clappr.github.io/): auto-generated class documentation for older versions.  
  *Note: this API reference is outdated and mainly useful for historical context.*

## 🧑‍💻 Local Development

Clone the repository and run:

```bash
# Install dependencies
yarn install

# Start the development environment
yarn dev

# Open in your browser
http://localhost:8080
