# Creating a metrics plugin

Creating a plugin integrated with GA4

:::info You will learn

- Understand what a Container plugin is
- Integrating with third-party scripts
- Tracking playback events

:::

Before anything else, it's important to have a property created in GA4.
[Como criar uma propriedade no GA4](https://support.google.com/analytics/answer/9744165?hl=pt-BR#zippy=%2Cneste-artigo)

## 1. Creating the plugin

```js
import { ContainerPlugin } from '@clappr/core'

class GA4 extends ContainerPlugin {
    get name() {
        return 'ga4_metrics'
    }
}
```

## 2. Loading the GTAG script

You need to load the Google Analytics script (gtag) and assign the global object to your plugin.

There are several ways to load a script, in this tutorial we will use the lib `load-script-promise`. To install it in your project, run the command:


```bash
npm install load-script-promise
```

Load the script from `constructor`
The `gtagScript` function is from [Google documentation](https://developers.google.com/tag-platform/gtagjs/install)

```js
import { ContainerPlugin } from '@clappr/core'
import { loadScript } from 'load-script-promise'

function gtagScript(measurementId) {
    window.dataLayer = window.dataLayer || []
    function gtag() {
        window.dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', measurementId)
    return gtag
}

const MEASUREMENT_ID = 'G-123456'

class GA4 extends ContainerPlugin {
    // highlight-start
    constructor(container) {
        super(container)
        loadScript('https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}')
            .then(() => {
                this.gtag = gtagScript(MEASUREMENT_ID)
            })
    }
    // highlight-end

    // ...
}
```

## 3. Event tracking

```js
  bindEvents() {
    this.listenTo(this.playback, Events.PLAYBACK_PLAY, this.onPlay)
    this.listenTo(this.playback, Events.PLAYBACK_PAUSE, this.onPause)
  }

  onPlay() {
    this.gtag('event', 'PLAY', { ...options.ga.dimensions })
  }

  onPause() {
    this.gtag('event', 'PAUSE', { ...options.ga.dimensions })
  }

```

## 4. Options

`this.options` can be accessed from any plugin

## 5. Using the plugin

```js
new Player({
  source: "http://clappr.io/media/video.mp4",
  parentId: "#player",
  // highlight-start
  plugins: {
    container: [GA4],
  },
  ga: {
    dimension: {
        video_title: 'Jornal Nacional',
        duration: 20302
    }
  }
  // highlight-end
});
```
