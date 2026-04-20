import { Log } from '@clappr/core'
import VideoEventObserver from './video_event_observer'

const _registry = new Map([
  ['videoState', VideoEventObserver]
])

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
   * Registers an external observer class into the global registry.
   * Must be called before the player is instantiated.
   *
   * @param {string} key - Identifier for the observer (e.g. `'customEvents'`)
   * @param {Function} ObserverClass - Class implementing `bind()` and `destroy()`
   */
  static register(key, ObserverClass) {
    const proto = ObserverClass.prototype
    const missing = [
      typeof proto.bind !== 'function' && 'bind()',
      typeof proto.destroy !== 'function' && 'destroy()'
    ].filter(Boolean)

    if (missing.length > 0) {
      Log.warn('[ObserverRegistry]', `${key}: missing ${missing.join(', ')} — skipping`)
      return
    }
    _registry.set(key, ObserverClass)
  }

  /**
   * Removes a previously registered observer from the global registry.
   *
   * @param {string} key - The key used when registering the observer
   */
  static unregister(key) {
    _registry.delete(key)
  }

  constructor(playback, container, samplerRegistry) {
    this._observers = [..._registry.values()]
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
