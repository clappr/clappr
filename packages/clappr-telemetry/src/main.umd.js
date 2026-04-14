/**
 * UMD entry: the global `ClapprTelemetry` is the plugin class.
 * Adapters are exposed as static properties for explicit registration:
 *   ClapprTelemetry.NetworkAdapters.register(ClapprTelemetry.ShakaNetworkAdapter)
 */
import TelemetryPlugin from './telemetry_plugin'
import { ShakaNetworkAdapter, HlsNetworkAdapter } from './adapters'

TelemetryPlugin.ShakaNetworkAdapter = ShakaNetworkAdapter
TelemetryPlugin.HlsNetworkAdapter = HlsNetworkAdapter

export default TelemetryPlugin
