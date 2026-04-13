/**
 * Periodically samples video decoding quality and returns it to the scheduler.
 *
 * Uses `HTMLVideoElement.getVideoPlaybackQuality()`, which returns cumulative
 * counters since playback started. The sampler keeps the previous sample state
 * to compute per-interval deltas.
 *
 * **Configuration** via `container.options.telemetry.decodingSample.enabled: true`
 */

import { round1, round4 } from '../utils/helpers'

export default class DecodingSampler {
  static get name() {
    return 'decoding-sampler'
  }

  static isEnabled(cfg) {
    return cfg?.decodingSample?.enabled === true
  }

  constructor(playback, _container) {
    this._playback = playback
    this._destroyed = false
    this._lastTs = null
    this._lastTotal = null
    this._lastDropped = null
    this._seed()
  }

  _videoEl() {
    return this._playback?.el ?? null
  }

  _seed() {
    const el = this._videoEl()
    if (!el?.getVideoPlaybackQuality) return
    const quality = el.getVideoPlaybackQuality()
    this._lastTs = performance.now()
    this._lastTotal = quality.totalVideoFrames
    this._lastDropped = quality.droppedVideoFrames
  }

  /**
   * Collects and returns decoding metrics for the current interval.
   *
   * The browser does not expose fps directly — `getVideoPlaybackQuality()` returns
   * cumulative counters since playback started. To get per-interval values,
   * we subtract the previous sample counters from the current ones.
   *
   * The baseline is captured in the constructor. If the video element was not
   * available at construction time, the first `collect()` call captures it and
   * returns `null`.
   *
   * @returns {{ decodedFps: number, droppedFps: number, dropRatio: number, currentTime: number, totalDropped: number, totalDecoded: number } | null}
   */
  collect() {
    if (this._destroyed) return null
    const videoEl = this._videoEl()
    if (!videoEl?.getVideoPlaybackQuality) return null

    if (this._lastTs === null) {
      this._seed()
      return null
    }

    const quality = videoEl.getVideoPlaybackQuality()
    const now = performance.now()

    const elapsedSec = (now - this._lastTs) / 1000
    const prevTotal = this._lastTotal
    const prevDropped = this._lastDropped

    const framesDecodedInInterval = quality.totalVideoFrames - prevTotal
    const framesDroppedInInterval = quality.droppedVideoFrames - prevDropped

    this._lastTs = now
    this._lastTotal = quality.totalVideoFrames
    this._lastDropped = quality.droppedVideoFrames

    if (elapsedSec <= 0) return null

    if (framesDecodedInInterval < 0 || framesDroppedInInterval < 0) {
      return null
    }

    const totalFramesInInterval = framesDecodedInInterval + framesDroppedInInterval
    const dropRatio = totalFramesInInterval > 0 ? framesDroppedInInterval / totalFramesInInterval : 0

    return {
      decodedFps: round1(framesDecodedInInterval / elapsedSec),
      droppedFps: round1(framesDroppedInInterval / elapsedSec),
      dropRatio: round4(dropRatio),
      currentTime: round1(videoEl.currentTime),
      totalDropped: quality.droppedVideoFrames,
      totalDecoded: quality.totalVideoFrames
    }
  }

  destroy() {
    this._destroyed = true
    this._playback = null
    this._lastTs = null
    this._lastTotal = null
    this._lastDropped = null
  }
}
