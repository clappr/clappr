import { Log } from '@clappr/core'

const _registry = []
const _refCounts = new Map()

export default class NetworkAdapters {
  /**
   * Registers an adapter class. Ref-counted.
   * @returns {boolean} false if validation failed
   */
  static register(AdapterClass) {
    if (typeof AdapterClass?.isSupported !== 'function') {
      Log.warn('[NetworkAdapters]', 'missing static isSupported() — skipping')
      return false
    }
    if (!_registry.includes(AdapterClass)) _registry.push(AdapterClass)
    _refCounts.set(AdapterClass, (_refCounts.get(AdapterClass) || 0) + 1)
    return true
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
   * Returns the first registered adapter from `cfg.adapters` (in order) that
   * supports the playback instance and is not disabled.
   */
  static find(playback, cfg = {}) {
    const adapters = cfg.adapters || []
    return adapters.find(adapter => {
      if (adapter == null || !NetworkAdapters.has(adapter)) return false
      if (typeof adapter.isEnabled === 'function' && !adapter.isEnabled(cfg)) return false
      if (cfg[adapter.name]?.enabled === false) return false
      return typeof adapter.isSupported === 'function' && adapter.isSupported(playback)
    }) ?? null
  }
}
