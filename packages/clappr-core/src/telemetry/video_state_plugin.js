import ContainerPlugin from '../base/container_plugin/container_plugin'
import Events from '../base/events/events'
import { emitTelemetry } from './helpers'
import { TelemetryEventTypes } from './constants'

/**
 * Default video events to observe from the HTMLVideoElement.
 * Excludes play/pause since those are already covered by Container events.
 */
const DEFAULT_VIDEO_EVENTS = [
  'waiting',
  'playing',
  'stalled',
  'seeking',
  'seeked',
  'ended',
  'canplay',
  'canplaythrough',
  'loadedmetadata',
  'loadeddata',
  'error',
  'emptied',
  'suspend',
  'abort',
]

const DEFAULT_SAMPLE_INTERVAL_MS = 1000

/**
 * VideoStatePlugin
 *
 * Observes HTMLVideoElement events and periodically samples media state.
 * Emits canonical telemetry events independent of the underlying player (HLS.js / Shaka).
 *
 * Events emitted:
 * - media.event   — when a relevant video DOM event fires
 * - media.state.sample — periodic snapshot of video element state
 */
export default class VideoStatePlugin extends ContainerPlugin {
  get name() { return 'video-state-telemetry' }
  get supportedVersion() { return { min: VERSION } }

  constructor(container) {
    super(container)

    const telemetryOpts = container.options?.telemetry?.videoState || {}

    this._enabled = telemetryOpts.enabled !== false
    this._sampleIntervalMs = telemetryOpts.sampleIntervalMs || DEFAULT_SAMPLE_INTERVAL_MS
    this._debugMode = telemetryOpts.debugMode || false
    this._videoEvents = telemetryOpts.videoEvents || DEFAULT_VIDEO_EVENTS

    this._sampleTimerId = null
    this._eventHandlers = new Map()
  }

  bindEvents() {
    this.listenTo(this.container, Events.CONTAINER_READY, this._onContainerReady)
    this.listenToOnce(this.container, Events.CONTAINER_DESTROYED, this._onDestroy)
  }

  _onContainerReady() {
    if (!this._enabled) return
    this._attachVideoListeners()
    this._startSampling()
  }

  _getVideoElement() {
    return this.container?.playback?.el
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
    if (!videoEl) return

    this._eventHandlers.forEach((handler, eventName) => {
      videoEl.removeEventListener(eventName, handler)
    })
    this._eventHandlers.clear()
  }

  _onVideoEvent(eventName) {
    const videoEl = this._getVideoElement()
    if (!videoEl) return

    emitTelemetry(this.container, TelemetryEventTypes.MEDIA_EVENT, {
      name: eventName,
      currentTime: videoEl.currentTime,
      readyState: videoEl.readyState,
    }, this.name)
  }

  _startSampling() {
    this._stopSampling()
    this._sampleTimerId = setInterval(() => this._emitStateSample(), this._sampleIntervalMs)
  }

  _stopSampling() {
    if (this._sampleTimerId !== null) {
      clearInterval(this._sampleTimerId)
      this._sampleTimerId = null
    }
  }

  _emitStateSample() {
    const videoEl = this._getVideoElement()
    if (!videoEl) return

    console.debug(`[VideoStatePlugin] Emitting state sample: currentTime=${videoEl.currentTime.toFixed(2)}s, readyState=${videoEl.readyState}, networkState=${videoEl.networkState}, paused=${videoEl.paused}, playbackRate=${videoEl.playbackRate}`) // Debug log

    emitTelemetry(this.container, TelemetryEventTypes.MEDIA_STATE_SAMPLE, {
      currentTime: videoEl.currentTime,
      readyState: videoEl.readyState,
      networkState: videoEl.networkState,
      paused: videoEl.paused,
      playbackRate: videoEl.playbackRate,
    }, this.name)
  }

  _onDestroy() {
    this.destroy()
  }

  destroy() {
    this._stopSampling()
    this._detachVideoListeners()
    super.destroy()
  }
}

VideoStatePlugin.type = 'container'
