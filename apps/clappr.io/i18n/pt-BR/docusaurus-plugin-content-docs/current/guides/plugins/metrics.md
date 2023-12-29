# Criando um plugin de métricas

Criando um plugin integrado ao GA4

:::info Você vai aprender

- Entender o que é um plugin de Container
- Integrar com scripts de terceiros
- Tracking de eventos do playback

:::

Antes de qualquer coisa é importante ter uma propriedade criada no GA4.
[Como criar uma propriedade no GA4](https://support.google.com/analytics/answer/9744165?hl=pt-BR#zippy=%2Cneste-artigo)

## 1 Criando o plugin

```js
import { ContainerPlugin } from '@clappr/core'

class GA4 extends ContainerPlugin {
    get name() {
        return 'ga4_metrics'
    }
}
```

## 2 Carregando o script GTAG

Você precisa carregar o script do Google Analytics (gtag) e atribuir o objeto global no seu plugin.

Existem várias formas de carregar um script, neste tutorial vamos usar a lib `load-script-promise`. Para instalar no projeto execute o comando:


```bash
npm install load-script-promise
```

Carregue o script a partir do `constructor`
A função `gtagScript` é da [documentação do Google](https://developers.google.com/tag-platform/gtagjs/install)

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

## 3. Tracking de eventos

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

## 4 Options

`this.options` pode ser acessado em qualquer plugin

## Usando um plugin

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
