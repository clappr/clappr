import { Log } from '@clappr/core'

const _registry = new Map()

/**
 * Manages all active observers, instantiating and delegating lifecycle calls to each.
 *
 * Extensible via `ObserverRegistry.register()` — external observers can be added
 * before the player is instantiated.
 *
 * Observer contract: must implement `bind()` and `destroy()` on the prototype.
 */
export default class ObserverRegistry {
  static get name() { return 'observer-registry' }

  /**
   * Registers an observer class. The class's `name` property is used as the registry key.
   *
   * @param {Function} ObserverClass - Class implementing `bind()` and `destroy()`
   */
  static register(ObserverClass) {
    const proto = ObserverClass?.prototype
    const missing = [
      !ObserverClass?.name && 'static get name()',
      typeof proto?.bind !== 'function' && 'bind()',
      typeof proto?.destroy !== 'function' && 'destroy()'
    ].filter(Boolean)

    if (missing.length > 0) {
      Log.warn('[ObserverRegistry]', `missing ${missing.join(', ')} — skipping`)
      return
    }
    _registry.set(ObserverClass.name, ObserverClass)
  }

  /**
   * Removes a previously registered observer class from the registry.
   *
   * @param {Function} ObserverClass - The class reference used when registering
   */
  static unregister(ObserverClass) {
    if (ObserverClass?.name) _registry.delete(ObserverClass.name)
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
    this._observers = [..._registry.values()]
      .filter(Obs => {
        if (typeof Obs.isEnabled === 'function') return Obs.isEnabled(cfg)
        return cfg[Obs.name]?.enabled !== false
      })
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
