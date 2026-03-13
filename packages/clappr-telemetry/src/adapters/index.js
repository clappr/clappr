import ShakaNetworkAdapter from './ShakaNetworkAdapter'

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
 * Find appropriate adapter for given playback engine.
 * @param {Object} playback - Playback engine instance
 * @returns {Class|null} Adapter class if supported, null otherwise
 */
export function findAdapterForPlayback(playback) {
  const AdapterClass = ADAPTERS.find(adapter => adapter.isSupported(playback))
  return AdapterClass || null
}

export { default as ShakaNetworkAdapter } from './ShakaNetworkAdapter'
