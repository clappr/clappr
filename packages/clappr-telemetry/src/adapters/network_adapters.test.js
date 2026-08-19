import NetworkAdapters from './network_adapters'

const makeAdapter = (name, supported = false) => ({
  name,
  isSupported: vi.fn(() => supported)
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

      expect(NetworkAdapters.find({ name: 'anything' }, { adapters: [adapter] })).toBe(adapter)
    })

    it('returns the first matching adapter from cfg.adapters, in array order', () => {
      const first = makeAdapter('first', true)
      const second = makeAdapter('second', true)
      register(first)
      register(second)

      expect(NetworkAdapters.find({}, { adapters: [first, second] })).toBe(first)
      expect(NetworkAdapters.find({}, { adapters: [second, first] })).toBe(second)
    })

    it('calls isSupported with the playback instance', () => {
      const playback = { name: 'my_engine' }
      const adapter = makeAdapter('custom', true)
      register(adapter)

      NetworkAdapters.find(playback, { adapters: [adapter] })

      expect(adapter.isSupported).toHaveBeenCalledWith(playback)
    })

    it('returns null when adapter is disabled via cfg[name].enabled = false', () => {
      const adapter = makeAdapter('custom', true)
      register(adapter)

      expect(NetworkAdapters.find({}, { adapters: [adapter], custom: { enabled: false } })).toBeNull()
    })

    it('finds adapter when cfg[name] is not set', () => {
      const adapter = makeAdapter('custom', true)
      register(adapter)

      expect(NetworkAdapters.find({}, { adapters: [adapter] })).toBe(adapter)
    })

    it('returns null when called without cfg.adapters, even if the class is registered elsewhere', () => {
      const adapter = makeAdapter('custom', true)
      register(adapter)

      expect(NetworkAdapters.find({})).toBeNull()
    })

    it('ignores an adapter that is not registered, even if present in cfg.adapters', () => {
      const adapter = makeAdapter('unregistered', true)

      expect(NetworkAdapters.find({}, { adapters: [adapter] })).toBeNull()
    })

    it('defers to static isEnabled(cfg) when defined on the adapter', () => {
      const adapter = makeAdapter('custom', true)
      adapter.isEnabled = vi.fn(() => false)
      register(adapter)

      expect(NetworkAdapters.find({}, { adapters: [adapter] })).toBeNull()
      expect(adapter.isEnabled).toHaveBeenCalled()
    })
  })

  // ─── isolation ───────────────────────────────────────────────────────────────

  describe('isolation', () => {
    it('a container only ever matches adapters listed in its own cfg.adapters', () => {
      const a = makeAdapter('a', true)
      const b = makeAdapter('b', true)
      register(a)
      register(b)

      // both are registered globally, but each "instance" only sees its own list
      expect(NetworkAdapters.find({}, { adapters: [a] })).toBe(a)
      expect(NetworkAdapters.find({}, { adapters: [b] })).toBe(b)
    })
  })

  // ─── register ────────────────────────────────────────────────────────────────

  describe('register', () => {
    it('makes a registered adapter discoverable via find()', () => {
      const adapter = makeAdapter('custom', true)
      register(adapter)

      expect(NetworkAdapters.find({}, { adapters: [adapter] })).toBe(adapter)
    })

    it('registering the same class twice is a no-op', () => {
      const adapter = makeAdapter('custom', true)
      register(adapter)
      register(adapter)

      expect(NetworkAdapters.find({}, { adapters: [adapter] })).toBe(adapter)
    })

    it('returns false and warns when static isSupported() is missing', () => {
      const adapter = { name: 'bad' }

      expect(NetworkAdapters.register(adapter)).toBe(false)
    })

    it('returns true when registration succeeds', () => {
      const adapter = makeAdapter('custom', true)
      _registered.push(adapter)

      expect(NetworkAdapters.register(adapter)).toBe(true)
    })
  })

  // ─── unregister ──────────────────────────────────────────────────────────────

  describe('unregister', () => {
    it('removes a previously registered adapter', () => {
      const adapter = makeAdapter('custom', true)
      register(adapter)
      NetworkAdapters.unregister(adapter)

      expect(NetworkAdapters.find({}, { adapters: [adapter] })).toBeNull()
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
      expect(NetworkAdapters.find({}, { adapters: [adapter] })).toBe(adapter)
      // afterEach drains the remaining ref via _registered = [adapter, adapter]
    })
  })

  describe('ref counting', () => {
    it('is reference-counted — removed only after all registrations are released', () => {
      const adapter = makeAdapter('custom', true)
      NetworkAdapters.register(adapter) // refCount → 1
      NetworkAdapters.register(adapter) // refCount → 2
      NetworkAdapters.unregister(adapter) // refCount → 1 — still findable
      expect(NetworkAdapters.find({}, { adapters: [adapter] })).toBe(adapter)
      NetworkAdapters.unregister(adapter) // refCount → 0 — removed
      expect(NetworkAdapters.find({}, { adapters: [adapter] })).toBeNull()
    })
  })
})
