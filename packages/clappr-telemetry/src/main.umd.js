/**
 * UMD entry: the global `ClapprTelemetry` is the plugin class.
 * Named exports are attached as static properties for script-tag consumers:
 *   ClapprTelemetry.ShakaNetworkAdapter, ClapprTelemetry.BufferSampler, etc.
 */
import TelemetryPlugin from './telemetry_plugin'
import { NetworkAdapters, ShakaNetworkAdapter, HlsNetworkAdapter } from './adapters'
import { SamplerRegistry, BufferSampler, DecodingSampler, PlaybackStateSampler, NetworkSampler, PlaybackTimingSampler, StreamInfoSampler } from './samplers'
import { ObserverRegistry, VideoEventObserver } from './observers'

TelemetryPlugin.ShakaNetworkAdapter = ShakaNetworkAdapter
TelemetryPlugin.HlsNetworkAdapter = HlsNetworkAdapter

TelemetryPlugin.BufferSampler = BufferSampler
TelemetryPlugin.DecodingSampler = DecodingSampler
TelemetryPlugin.PlaybackStateSampler = PlaybackStateSampler
TelemetryPlugin.NetworkSampler = NetworkSampler
TelemetryPlugin.PlaybackTimingSampler = PlaybackTimingSampler
TelemetryPlugin.StreamInfoSampler = StreamInfoSampler

TelemetryPlugin.VideoEventObserver = VideoEventObserver

export default TelemetryPlugin
