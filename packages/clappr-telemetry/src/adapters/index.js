import ShakaNetworkAdapter from './shaka_network_adapter'
import HlsNetworkAdapter from './hls_network_adapter'

/**
 * Telemetry adapters hook into player components to collect metrics.
 * Different adapter types can capture data from various sources:
 * - Network: streaming engine network requests
 */

/**
 * Network adapters registry.
 * Collects telemetry metrics from streaming engines.
 * Each adapter must implement static isSupported() and bind() methods.
 */
const NETWORK_ADAPTERS = [
  ShakaNetworkAdapter,
  HlsNetworkAdapter
]

/**
 * Find appropriate network adapter for given playback engine.
 * @param {Object} playback - Playback engine instance
 * @returns {Class|null} Network adapter class if supported, null otherwise
 */
export function findNetworkAdapter(playback) {
  const AdapterClass = NETWORK_ADAPTERS.find(adapter => adapter.isSupported(playback))
  return AdapterClass || null
}

export { default as ShakaNetworkAdapter } from './shaka_network_adapter'
export { default as HlsNetworkAdapter } from './hls_network_adapter'
