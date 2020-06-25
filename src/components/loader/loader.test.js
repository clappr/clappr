import Loader from './loader'

import PlaybackPlugin from '../../base/playback'
import CorePlugin from '../../base/core_plugin'
import ContainerPlugin from '../../base/container_plugin'
import UIContainerPlugin from '../../base/ui_container_plugin'

describe('Loader', function() {
  let loader
  beforeEach(() => {
    loader = new Loader()
  })

  test('starts with an empty plugin registry', () => {
    expect(Loader.registeredPlugins.core).toEqual({})
    expect(Loader.registeredPlugins.container).toEqual({})
  })

  test('starts with an empty playback list', () => {
    expect(Loader.registeredPlaybacks).toEqual([])
  })

  describe('registerPlugin', () => {
    let corePlugin, containerPlugin
    beforeEach(() => {
      corePlugin = CorePlugin.extend({ name: 'core-plugin' })
      containerPlugin = ContainerPlugin.extend({ name: 'container-plugin' })
    })

    afterEach(() => {
      Loader.clearPlugins()
    })

    test('rejects invalid plugin parameter', () => {
      const registered = Loader.registerPlugin(undefined)

      expect(registered).toBeFalsy()
      expect(Loader.registeredPlugins.core).toEqual({})
    })

    test('rejects a plugin without a valid name', () => {
      const plugin = CorePlugin.extend({ name: '' })
      const registered = Loader.registerPlugin(plugin)

      expect(registered).toBeFalsy()
      expect(Loader.registeredPlugins.core).toEqual({})
    })

    test('adds a plugin to the corresponding scope registry', () => {
      let registered = Loader.registerPlugin(corePlugin)

      expect(registered).toBeTruthy()
      expect(Loader.registeredPlugins.container).toEqual({})
      expect(Loader.registeredPlugins.core['core-plugin']).toEqual(corePlugin)

      registered = Loader.registerPlugin(containerPlugin)

      expect(registered).toBeTruthy()
      expect(Loader.registeredPlugins.container['container-plugin']).toEqual(containerPlugin)
    })

    test('overrides a plugin with the same name', () => {
      const otherPlugin = CorePlugin.extend({ name: 'core-plugin' })
      Loader.registerPlugin(corePlugin)
      const registered = Loader.registerPlugin(otherPlugin)

      expect(registered).toBeTruthy()
      expect(Loader.registeredPlugins.core['core-plugin']).toEqual(otherPlugin)
      expect(Loader.registeredPlugins.core['core-plugin']).not.toEqual(corePlugin)
    })
  })

  describe('registerPlayback', () => {
    let playback
    beforeEach(() => {
      playback = PlaybackPlugin.extend({ name: 'some-playback' })
    })

    afterEach(() => {
      Loader.clearPlaybacks()
    })

    test('rejects invalid playback parameter', () => {
      const registered = Loader.registerPlayback(undefined)

      expect(registered).toBeFalsy()
      expect(Loader.registeredPlaybacks).toEqual([])
    })

    test('rejects a plugin without a valid name', () => {
      const invalidPlayback = PlaybackPlugin.extend({ name: '' })
      const registered = Loader.registerPlayback(invalidPlayback)

      expect(registered).toBeFalsy()
      expect(Loader.registeredPlaybacks).toEqual([])
    })

    test('adds a playback to the registry', () => {
      const registered = Loader.registerPlayback(playback)

      expect(registered).toBeTruthy()
      expect(Loader.registeredPlaybacks.length).toBeGreaterThan(0)
      expect(Loader.registeredPlaybacks).toContain(playback)
    })

    test('overrides a playback with the same name', () => {
      const otherPlayback = PlaybackPlugin.extend({ name: 'some-playback' })
      Loader.registerPlugin(playback)
      const registered = Loader.registerPlayback(otherPlayback)

      expect(registered).toBeTruthy()
      expect(Loader.registeredPlaybacks).toContain(otherPlayback)
      expect(Loader.registeredPlaybacks).not.toContain(playback)
    })
  })

  describe('addExternalPlugins function', () => {
    test('extends the plugins array with the external ones', () => {
      const playbackPlugin = PlaybackPlugin.extend({ name: 'playbackPlugin' })
      playbackPlugin.canPlay = () => true
      const containerPlugin = ContainerPlugin.extend({ name: 'containerPlugin' })
      const corePlugin = CorePlugin.extend({ name: 'corePlugin' })

      const nativePlaybackPluginsCount = loader.playbackPlugins.length
      const nativeContainerPluginsCount = loader.containerPlugins.length
      const nativeCorePluginsCount = loader.corePlugins.length

      loader.addExternalPlugins({ playback: [playbackPlugin] })
      expect(loader.playbackPlugins.length).toEqual(nativePlaybackPluginsCount + 1)
      const selected = loader.playbackPlugins.filter((p) => p.canPlay('source'))[0]
      expect(selected.prototype.name).toEqual('playbackPlugin')

      loader.addExternalPlugins({ container: [containerPlugin] })
      expect(loader.containerPlugins.length).toEqual(nativeContainerPluginsCount + 1)

      loader.addExternalPlugins({ core: [corePlugin] })
      expect(loader.corePlugins.length).toEqual(nativeCorePluginsCount + 1)
    })

    test('supports an array of plugins and group them by type', () => {
      const playbackPlugin = PlaybackPlugin.extend({ name: 'playbackPlugin' })
      const containerPlugin = ContainerPlugin.extend({ name: 'containerPlugin' })
      const corePlugin = CorePlugin.extend({ name: 'corePlugin' })

      const nativePlaybackPluginsCount = loader.playbackPlugins.length
      const nativeContainerPluginsCount = loader.containerPlugins.length
      const nativeCorePluginsCount = loader.corePlugins.length

      loader.addExternalPlugins([playbackPlugin, containerPlugin, corePlugin])
      expect(loader.playbackPlugins.length).toEqual(nativePlaybackPluginsCount + 1)
      expect(loader.containerPlugins.length).toEqual(nativeContainerPluginsCount + 1)
      expect(loader.corePlugins.length).toEqual(nativeCorePluginsCount + 1)
    })

    describe('overriding plugins', () => {
      beforeEach(() => {
        loader.containerPlugins = [
          ...loader.containerPlugins,
          ContainerPlugin.extend({ name: 'spinner' })
        ]
      })

      test('prioritizes external plugins if their names collide', () => {
        const spinnerPlugin = ContainerPlugin.extend({ container: {}, name: 'spinner', myprop: 'myvalue' })

        expect(loader.containerPlugins.filter((plugin) => {
          return plugin.prototype.name === 'spinner'
        })[0]).not.toEqual(spinnerPlugin)

        loader.addExternalPlugins({ container: [spinnerPlugin] })

        const firstLoadedPlugin = loader.containerPlugins[0]
        expect(firstLoadedPlugin).toEqual(spinnerPlugin)
        expect(firstLoadedPlugin.prototype.myprop).toEqual('myvalue')
      })

      test('allows only one plugin with a given name', () => {
        const spinnerPlugin = ContainerPlugin.extend({ container: {}, name: 'spinner' })

        expect(loader.containerPlugins.filter((plugin) => {
          return plugin.prototype.name === 'spinner'
        }).length).toEqual(1)

        loader.addExternalPlugins({ container: [spinnerPlugin] })

        expect(loader.containerPlugins.filter((plugin) => {
          return plugin.prototype.name === 'spinner'
        }).length).toEqual(1)
      })

      // TODO: this behavior will change from 0.5.x on, preventing plugins from loading
      test('accepts plugins with missing version information', () => {
        const SomePlugin = ContainerPlugin.extend({ container: {},  name: 'plugin' })
        const loader = new Loader()

        loader.addExternalPlugins({ container: [SomePlugin] })

        expect(loader.containerPlugins.filter((plugin) => {
          return plugin.prototype.name === 'plugin'
        }).length).toEqual(1)
      })
    })

  })

  describe('validateExternalPluginsType function', () => {
    test('throws an exception if plugin type does not match where it\'s being added', () => {
      expect(() => { loader.validateExternalPluginsType({ core: [PlaybackPlugin] }) }).toThrow('external playback plugin on core array')
      expect(() => { loader.validateExternalPluginsType({ container: [PlaybackPlugin] }) }).toThrow('external playback plugin on container array')

      expect(() => { loader.validateExternalPluginsType({ core: [ContainerPlugin] }) }).toThrow('external container plugin on core array')
      expect(() => { loader.validateExternalPluginsType({ playback: [ContainerPlugin] }) }).toThrow('external container plugin on playback array')

      expect(() => { loader.validateExternalPluginsType({ container: [CorePlugin] }) }).toThrow('external core plugin on container array')
      expect(() => { loader.validateExternalPluginsType({ playback: [CorePlugin] }) }).toThrow('external core plugin on playback array')

      expect(() => { loader.validateExternalPluginsType({ core: [UIContainerPlugin] }) }).toThrow('external container plugin on core array')
      expect(() => { loader.validateExternalPluginsType({ playback: [UIContainerPlugin] }) }).toThrow('external container plugin on playback array')
    })
  })
})
