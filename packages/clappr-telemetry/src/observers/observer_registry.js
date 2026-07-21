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
  static get name() { return 'observer-registry' }

  /** True if `Cls` declares its own `static get name()`, not the auto-assigned one. */
  static _hasOwnNameGetter(Cls) {
    return typeof Cls === 'function' &&
      typeof Object.getOwnPropertyDescriptor(Cls, 'name')?.get === 'function'
  }

  /**
   * Registers an observer class, keyed by `static get name()`. Ref-counted.
   * @returns {boolean} false if validation failed
   */
  static register(ObserverClass) {
    const proto = ObserverClass?.prototype
    const missing = [
      !ObserverRegistry._hasOwnNameGetter(ObserverClass) && 'static get name()',
      typeof proto?.bind !== 'function' && 'bind()',
      typeof proto?.destroy !== 'function' && 'destroy()'
    ].filter(Boolean)

    if (missing.length > 0) {
      Log.warn('[ObserverRegistry]', `missing ${missing.join(', ')} — skipping`)
      return false
    }
    const name = ObserverClass.name
    if (_registry.has(name) && _registry.get(name) !== ObserverClass) {
      Log.warn('[ObserverRegistry]', `name collision on '${name}' — overwriting existing class`)
    }
    _registry.set(name, ObserverClass)
    _refCounts.set(name, (_refCounts.get(name) || 0) + 1)
    return true
  }

  /**
   * Removes a previously registered observer class from the registry.
   * Reference-counted — the class is only removed when all registrations are released.
   *
   * @param {Function} ObserverClass - The class reference used when registering
   */
  static unregister(ObserverClass) {
    if (!ObserverClass?.name) return
    const name = ObserverClass.name
    const count = (_refCounts.get(name) || 0) - 1
    if (count <= 0) {
      _registry.delete(name)
      _refCounts.delete(name)
    } else {
      _refCounts.set(name, count)
    }
  }

  /**
   * Returns true if an observer with the given class's name is already registered.
   *
   * @param {Function} ObserverClass
   * @returns {boolean}
   */
  static has(ObserverClass) {
    return _registry.has(ObserverClass?.name)
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
