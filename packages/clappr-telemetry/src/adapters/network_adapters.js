import { Log } from '@clappr/core'

const _registry = []

export default class NetworkAdapters {
  /**
   * Registers an adapter class. Adapters are matched in registration order —
   * first registered has highest priority.
   * Must be called before the player is instantiated.
   *
   * @param {Function} AdapterClass - Class implementing the network adapter contract
   */
  static register(AdapterClass) {
    if (typeof AdapterClass?.isSupported !== 'function') {
      Log.warn('[NetworkAdapters]', 'missing static isSupported() — skipping')
      return
    }
    if (!_registry.includes(AdapterClass)) _registry.push(AdapterClass)
  }

  /**
   * Removes a previously registered adapter class from the registry.
   *
   * @param {Function} AdapterClass - The class reference used when registering
   */
  static unregister(AdapterClass) {
    const idx = _registry.indexOf(AdapterClass)
    if (idx !== -1) _registry.splice(idx, 1)
  }

  /**
   * Returns true if the given adapter class is already registered.
   *
   * @param {Function} AdapterClass
   * @returns {boolean}
   */
  static has(AdapterClass) {
    return _registry.includes(AdapterClass)
  }

  /** Number of registered adapters. */
  static get size() { return _registry.length }

  /**
   * Find the first adapter that supports the given playback instance and is not disabled.
   *
   * @param {Object} playback - Playback engine instance
   * @param {Object} [cfg={}] - Telemetry config (`container.options.telemetry`)
   * @returns {Function|null} Adapter class if found, null otherwise
   */
  static find(playback) {
    return _registry.find(adapter =>
      typeof adapter.isSupported === 'function' && adapter.isSupported(playback)
    ) ?? null
  }
}
