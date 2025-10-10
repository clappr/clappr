# How to Build Plugins

Clappr supports an extensible plugin architecture that allows you to add new behaviors, UI elements, or integrations to the player.  
This guide walks through the main concepts and a simple example of how to build your own plugin.

## 1. Understanding Plugin Types

Clappr provides three main plugin categories:

- **Core Plugins**: Has access to all components of the Player. Typically used for features that need a global view or to collect information (e.g., analytics, session tracking).
- **Container Plugins**: Interacts with the `Playback` layer, allowing you to control or modify playback behavior (e.g., playback events).
- **UI Plugins**: Same as Core and Container plugins, but can also add visible components to the player interface (e.g., overlays, controls).

Each plugin class must extend the corresponding base class from `@clappr/core`.

## 2. Creating a Basic Plugin

Here’s a minimal example of a `ContainerPlugin`.  
Every plugin must define a unique `name` getter.

```js
import { ContainerPlugin } from '@clappr/core'

class MyPlugin extends ContainerPlugin {
  get name() {
    return 'my_plugin'
  }

  bindEvents() {
    this.listenTo(this.playback, Events.PLAYBACK_PLAY, this.onPlay)
  }

  onPlay() {
    console.log('Playback started!')
  }
}
```

This `name` is used internally by Clappr to register and retrieve plugins dynamically.   That means you can access your plugin instance later via the developer console:

```js
player.getPlugin('my_plugin')
```

## 3. Registering the Plugin

To activate your plugin, register it in the player configuration.  
Plugins are grouped by type (`core`, `container`, `ui`).

```js
import { Player } from '@clappr/core'

new Player({
  source: 'https://clappr.io/media/video.mp4',
  parentId: '#player',
  plugins: {
    container: [MyPlugin],
  },
})
```

## 4. Accessing Player Options

All plugins can access player-level configuration through `this.options`. This is useful for passing initialization parameters or custom data.

```js
class MyPlugin extends ContainerPlugin {
  constructor(container) {
    super(container)
    console.log('Custom config:', this.options.myPlugin)
  }
}
```

```js
new Player({
  source: 'https://clappr.io/media/video.mp4',
  parentId: '#player',
  plugins: { container: [MyPlugin] },
  myPlugin: {
    debug: true,
  },
})
```

## 5. Loading External Scripts (Optional)

If your plugin depends on external libraries (for example, analytics or ads), you can dynamically load them. A common approach is to use [`load-script-promise`](https://www.npmjs.com/package/load-script-promise):

```bash
yarn add load-script-promise
```

```js
import { loadScript } from 'load-script-promise'

class ExternalIntegration extends ContainerPlugin {
  constructor(container) {
    super(container)
    loadScript('https://example.com/script.js')
      .then(() => {
        this.externalLib = window.ExternalLib
      })
  }
}
```

## 6. Example: A Simple Metrics Plugin

Here’s a more concrete example of a plugin that sends playback events to an analytics service.

```js
import { ContainerPlugin, Events } from '@clappr/core'

class MetricsPlugin extends ContainerPlugin {
  get name() {
    return 'metrics_plugin'
  }

  bindEvents() {
    this.listenTo(this.playback, Events.PLAYBACK_PLAY, this.onPlay)
    this.listenTo(this.playback, Events.PLAYBACK_PAUSE, this.onPause)
  }

  onPlay() {
    this.track('play')
  }

  onPause() {
    this.track('pause')
  }

  track(event) {
    console.log(`Tracking event: ${event}`)
  }
}
```

Clappr has a rich set of events you can listen to.  
See the full list in the [Events](./events.md) section.

## 7. Summary

By creating plugins, you can:

- Extend player functionality without modifying the core operation
- React to playback or container events
- Integrate with external systems like analytics, ads, or custom UIs
- Keep your code modular and reusable

For more details, check out:

- [Architecture Overview](./architecture.md)
