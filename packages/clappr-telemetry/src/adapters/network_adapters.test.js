import NetworkAdapters from './network_adapters'

const makeAdapter = (name, supported = false) => ({
  name,
  isSupported: jest.fn(() => supported)
})

let _registered = []
const register = (adapter) => { _registered.push(adapter); NetworkAdapters.register(adapter) }

describe('NetworkAdapters', () => {
  afterEach(() => {
    _registered.forEach(a => NetworkAdapters.unregister(a))
    _registered = []
  })

  // ─── find ─────────────────────────────────────────────────────────────────────

  describe('find', () => {
    it('returns null when no adapter supports the playback', () => {
      expect(NetworkAdapters.find({ name: 'unknown' })).toBeNull()
    })

    it('returns the matching adapter', () => {
      const adapter = makeAdapter('custom', true)
      register(adapter)

      expect(NetworkAdapters.find({ name: 'anything' })).toBe(adapter)
    })

    it('returns the first matching adapter when multiple match', () => {
      const first = makeAdapter('first', true)
      const second = makeAdapter('second', true)
      register(first)
      register(second)

      expect(NetworkAdapters.find({})).toBe(first)
    })

    it('calls isSupported with the playback instance', () => {
      const playback = { name: 'my_engine' }
      const adapter = makeAdapter('custom', true)
      register(adapter)

      NetworkAdapters.find(playback)

      expect(adapter.isSupported).toHaveBeenCalledWith(playback)
    })

    it('returns null when adapter is disabled via cfg[name].enabled = false', () => {
      const adapter = makeAdapter('custom', true)
      register(adapter)

      expect(NetworkAdapters.find({}, { custom: { enabled: false } })).toBeNull()
    })

    it('finds adapter when cfg[name] is not set', () => {
      const adapter = makeAdapter('custom', true)
      register(adapter)

      expect(NetworkAdapters.find({}, {})).toBe(adapter)
    })

    it('is backwards-compatible when called without cfg', () => {
      const adapter = makeAdapter('custom', true)
      register(adapter)

      expect(NetworkAdapters.find({})).toBe(adapter)
    })

    it('defers to static isEnabled(cfg) when defined on the adapter', () => {
      const adapter = makeAdapter('custom', true)
      adapter.isEnabled = jest.fn(() => false)
      register(adapter)

      expect(NetworkAdapters.find({}, {})).toBeNull()
      expect(adapter.isEnabled).toHaveBeenCalled()
    })
  })

  // ─── register ────────────────────────────────────────────────────────────────

  describe('register', () => {
    it('makes a registered adapter discoverable via find()', () => {
      const adapter = makeAdapter('custom', true)
      register(adapter)

      expect(NetworkAdapters.find({})).toBe(adapter)
    })

    it('first registered adapter has higher priority', () => {
      const custom = makeAdapter('custom', true)
      const builtIn = makeAdapter('built_in', true)
      register(custom)
      register(builtIn)

      expect(NetworkAdapters.find({})).toBe(custom)
    })

    it('registering the same class twice is a no-op', () => {
      const adapter = makeAdapter('custom', true)
      register(adapter)
      register(adapter)

      expect(NetworkAdapters.find({})).toBe(adapter)
    })
  })

  // ─── unregister ──────────────────────────────────────────────────────────────

  describe('unregister', () => {
    it('removes a previously registered adapter', () => {
      const adapter = makeAdapter('custom', true)
      register(adapter)
      NetworkAdapters.unregister(adapter)

      expect(NetworkAdapters.find({})).toBeNull()
    })

    it('does not throw when unregistering an adapter that was never registered', () => {
      const adapter = makeAdapter('ghost')

      expect(() => NetworkAdapters.unregister(adapter)).not.toThrow()
    })

    it('ref-counted: one unregister after two registers still leaves adapter discoverable', () => {
      const adapter = makeAdapter('custom', true)
      register(adapter) // refCount → 1
      register(adapter) // refCount → 2
      NetworkAdapters.unregister(adapter) // refCount → 1 — still in registry
      expect(NetworkAdapters.find({})).toBe(adapter)
      // afterEach drains the remaining ref via _registered = [adapter, adapter]
    })
  })

  describe('ref counting', () => {
    it('is reference-counted — removed only after all registrations are released', () => {
      const adapter = makeAdapter('custom', true)
      NetworkAdapters.register(adapter) // refCount → 1
      NetworkAdapters.register(adapter) // refCount → 2
      NetworkAdapters.unregister(adapter) // refCount → 1 — still findable
      expect(NetworkAdapters.find({})).toBe(adapter)
      NetworkAdapters.unregister(adapter) // refCount → 0 — removed
      expect(NetworkAdapters.find({})).toBeNull()
    })
  })
})
