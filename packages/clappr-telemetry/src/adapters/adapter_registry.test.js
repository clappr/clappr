jest.mock('./shaka_network_adapter', () => ({ isSupported: jest.fn(() => false) }))
jest.mock('./hls_network_adapter', () => ({ isSupported: jest.fn(() => false) }))

import AdapterRegistry from './adapter_registry'

const makeAdapter = (name, supported = false) => ({
  name,
  isSupported: jest.fn(() => supported)
})

let _registered = []
const register = (adapter) => { _registered.push(adapter); AdapterRegistry.register(adapter) }

describe('AdapterRegistry', () => {
  afterEach(() => {
    _registered.forEach(a => AdapterRegistry.unregister(a))
    _registered = []
  })

  // ─── find ─────────────────────────────────────────────────────────────────────

  describe('find', () => {
    it('returns null when no adapter supports the playback', () => {
      expect(AdapterRegistry.find({ name: 'unknown' })).toBeNull()
    })

    it('returns the matching adapter', () => {
      const adapter = makeAdapter('custom', true)
      register(adapter)

      expect(AdapterRegistry.find({ name: 'anything' })).toBe(adapter)
    })

    it('returns the first matching adapter when multiple match', () => {
      const first = makeAdapter('first', true)
      const second = makeAdapter('second', true)
      register(second)
      register(first)

      expect(AdapterRegistry.find({})).toBe(first)
    })

    it('calls isSupported with the playback instance', () => {
      const playback = { name: 'my_engine' }
      const adapter = makeAdapter('custom', true)
      register(adapter)

      AdapterRegistry.find(playback)

      expect(adapter.isSupported).toHaveBeenCalledWith(playback)
    })
  })

  // ─── register ────────────────────────────────────────────────────────────────

  describe('register', () => {
    it('makes a registered adapter discoverable via find()', () => {
      const adapter = makeAdapter('custom', true)
      register(adapter)

      expect(AdapterRegistry.find({})).toBe(adapter)
    })

    it('registered adapter has higher priority than built-ins', () => {
      const builtIn = makeAdapter('built_in', true)
      const custom = makeAdapter('custom', true)
      register(builtIn)
      register(custom)

      expect(AdapterRegistry.find({})).toBe(custom)
    })

    it('registering the same class twice is a no-op', () => {
      const adapter = makeAdapter('custom', true)
      register(adapter)
      register(adapter)

      expect(AdapterRegistry.find({})).toBe(adapter)
    })
  })

  // ─── unregister ──────────────────────────────────────────────────────────────

  describe('unregister', () => {
    it('removes a previously registered adapter', () => {
      const adapter = makeAdapter('custom', true)
      register(adapter)
      AdapterRegistry.unregister(adapter)

      expect(AdapterRegistry.find({})).toBeNull()
    })

    it('does not throw when unregistering an adapter that was never registered', () => {
      const adapter = makeAdapter('ghost')

      expect(() => AdapterRegistry.unregister(adapter)).not.toThrow()
    })

    it('unregistering after deduplicated register fully removes the adapter', () => {
      const adapter = makeAdapter('custom', true)
      register(adapter)
      register(adapter)
      AdapterRegistry.unregister(adapter)

      expect(AdapterRegistry.find({})).toBeNull()
    })
  })
})
