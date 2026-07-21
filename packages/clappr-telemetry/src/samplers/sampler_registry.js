import { Log } from '@clappr/core'
import { emitTelemetry, isComponentEnabled } from '../utils'
import { EVENT_TYPES } from '../utils/constants'

const DISABLED_INTERVAL = 0

const _registry = new Map()
const _refCounts = new Map()

/**
 * Drives all active samplers from a single `setInterval`.
 *
 * Samplers are registered via `SamplerRegistry.register()` and instantiated
 * on construction. On every tick, calls `collect()` on each sampler and emits
 * a single `MSE_SAMPLE` event with the results grouped by name. Keys are
 * omitted when the sampler returns `null` (e.g. decoding seed call).
 *
 * **Configuration** via `container.options.telemetry`:
 * - `samplers` {Function[]} — sampler classes for this container
 * - `sampleIntervalMs` {number} — tick frequency in ms (default: 0 — disabled)
 *
 * The registry only validates and ref-counts classes; each instance only
 * instantiates its own container's `telemetry.samplers`.
 */
export default class SamplerRegistry {
  static get name() { return 'sampler-registry' }

  /** True if `Cls` declares its own `static get name()`, not the auto-assigned one. */
  static _hasOwnNameGetter(Cls) {
    return typeof Cls === 'function' &&
      typeof Object.getOwnPropertyDescriptor(Cls, 'name')?.get === 'function'
  }

  /**
   * Registers a sampler class, keyed by `static get name()`. Ref-counted.
   * @returns {boolean} false if validation failed
   */
  static register(SamplerClass) {
    const proto = SamplerClass?.prototype
    const missing = [
      !SamplerRegistry._hasOwnNameGetter(SamplerClass) && 'static get name()',
      typeof proto?.collect !== 'function' && 'collect()',
      typeof proto?.destroy !== 'function' && 'destroy()'
    ].filter(Boolean)

    if (missing.length > 0) {
      Log.warn('[SamplerRegistry]', `missing ${missing.join(', ')} — skipping`)
      return false
    }
    const name = SamplerClass.name
    if (_registry.has(name) && _registry.get(name) !== SamplerClass) {
      Log.warn('[SamplerRegistry]', `name collision on '${name}' — overwriting existing class`)
    }
    _registry.set(name, SamplerClass)
    _refCounts.set(name, (_refCounts.get(name) || 0) + 1)
    return true
  }

  /**
   * Removes a previously registered sampler from the global registry.
   * Reference-counted — the class is only removed when all registrations are released.
   *
   * @param {Function} SamplerClass - The class reference used when registering
   */
  static unregister(SamplerClass) {
    if (!SamplerClass?.name) return
    const name = SamplerClass.name
    const count = (_refCounts.get(name) || 0) - 1
    if (count <= 0) {
      _registry.delete(name)
      _refCounts.delete(name)
    } else {
      _refCounts.set(name, count)
    }
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
    const samplers = cfg.samplers || []
    this._samplers = samplers
      .filter(S => S != null && SamplerRegistry.has(S) && isComponentEnabled(S, cfg))
      .map(S => [S.name, new S(playback, container)])
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
