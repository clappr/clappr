import ShakaNetworkAdapter from './shaka_network_adapter'

/**
 * Registry of available telemetry adapters.
 * New adapters (HLS.js, etc) are added here.
 * Each adapter must implement static isSupported() and bind() methods.
 */
const ADAPTERS = [
  ShakaNetworkAdapter
  // HLSjsNetworkAdapter - future
]

/**
 * Find appropriate network adapter for given playback engine.
 * @param {Object} playback - Playback engine instance
 * @returns {Class|null} Network adapter class if supported, null otherwise
 */
export function findNetworkAdapter(playback) {
  const AdapterClass = ADAPTERS.find(adapter => adapter.isSupported(playback))
  return AdapterClass || null
}

export { default as ShakaNetworkAdapter } from './shaka_network_adapter'
