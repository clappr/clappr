import { Log } from '@clappr/core'
import { emitTelemetry } from '../utils'
import { EVENT_TYPES } from '../utils/constants'
import BufferSampler from './buffer_sampler'
import DecodingSampler from './decoding_sampler'

const DISABLED_INTERVAL = 0

const _registry = new Map([
  ['buffer', BufferSampler],
  ['decoding', DecodingSampler]
])

/**
 * Drives all active samplers from a single `setInterval`.
 *
 * On construction, filters the sampler registry by each sampler's `isEnabled()`
 * and instantiates only those that are enabled. On every tick, calls `collect()`
 * on each active sampler and emits a single `MSE_SAMPLE` event with the results
 * grouped by key (`buffer`, `decoding`). Keys are omitted when the sampler
 * returns `null` (e.g. decoding seed call).
 *
 * The registry is extensible via `SamplerRegistry.register()` — external samplers
 * can be added before the player is instantiated.
 *
 * **Configuration** via `container.options.telemetry`:
 * - `sampleIntervalMs` {number} — tick frequency in ms (default: 0 — disabled, use snapshot() for on-demand collection)
 */
export default class SamplerRegistry {
  static get name() { return 'sampler-registry' }

  /**
   * Registers an external sampler class into the global registry.
   * Must be called before the player is instantiated.
   *
   * **Note:** This method modifies a module-level registry shared by all
   * SamplerRegistry instances. It is intended to be called once during
   * app bootstrap, before any player is created.
   *
   * @param {string} key - Key used in the `mse.sample` payload (e.g. `'metrics'`)
   * @param {Function} SamplerClass - Class implementing `static isEnabled()`, `collect()`, and `destroy()`
   */
  static register(key, SamplerClass) {
    const proto = SamplerClass.prototype
    const missing = [
      typeof SamplerClass.isEnabled !== 'function' && 'static isEnabled()',
      typeof proto?.collect !== 'function' && 'collect()',
      typeof proto?.destroy !== 'function' && 'destroy()',
    ].filter(Boolean)

    if (missing.length > 0) {
      Log.warn('[SamplerRegistry]', `${key}: missing ${missing.join(', ')} — skipping`)
      return
    }
    _registry.set(key, SamplerClass)
  }

  /**
   * Removes a previously registered sampler from the global registry.
   *
   * @param {string} key - The key used when registering the sampler
   */
  static unregister(key) {
    _registry.delete(key)
  }

  constructor(playback, container) {
    const cfg = container.options?.telemetry || {}
    this._container = container
    const raw = cfg.sampleIntervalMs
    this._intervalMs = (typeof raw === 'number' && raw > 0) ? raw : DISABLED_INTERVAL
    this._samplers = [..._registry.entries()]
      .filter(([, S]) => S.isEnabled(cfg))
      .map(([key, S]) => [key, new S(playback, container)])
    this._timerId = null
  }

  /**
   * Starts the sampling interval. Idempotent — safe to call multiple times.
   * If `sampleIntervalMs` is 0 (default), the interval is not started and
   * only on-demand snapshots via `snapshot()` are available.
   */
  bind() {
    if (this._timerId !== null || this._intervalMs === 0) return
    this._timerId = setInterval(() => this._tick(), this._intervalMs)
  }

  /**
   * Collects data from all active samplers and returns it directly.
   * Can be called at any time regardless of the interval state.
   *
   * @returns {Object} Snapshot of all active samplers, keyed by sampler name
   */
  snapshot() {
    const data = {}
    for (const [key, sampler] of this._samplers) {
      try {
        const result = sampler.collect()
        if (result !== null) data[key] = result
      } catch (err) {
        Log.warn('[SamplerRegistry]', `${key}: collect() threw`, err)
      }
    }
    return data
  }

  _tick() {
    const data = this.snapshot()
    if (Object.keys(data).length > 0) {
      emitTelemetry(this._container, EVENT_TYPES.MSE_SAMPLE, data, SamplerRegistry.name)
    }
  }

  /**
   * Stops the interval and destroys all active samplers.
   */
  destroy() {
    if (this._timerId !== null) {
      clearInterval(this._timerId)
      this._timerId = null
    }
    this._samplers.forEach(([, s]) => s.destroy())
    this._samplers = []
    this._container = null
  }
}
