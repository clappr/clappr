import { Log } from '@clappr/core'
import { isComponentEnabled } from '../utils'

const _registry = new Map()
const _refCounts = new Map()

/**
 * Manages all active observers, instantiating and delegating lifecycle calls to each.
 *
 * Extensible via `ObserverRegistry.register()` — external observers can be added
 * before the player is instantiated.
 *
 * Observer contract: must implement `bind()` and `destroy()` on the prototype.
 *
 * The registry only validates and ref-counts classes; each instance only
 * instantiates its own container's `telemetry.observers`.
 */
export default class ObserverRegistry {
  static get id() { return 'observer-registry' }

  /** True if `Cls` exposes a non-empty static id. */
  static _hasId(Cls) {
    return typeof Cls?.id === 'string' && Cls.id !== ''
  }

  /**
   * Registers an observer class, keyed by `static get id()`. Ref-counted.
   * @returns {boolean} false if validation failed
   */
  static register(ObserverClass) {
    const proto = ObserverClass?.prototype
    const missing = [
      !ObserverRegistry._hasId(ObserverClass) && 'static get id()',
      typeof proto?.bind !== 'function' && 'bind()',
      typeof proto?.destroy !== 'function' && 'destroy()'
    ].filter(Boolean)

    if (missing.length > 0) {
      Log.warn('[ObserverRegistry]', `missing ${missing.join(', ')} — skipping`)
      return false
    }
    const id = ObserverClass.id
    if (_registry.has(id) && _registry.get(id) !== ObserverClass) {
      Log.warn('[ObserverRegistry]', `id collision on '${id}' — overwriting existing class`)
    }
    _registry.set(id, ObserverClass)
    _refCounts.set(id, (_refCounts.get(id) || 0) + 1)
    return true
  }

  /**
   * Removes a previously registered observer class from the registry.
   * Reference-counted — the class is only removed when all registrations are released.
   *
   * @param {Function} ObserverClass - The class reference used when registering
   */
  static unregister(ObserverClass) {
    if (!ObserverClass?.id) return
    const id = ObserverClass.id
    const count = (_refCounts.get(id) || 0) - 1
    if (count <= 0) {
      _registry.delete(id)
      _refCounts.delete(id)
    } else {
      _refCounts.set(id, count)
    }
  }

  /**
   * Returns true if an observer with the given class's id is already registered.
   *
   * @param {Function} ObserverClass
   * @returns {boolean}
   */
  static has(ObserverClass) {
    return _registry.has(ObserverClass?.id)
  }

  constructor(playback, container, samplerRegistry) {
    const cfg = container.options?.telemetry || {}
    const observers = cfg.observers || []
    this._observers = observers
      .filter(Obs => Obs != null && ObserverRegistry.has(Obs) && isComponentEnabled(Obs, cfg))
      .map(ObserverClass => new ObserverClass(playback, container, samplerRegistry))
  }

  bind() {
    this._observers.forEach(o => o.bind())
  }

  destroy() {
    this._observers.forEach(o => o.destroy())
    this._observers = []
  }
}
