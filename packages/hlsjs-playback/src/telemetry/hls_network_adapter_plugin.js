import { ContainerPlugin, Events, emitTelemetry, TelemetryEventTypes, hashUrl } from '@clappr/core'
import HLSJS from 'hls.js'

// Maps frag metadata to a human-readable segment kind
const fragKind = (frag) => {
  if (frag.sn === 'initSegment') return 'init'
  if (frag.type === 'subtitle') return 'subtitle'
  return 'segment'
}

// Compact representation of the fragment's position in the stream
const fragChunk = (frag) => ({
  stream: frag.type,
  variantId: frag.level,
  seq: frag.sn !== 'initSegment' ? frag.sn : null,
  start: frag.start,
  dur: frag.duration,
})

// Deterministic request id: url-hash + sequence + level
const fragId = (frag) => `${hashUrl(frag.url)}_${frag.sn}_${frag.level}`

/**
 * HlsNetworkAdapterPlugin
 *
 * A ContainerPlugin that attaches to the hls.js instance created by
 * HlsjsPlayback and forwards network-level fragment events (loading start,
 * loaded, network error) to the telemetry bus as canonical `net.request.*`
 * envelopes on TRACE_EVENT.
 *
 * Co-located with HlsjsPlayback so it can access the internal `_hls` instance.
 */
export default class HlsNetworkAdapterPlugin extends ContainerPlugin {
  get name() { return 'hls_network_adapter' }

  constructor(container) {
    super(container)
    this._pendingFrags = new Map()
    this._attachedHls = null

    // Bind so we can cleanly remove the same function references
    this._onFragLoading = this._onFragLoading.bind(this)
    this._onFragLoaded = this._onFragLoaded.bind(this)
    this._onHlsError = this._onHlsError.bind(this)
  }

  bindEvents() {
    this.listenTo(this.container, Events.CONTAINER_READY, this._onContainerReady)
    this.listenTo(this.container, Events.CONTAINER_DESTROYED, this.destroy)
  }

  _isEnabled() {
    return this.options?.telemetry?.hlsNetwork?.enabled !== false
  }

  _onContainerReady() {
    if (!this._isEnabled()) return

    this.listenTo(this.container, Events.CONTAINER_PLAY, this._onPlay)

    // Attempt an initial attach in case _hls is already set (e.g. autoPlay)
    this._tryAttach()
  }

  _onPlay() {
    this._tryAttach()
  }

  _tryAttach() {
    const hls = this.container?.playback?._hls
    if (!hls || hls === this._attachedHls) return

    this._detachFromHls()
    this._attachToHls(hls)
  }

  _attachToHls(hls) {
    hls.on(HLSJS.Events.FRAG_LOADING, this._onFragLoading)
    hls.on(HLSJS.Events.FRAG_LOADED, this._onFragLoaded)
    hls.on(HLSJS.Events.ERROR, this._onHlsError)
    this._attachedHls = hls
  }

  _detachFromHls() {
    if (!this._attachedHls) return
    this._attachedHls.off(HLSJS.Events.FRAG_LOADING, this._onFragLoading)
    this._attachedHls.off(HLSJS.Events.FRAG_LOADED, this._onFragLoaded)
    this._attachedHls.off(HLSJS.Events.ERROR, this._onHlsError)
    this._attachedHls = null
  }

  _onFragLoading(_evt, { frag }) {
    const id = fragId(frag)
    this._pendingFrags.set(id, { startT: performance.now() })

    emitTelemetry(this.container, TelemetryEventTypes.NET_REQUEST_START, {
      id,
      kind: fragKind(frag),
      urlHash: hashUrl(frag.url),
      chunk: fragChunk(frag),
    }, this.name)
  }

  _onFragLoaded(_evt, { frag }) {
    const id = fragId(frag)
    const pending = this._pendingFrags.get(id)
    this._pendingFrags.delete(id)

    // Prefer the precise timing reported by hls.js stats; fall back to wall clock
    const durationMs = frag.stats?.loading
      ? frag.stats.loading.end - frag.stats.loading.start
      : (pending ? performance.now() - pending.startT : 0)

    emitTelemetry(this.container, TelemetryEventTypes.NET_REQUEST_END, {
      id,
      kind: fragKind(frag),
      urlHash: hashUrl(frag.url),
      chunk: fragChunk(frag),
      durationMs,
      bytes: frag.stats?.total ?? 0,
    }, this.name)
  }

  _onHlsError(_evt, data) {
    // Only care about network errors on fragments
    if (data.type !== HLSJS.ErrorTypes.NETWORK_ERROR || !data.frag) return

    const { frag } = data
    const id = fragId(frag)
    this._pendingFrags.delete(id)

    emitTelemetry(this.container, TelemetryEventTypes.NET_REQUEST_ERROR, {
      id,
      kind: fragKind(frag),
      urlHash: hashUrl(frag.url),
      chunk: fragChunk(frag),
      hlsErrorType: data.type,
      hlsErrorDetails: data.details,
      fatal: data.fatal,
    }, this.name)
  }

  destroy() {
    this._detachFromHls()
    this._pendingFrags.clear()
    super.destroy?.()
  }
}
