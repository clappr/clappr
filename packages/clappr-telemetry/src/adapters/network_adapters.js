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
   * Find the first adapter that supports the given playback instance.
   *
   * @param {Object} playback - Playback engine instance
   * @returns {Function|null} Adapter class if found, null otherwise
   */
  static find(playback) {
    return _registry.find(adapter => adapter.isSupported(playback)) ?? null
  }
}
