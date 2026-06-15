import { Log } from '@clappr/core'

const _registry = []
const _refCounts = new Map()

export default class NetworkAdapters {
  /**
   * Registers an adapter class. Adapters are matched in registration order —
   * first registered has highest priority. Reference-counted — safe to call
   * multiple times (e.g. from concurrent player instances).
   *
   * @param {Function} AdapterClass - Class implementing the network adapter contract
   */
  static register(AdapterClass) {
    if (typeof AdapterClass?.isSupported !== 'function') {
      Log.warn('[NetworkAdapters]', 'missing static isSupported() — skipping')
      return
    }
    if (!_registry.includes(AdapterClass)) _registry.push(AdapterClass)
    _refCounts.set(AdapterClass, (_refCounts.get(AdapterClass) || 0) + 1)
  }

  /**
   * Removes a previously registered adapter class from the registry.
   * Reference-counted — the class is only removed when all registrations are released.
   *
   * @param {Function} AdapterClass - The class reference used when registering
   */
  static unregister(AdapterClass) {
    const count = (_refCounts.get(AdapterClass) || 0) - 1
    if (count <= 0) {
      const idx = _registry.indexOf(AdapterClass)
      if (idx !== -1) _registry.splice(idx, 1)
      _refCounts.delete(AdapterClass)
    } else {
      _refCounts.set(AdapterClass, count)
    }
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
  static find(playback, cfg = {}) {
    return _registry.find(adapter => {
      if (typeof adapter.isEnabled === 'function' && !adapter.isEnabled(cfg)) return false
      if (cfg[adapter.name]?.enabled === false) return false
      return typeof adapter.isSupported === 'function' && adapter.isSupported(playback)
    }) ?? null
  }
}
