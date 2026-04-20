import { emitTelemetry } from '../utils'
import { EVENT_TYPES, TELEMETRY_SOURCES, DEFAULT_VIDEO_EVENTS } from '../utils/constants'

/**
 * Listens to native `HTMLVideoElement` DOM events and emits a `media.event` telemetry trace
 * for each one. Engine-agnostic: works with Shaka, HLS.js or any other playback backend.
 *
 * Each event carries `{ name, currentTime, readyState, snapshot }`, where `snapshot` reflects
 * the last sampler tick (empty object when no sampler is active).
 *
 * Enable via `telemetry.videoState.enabled: true`. Observed events default to
 * `DEFAULT_VIDEO_EVENTS` and can be narrowed with `telemetry.videoState.videoEvents`.
 */
export default class VideoEventObserver {
  constructor(playback, container, samplerRegistry = null) {
    this._playback = playback
    this._container = container
    this._samplerRegistry = samplerRegistry

    const opts = container.options?.telemetry?.videoState || {}
    this._enabled = opts.enabled === true
    this._videoEvents = [...new Set(opts.videoEvents || DEFAULT_VIDEO_EVENTS)]

    this._eventHandlers = new Map()
  }

  bind() {
    if (!this._enabled || this._eventHandlers.size > 0) return
    this._attachVideoListeners()
  }

  _getVideoElement() {
    return this._playback?.el
  }

  _attachVideoListeners() {
    const videoEl = this._getVideoElement()
    if (!videoEl) return

    this._videoEvents.forEach((eventName) => {
      const handler = () => this._onVideoEvent(eventName)
      this._eventHandlers.set(eventName, handler)
      videoEl.addEventListener(eventName, handler, { passive: true })
    })
  }

  _detachVideoListeners() {
    const videoEl = this._getVideoElement()
    if (videoEl) {
      this._eventHandlers.forEach((handler, eventName) => {
        videoEl.removeEventListener(eventName, handler)
      })
    }
    this._eventHandlers.clear()
  }

  _onVideoEvent(eventName) {
    const videoEl = this._getVideoElement()
    if (!videoEl) return

    emitTelemetry(this._container, EVENT_TYPES.MEDIA_EVENT, {
      name: eventName,
      currentTime: videoEl.currentTime,
      readyState: videoEl.readyState,
      snapshot: this._samplerRegistry?.snapshot() ?? {}
    }, TELEMETRY_SOURCES.VIDEO_EVENT_OBSERVER)
  }

  destroy() {
    this._detachVideoListeners()
    this._playback = null
    this._container = null
    this._samplerRegistry = null
  }
}
