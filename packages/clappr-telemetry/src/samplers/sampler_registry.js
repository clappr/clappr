import { Log } from '@clappr/core'
import { emitTelemetry } from '../utils'
import { EVENT_TYPES } from '../utils/constants'

const DISABLED_INTERVAL = 0

const _registry = new Map()

/**
 * Drives all active samplers from a single `setInterval`.
 *
 * Samplers are registered via `SamplerRegistry.register()` and instantiated
 * on construction. On every tick, calls `collect()` on each sampler and emits
 * a single `MSE_SAMPLE` event with the results grouped by name. Keys are
 * omitted when the sampler returns `null` (e.g. decoding seed call).
 *
 * **Configuration** via `container.options.telemetry`:
 * - `sampleIntervalMs` {number} — tick frequency in ms (default: 0 — disabled, use snapshot() for on-demand collection)
 */
export default class SamplerRegistry {
  static get name() { return 'sampler-registry' }

  /**
   * Registers a sampler class. The sampler's `static get name()` is used as
   * the key in the `mse.sample` payload.
   *
   * @param {Function} SamplerClass - Class with `static get name()`, `collect()`, and `destroy()`
   */
  static register(SamplerClass) {
    const proto = SamplerClass?.prototype
    const missing = [
      !SamplerClass?.name && 'static get name()',
      typeof proto?.collect !== 'function' && 'collect()',
      typeof proto?.destroy !== 'function' && 'destroy()'
    ].filter(Boolean)

    if (missing.length > 0) {
      Log.warn('[SamplerRegistry]', `missing ${missing.join(', ')} — skipping`)
      return
    }
    _registry.set(SamplerClass.name, SamplerClass)
  }

  /**
   * Removes a previously registered sampler from the global registry.
   *
   * @param {Function} SamplerClass - The class reference used when registering
   */
  static unregister(SamplerClass) {
    if (SamplerClass?.name) _registry.delete(SamplerClass.name)
  }

  /**
   * Returns true if a sampler with the given class's name is already registered.
   *
   * @param {Function} SamplerClass
   * @returns {boolean}
   */
  static has(SamplerClass) {
    return _registry.has(SamplerClass?.name)
  }

  constructor(playback, container) {
    const cfg = container.options?.telemetry || {}
    this._container = container
    const raw = cfg.sampleIntervalMs
    this._intervalMs = (typeof raw === 'number' && raw > 0) ? raw : DISABLED_INTERVAL
    this._samplers = [..._registry.entries()]
      .filter(([, S]) => {
        if (typeof S.isEnabled === 'function') return S.isEnabled(cfg)
        return cfg[S.name]?.enabled !== false
      })
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
