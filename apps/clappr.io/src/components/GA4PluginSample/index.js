import React from 'react'
import { Player, ContainerPlugin, Events } from '@clappr/core'
import { loadScript } from 'load-script-promise'

const GA4 = ({ children }) => {
  function gtagScript(measurementId) {
    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    gtag('js', new Date())
    gtag('config', measurementId)
    return gtag
  }
  class GA4Plugin extends ContainerPlugin {
    constructor(container) {
      super(container)
      loadScript(
        `https://www.googletagmanager.com/gtag/js?id=${this.options.ga.measurementId}`
      ).then(() => {
        this.gtag = gtagScript(this.options.ga.measurementId)
      })
    }

    get name() {
      return 'ga4_metrics'
    }

    bindEvents() {
      this.listenTo(this.container.playback, Events.PLAYBACK_PLAY, this.onPlay)
      this.listenTo(
        this.container.playback,
        Events.PLAYBACK_PAUSE,
        this.onPause
      )
    }

    onPlay() {
      this.gtag('event', 'PLAY', { ...this.options.ga.dimensions })
    }

    onPause() {
      this.gtag('event', 'PAUSE', { ...this.options.ga.dimensions })
    }
  }

  window.player = new Player({
    source: 'http://clappr.io/media/video.mp4',
    parentId: '#player',
    plugins: {
      container: [GA4Plugin],
    },
    ga: {
      measurementId: 'G-123456',
      dimensions: {
        video_title: 'Jornal Nacional',
        duration: 20302,
      },
    },
  })

  return (
    <div>
      <div id="player">{children}</div>
    </div>
  )
}

export default GA4
