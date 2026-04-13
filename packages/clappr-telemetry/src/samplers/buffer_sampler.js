import { getBufferAhead, getBufferedRanges, round1 } from '../utils/helpers'

/**
 * Periodically samples the video buffer state and returns it to the scheduler.
 *
 * Reads the buffer state directly from the `<video>` element on each `collect()` call.
 *
 * **Configuration** via `container.options.telemetry.bufferSample`:
 * - `enabled`       {boolean} — opt-in, must be `true` to activate (default: false)
 * - `includeRanges` {boolean} — whether to include buffered ranges in the payload (default: true)
 */
export default class BufferSampler {
  static get name() { return 'buffer-sampler' }

  static isEnabled(cfg) {
    return cfg?.bufferSample?.enabled === true
  }

  constructor(playback, container) {
    this._playback = playback
    this._destroyed = false
    this._includeRanges = container.options?.telemetry?.bufferSample?.includeRanges !== false
  }

  /**
   * Collects the current buffer state and returns it.
   * Returns `null` if the video element is not available.
   *
   * @returns {{ bufferAhead: number, currentTime: number, rangesCompact?: number[][] } | null}
   */
  collect() {
    if (this._destroyed) return null
    const videoEl = this._playback?.el
    if (!videoEl) return null

    const currentTime = videoEl.currentTime
    if (!isFinite(currentTime)) return null

    const data = {
      bufferAhead: round1(getBufferAhead(videoEl)),
      currentTime: round1(currentTime)
    }
    if (this._includeRanges) data.rangesCompact = getBufferedRanges(videoEl.buffered)

    return data
  }

  destroy() {
    this._destroyed = true
    this._playback = null
    this._includeRanges = null
  }
}
