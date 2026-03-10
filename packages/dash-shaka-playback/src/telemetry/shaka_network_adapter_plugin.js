import { ContainerPlugin, Events } from '@clappr/core'
import { emitTelemetry, hashUrl } from './helpers'
import { TelemetryEventTypes } from './constants'
import DashShakaPlayback from '../clappr-dash-shaka-playback'

// Maps Shaka RequestType integers to human-readable kind strings
const SHAKA_KIND_MAP = {
  0: 'manifest',
  1: 'segment',
  2: 'license',
  3: 'app',
  4: 'timing',
  5: 'cert',
}

const shakaKind = (type) => SHAKA_KIND_MAP[type] ?? 'unknown'

/**
 * ShakaNetworkAdapterPlugin
 *
 * A ContainerPlugin that attaches request/response filters to the Shaka Player
 * networking engine created by DashShakaPlayback, forwarding network events
 * to the telemetry bus as canonical `net.request.*` envelopes on TRACE_EVENT.
 *
 * Co-located with DashShakaPlayback so it can access `shakaPlayerInstance`.
 */
export default class ShakaNetworkAdapterPlugin extends ContainerPlugin {
  get name() { return 'shaka_network_adapter' }

  get version() { return '3.6.3' }

  get supportedVersion() { return { min: '0.13.0' } }

  constructor(container) {
    super(container)
    // Map from URI → array of {id, startT} to support concurrent requests to same URI
    this._pendingRequests = new Map()
    this._shakaPlayer = null

    // Bind so we can cleanly unregister the same function references
    this._requestFilter = this._requestFilter.bind(this)
    this._responseFilter = this._responseFilter.bind(this)
    this._onShakaReady = this._onShakaReady.bind(this)
    console.log("test v1")
  }

  bindEvents() {
    this.listenTo(this.container, Events.CONTAINER_READY, this._onContainerReady)
    this.listenTo(this.container, Events.CONTAINER_DESTROYED, this.destroy)
  }

  _isEnabled() {
    const enabled = this.options?.telemetry?.shakaNetwork?.enabled !== false
    return enabled
  }

  _onContainerReady() {
    if (!this._isEnabled()) return

    const player = this.container?.playback?.shakaPlayerInstance
    if (player) {
      this._onShakaReady()
      return
    }

    this.listenTo(
      this.container.playback,
      DashShakaPlayback.Events.SHAKA_READY,
      this._onShakaReady,
    )
  }

  _onShakaReady() {
    const player = this.container?.playback?.shakaPlayerInstance
    if (!player) {
      return
    }

    // Detach previous filters if we got a fresh Shaka instance
    this._detachFilters()
    this._shakaPlayer = player
    this._attachFilters(player)
  }

  _attachFilters(player) {
    const engine = player.getNetworkingEngine()
    if (!engine) {
      return
    }
    engine.registerRequestFilter(this._requestFilter)
    engine.registerResponseFilter(this._responseFilter)
  }

  _detachFilters() {
    if (!this._shakaPlayer) return
    const engine = this._shakaPlayer.getNetworkingEngine()
    if (!engine) return
    engine.unregisterRequestFilter(this._requestFilter)
    engine.unregisterResponseFilter(this._responseFilter)
  }

  _requestFilter(type, request) {
    const uri = request.uris?.[0] ?? ''
    const id = `${hashUrl(uri)}_${performance.now()}`
    const startT = performance.now()

    const queue = this._pendingRequests.get(uri) ?? []
    queue.push({ id, startT })
    this._pendingRequests.set(uri, queue)

    console.log('Emitting NET_REQUEST_START:', {
      id,
      kind: shakaKind(type),
      urlHash: hashUrl(uri),
    }, this.name);

    emitTelemetry(this.container, TelemetryEventTypes.NET_REQUEST_START, {
      id,
      kind: shakaKind(type),
      urlHash: hashUrl(uri),
    }, this.name)
  }

  _responseFilter(type, response) {
    const uri = response.uri ?? ''
    const queue = this._pendingRequests.get(uri) ?? []
    const pending = queue.shift()

    if (!queue.length) {
      this._pendingRequests.delete(uri)
    }

    const durationMs = pending ? performance.now() - pending.startT : 0

    console.log('Emitting NET_REQUEST_END:', {
      kind: shakaKind(type),
      urlHash: hashUrl(uri),
      durationMs,
      bytes: response.data?.byteLength ?? 0,
    });

    emitTelemetry(this.container, TelemetryEventTypes.NET_REQUEST_END, {
      id: pending?.id ?? hashUrl(uri),
      kind: shakaKind(type),
      urlHash: hashUrl(uri),
      durationMs,
      bytes: response.data?.byteLength ?? 0,
    }, this.name)
  }

  destroy() {
    this._detachFilters()
    this._pendingRequests.clear()
    this._shakaPlayer = null
    super.destroy?.()
  }
}
