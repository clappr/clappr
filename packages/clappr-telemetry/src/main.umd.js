/**
 * UMD entry: the global `ClapprTelemetry` is the plugin class.
 * Named exports are attached as static properties for script-tag consumers:
 *   ClapprTelemetry.ShakaNetworkAdapter, ClapprTelemetry.BufferSampler, etc.
 */
import TelemetryPlugin from './telemetry_plugin'
import { ShakaNetworkAdapter, HlsNetworkAdapter } from './adapters'
import { BufferSampler, DecodingSampler } from './samplers'

TelemetryPlugin.ShakaNetworkAdapter = ShakaNetworkAdapter
TelemetryPlugin.HlsNetworkAdapter = HlsNetworkAdapter
TelemetryPlugin.BufferSampler = BufferSampler
TelemetryPlugin.DecodingSampler = DecodingSampler

export default TelemetryPlugin
