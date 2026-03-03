import ContainerPlugin from '../base/container_plugin/container_plugin'
import Events from '../base/events/events'
import { emitTelemetry, getBufferAhead, getBufferedRanges } from './helpers'
import { TelemetryEventTypes } from './constants'

const DEFAULT_SAMPLE_INTERVAL_MS = 1000

/**
 * BufferSamplePlugin
 *
 * Periodically samples the HTMLVideoElement buffer state and emits
 * canonical telemetry events. Works identically regardless of the
 * underlying player (HLS.js, Shaka, native).
 *
 * Events emitted:
 * - mse.buffer.sample — periodic buffer health snapshot
 */
export default class BufferSamplePlugin extends ContainerPlugin {
  get name() { return 'buffer-sample-telemetry' }
  get supportedVersion() { return { min: VERSION } }

  constructor(container) {
    super(container)

    const telemetryOpts = container.options?.telemetry?.bufferSample || {}

    this._enabled = telemetryOpts.enabled !== false
    this._sampleIntervalMs = telemetryOpts.sampleIntervalMs || DEFAULT_SAMPLE_INTERVAL_MS
    this._includeRanges = telemetryOpts.includeRanges !== false
    this._debugMode = telemetryOpts.debugMode || false

    this._sampleTimerId = null
  }

  bindEvents() {
    this.listenTo(this.container, Events.CONTAINER_READY, this._onContainerReady)
    this.listenToOnce(this.container, Events.CONTAINER_DESTROYED, this._onDestroy)
  }

  _onContainerReady() {
    if (!this._enabled) return
    this._startSampling()
  }

  _getVideoElement() {
    return this.container?.playback?.el
  }

  _startSampling() {
    this._stopSampling()
    this._sampleTimerId = setInterval(() => this._emitBufferSample(), this._sampleIntervalMs)
  }

  _stopSampling() {
    if (this._sampleTimerId !== null) {
      clearInterval(this._sampleTimerId)
      this._sampleTimerId = null
    }
  }

  _emitBufferSample() {
    const videoEl = this._getVideoElement()
    if (!videoEl) return

    const bufferAhead = getBufferAhead(videoEl)

    const data = {
      bufferAhead,
      currentTime: videoEl.currentTime,
    }

    if (this._includeRanges) {
      data.rangesCompact = getBufferedRanges(videoEl.buffered)
    }

    console.debug(`[BufferSamplePlugin] Emitting buffer sample: bufferAhead=${bufferAhead.toFixed(2)}s, currentTime=${videoEl.currentTime.toFixed(2)}s`) // Debug log

    emitTelemetry(this.container, TelemetryEventTypes.MSE_BUFFER_SAMPLE, data, this.name)
  }

  _onDestroy() {
    this.destroy()
  }

  destroy() {
    this._stopSampling()
    super.destroy()
  }
}

BufferSamplePlugin.type = 'container'
