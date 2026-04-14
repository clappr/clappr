import ShakaNetworkAdapter from './shaka_network_adapter'
import HlsNetworkAdapter from './hls_network_adapter'

const _registry = [ShakaNetworkAdapter, HlsNetworkAdapter]

export default class AdapterRegistry {
  /**
   * Registers an external adapter class with higher priority than built-ins.
   * Must be called before the player is instantiated.
   *
   * @param {Function} AdapterClass - Class implementing the network adapter contract
   */
  static register(AdapterClass) {
    if (!_registry.includes(AdapterClass)) _registry.unshift(AdapterClass)
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
