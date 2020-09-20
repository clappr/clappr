import Loader from './loader'

import PlaybackPlugin from '@/base/playback'
import CorePlugin from '@/base/core_plugin'
import ContainerPlugin from '@/base/container_plugin'
import UIContainerPlugin from '@/base/ui_container_plugin'

describe('Loader', () => {
  test('starts with an empty plugin registry', () => {
    expect(Loader.registeredPlugins.core).toEqual({})
    expect(Loader.registeredPlugins.container).toEqual({})
  })

  test('starts with an empty playback list', () => {
    expect(Loader.registeredPlaybacks).toEqual([])
  })

  describe('checkVersionSupport function', () => {
    let corePlugin, containerPlugin
    beforeEach(() => {
      corePlugin = CorePlugin.extend({ name: 'core-plugin', supportedVersion: { min: '0.4.0' } })
      containerPlugin = ContainerPlugin.extend({ name: 'container-plugin', supportedVersion: { min: '0.4.0', max: '9.9.9' } })
    })

    afterEach(() => {
      Loader.clearPlugins()
    })

    test('inform missing supportedVersion config', () => {
      const plugin = CorePlugin.extend({ name: 'core-plugin', supportedVersion: {} })

      const hasPluginMinimumSupportedVersion = Loader.checkVersionSupport(plugin)

      expect(hasPluginMinimumSupportedVersion).toBeFalsy()
    })

    test('uses min version to stipulate the not informed max version', () => {
      const isClapprVersionSupported = Loader.checkVersionSupport(corePlugin)

      expect(isClapprVersionSupported).toBeTruthy()
    })

    test('inform the version incompatibility', () => {
      const plugin = CorePlugin.extend({ name: 'core-plugin', supportedVersion: { min: '0.4.0', max: '0.4.1' } })

      const hasPluginMinimumSupportedVersion = Loader.checkVersionSupport(plugin)

      expect(hasPluginMinimumSupportedVersion).toBeFalsy()
    })

    test('inform the version compatibility', () => {
      const hasPluginMinimumSupportedVersion = Loader.checkVersionSupport(containerPlugin)

      expect(hasPluginMinimumSupportedVersion).toBeTruthy()
    })
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

  describe('unregisterPlugin', () => {
    let corePlugin, containerPlugin
    beforeEach(() => {
      corePlugin = CorePlugin.extend({ name: 'core-plugin' })
      containerPlugin = ContainerPlugin.extend({ name: 'container-plugin' })
    })

    afterEach(() => {
      Loader.clearPlugins()
    })

    test('rejects invalid plugin parameter', () => {
      Loader.registerPlugin(corePlugin)
      const unregistered = Loader.unregisterPlugin(undefined)

      expect(unregistered).toBeFalsy()
      expect(Loader.registeredPlugins.core['core-plugin']).toEqual(corePlugin)
    })

    test('rejects unregistered plugin parameter', () => {
      Loader.registerPlugin(corePlugin)
      const unregistered = Loader.unregisterPlugin('unregistered-plugin')

      expect(unregistered).toBeFalsy()
      expect(Loader.registeredPlugins.core['core-plugin']).toEqual(corePlugin)
    })

    test('remove a plugin from the corresponding scope registry', () => {
      let registered = Loader.registerPlugin(corePlugin)

      expect(registered).toBeTruthy()
      expect(Loader.registeredPlugins.core['core-plugin']).toEqual(corePlugin)

      registered = Loader.registerPlugin(containerPlugin)

      expect(registered).toBeTruthy()

      let unregistered = Loader.unregisterPlugin('core-plugin')

      expect(unregistered).toBeTruthy()
      expect(Loader.registeredPlugins.core).toEqual({})
      expect(Loader.registeredPlugins.container['container-plugin']).toEqual(containerPlugin)

      unregistered = Loader.unregisterPlugin('container-plugin')

      expect(unregistered).toBeTruthy()
      expect(Loader.registeredPlugins.container).toEqual({})
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

    test('rejects a playback without a valid name', () => {
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
      Loader.registerPlayback(playback)
      const registered = Loader.registerPlayback(otherPlayback)

      expect(registered).toBeTruthy()
      expect(Loader.registeredPlaybacks).toContain(otherPlayback)
      expect(Loader.registeredPlaybacks).not.toContain(playback)
    })
  })

  describe('unregisterPlayback', () => {
    let playback
    beforeEach(() => {
      playback = PlaybackPlugin.extend({ name: 'some-playback' })
    })

    afterEach(() => {
      Loader.clearPlaybacks()
    })

    test('rejects invalid plugin parameter', () => {
      Loader.registerPlayback(playback)
      const unregistered = Loader.unregisterPlayback(undefined)

      expect(unregistered).toBeFalsy()
      expect(Loader.registeredPlaybacks[0]).toEqual(playback)
    })

    test('rejects unregistered playback parameter', () => {
      Loader.registerPlayback(playback)
      const unregistered = Loader.unregisterPlayback('unregistered-playback')

      expect(unregistered).toBeFalsy()
      expect(Loader.registeredPlaybacks[0]).toEqual(playback)
    })

    test('removes a playback', () => {
      const registered = Loader.registerPlayback(playback)

      expect(registered).toBeTruthy()
      expect(Loader.registeredPlaybacks[0]).toEqual(playback)


      const unregistered = Loader.unregisterPlayback('some-playback')

      expect(unregistered).toBeTruthy()
      expect(Loader.registeredPlaybacks).toEqual([])
    })
  })

  describe('addExternalPlugins function', () => {
    test('extends the plugins array with the external ones', () => {
      const loader = new Loader()
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
      const loader = new Loader()
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

    test('supports load externals before default plugins for loadExternalPluginsFirst option not configured', () => {
      const defaultContainerPlugin = ContainerPlugin.extend({ name: 'default_container_plugin' })
      const defaultCorePlugin = CorePlugin.extend({ name: 'default_core_plugin' })

      Loader.registerPlugin(defaultContainerPlugin)
      Loader.registerPlugin(defaultCorePlugin)

      const loader = new Loader()

      const externalContainerPlugin = ContainerPlugin.extend({ name: 'external_container_plugin' })
      const externalCorePlugin = CorePlugin.extend({ name: 'external_core_plugin' })

      loader.addExternalPlugins({ core: [externalCorePlugin], container: [externalContainerPlugin] })

      expect(loader.containerPlugins[0].prototype.name).toEqual(externalContainerPlugin.prototype.name)
      expect(loader.containerPlugins[1].prototype.name).toEqual(defaultContainerPlugin.prototype.name)

      expect(loader.corePlugins[0].prototype.name).toEqual(externalCorePlugin.prototype.name)
      expect(loader.corePlugins[1].prototype.name).toEqual(defaultCorePlugin.prototype.name)

      Loader.unregisterPlugin(defaultContainerPlugin.prototype.name)
      Loader.unregisterPlugin(defaultCorePlugin.prototype.name)
    })

    test('supports load externals before default playbacks for loadExternalPlaybacksFirst option not configured', () => {
      const defaultPlaybackPlugin = PlaybackPlugin.extend({ name: 'default_playback_plugin' })

      Loader.registerPlayback(defaultPlaybackPlugin)

      const loader = new Loader()

      const externalPlaybackPlugin = PlaybackPlugin.extend({ name: 'external_playback_plugin' })

      loader.addExternalPlugins({ playback: [externalPlaybackPlugin] })

      expect(loader.playbackPlugins[0].prototype.name).toEqual(externalPlaybackPlugin.prototype.name)
      expect(loader.playbackPlugins[1].prototype.name).toEqual(defaultPlaybackPlugin.prototype.name)

      Loader.unregisterPlayback(defaultPlaybackPlugin.prototype.name)
    })

    test('supports load externals after default plugins for loadExternalPluginsFirst option configured with false value', () => {
      const defaultContainerPlugin = ContainerPlugin.extend({ name: 'default_container_plugin' })
      const defaultCorePlugin = CorePlugin.extend({ name: 'default_core_plugin' })

      Loader.registerPlugin(defaultContainerPlugin)
      Loader.registerPlugin(defaultCorePlugin)

      const loader = new Loader()

      const externalContainerPlugin = ContainerPlugin.extend({ name: 'external_container_plugin' })
      const externalCorePlugin = CorePlugin.extend({ name: 'external_core_plugin' })

      loader.addExternalPlugins({ loadExternalPluginsFirst: false, core: [externalCorePlugin], container: [externalContainerPlugin] })

      expect(loader.containerPlugins[0].prototype.name).toEqual('default_container_plugin')
      expect(loader.containerPlugins[1].prototype.name).toEqual('external_container_plugin')

      expect(loader.corePlugins[0].prototype.name).toEqual('default_core_plugin')
      expect(loader.corePlugins[1].prototype.name).toEqual('external_core_plugin')

      Loader.unregisterPlugin(defaultContainerPlugin.prototype.name)
      Loader.unregisterPlugin(defaultCorePlugin.prototype.name)
    })

    test('supports load externals after default playbacks for loadExternalPlaybacksFirst option configured with false value', () => {
      const defaultPlaybackPlugin = PlaybackPlugin.extend({ name: 'default_playback_plugin' })

      Loader.registerPlayback(defaultPlaybackPlugin)

      const loader = new Loader()

      const externalPlaybackPlugin = PlaybackPlugin.extend({ name: 'external_playback_plugin' })

      loader.addExternalPlugins({ loadExternalPlaybacksFirst: false, playback: [externalPlaybackPlugin] })

      expect(loader.playbackPlugins[0].prototype.name).toEqual(defaultPlaybackPlugin.prototype.name)
      expect(loader.playbackPlugins[1].prototype.name).toEqual(externalPlaybackPlugin.prototype.name)

      Loader.unregisterPlayback(defaultPlaybackPlugin.prototype.name)
    })

    describe('overriding plugins', () => {
      let loader

      beforeEach(() => {
        loader = new Loader()
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

    test('respected even when loadExternalPluginsFirst is configured with false value', () => {
      const defaultContainerPlugin = ContainerPlugin.extend({ name: 'container_plugin' })
      const defaultCorePlugin = CorePlugin.extend({ name: 'core_plugin' })

      Loader.registerPlugin(defaultContainerPlugin)
      Loader.registerPlugin(defaultCorePlugin)

      const loader = new Loader()

      const externalContainerPlugin = ContainerPlugin.extend({ name: 'container_plugin' })
      const externalCorePlugin = CorePlugin.extend({ name: 'core_plugin' })

      loader.addExternalPlugins({ loadExternalPluginsFirst: false, core: [externalCorePlugin], container: [externalContainerPlugin] })

      expect(loader.containerPlugins.length).toEqual(1)
      expect(loader.containerPlugins[0].prototype.name).toEqual(externalContainerPlugin.prototype.name)

      expect(loader.corePlugins.length).toEqual(1)
      expect(loader.corePlugins[0].prototype.name).toEqual(externalCorePlugin.prototype.name)

      Loader.unregisterPlugin(defaultContainerPlugin.prototype.name)
      Loader.unregisterPlugin(defaultCorePlugin.prototype.name)
    })

    test('respected even when loadExternalPlaybacksFirst is configured with false value', () => {
      const defaultPlaybackPlugin = PlaybackPlugin.extend({ name: 'playback_plugin' })

      Loader.registerPlayback(defaultPlaybackPlugin)

      const loader = new Loader()

      const externalPlaybackPlugin = PlaybackPlugin.extend({ name: 'playback_plugin' })

      loader.addExternalPlugins({ loadExternalPlaybacksFirst: false, playback: [externalPlaybackPlugin] })

      expect(loader.playbackPlugins.length).toEqual(1)
      expect(loader.playbackPlugins[0].prototype.name).toEqual(externalPlaybackPlugin.prototype.name)

      Loader.unregisterPlayback(defaultPlaybackPlugin.prototype.name)
    })
  })

  describe('validateExternalPluginsType function', () => {
    test('throws an exception if plugin type does not match where it\'s being added', () => {
      const loader = new Loader()

      expect(() => { loader.validateExternalPluginsType({ core: [PlaybackPlugin] }) }).toThrow('external playback plugin on core array')
      expect(() => { loader.validateExternalPluginsType({ container: [PlaybackPlugin] }) }).toThrow('external playback plugin on container array')

      expect(() => { loader.validateExternalPluginsType({ core: [ContainerPlugin] }) }).toThrow('external container plugin on core array')
      expect(() => { loader.validateExternalPluginsType({ playback: [ContainerPlugin] }) }).toThrow('external container plugin on playback array')

      expect(() => { loader.validateExternalPluginsType({ container: [CorePlugin] }) }).toThrow('external core plugin on container array')
      expect(() => { loader.validateExternalPluginsType({ playback: [CorePlugin] }) }).toThrow('external core plugin on playback array')

      expect(() => { loader.validateExternalPluginsType({ core: [UIContainerPlugin] }) }).toThrow('external container plugin on core array')
      expect(() => { loader.validateExternalPluginsType({ playback: [UIContainerPlugin] }) }).toThrow('external container plugin on playback array')

      const core = CorePlugin.extend({ name: 'core-plugin' })
      const container = ContainerPlugin.extend({ name: 'container-plugin' })
      const playback = PlaybackPlugin.extend({ name: 'some-playback' })

      const loader1 = new Loader({
        core: [core],
        container: [container],
        playback: [playback],
      })

      expect(loader1.corePlugins[0]).toEqual(core)
      expect(loader1.containerPlugins[0]).toEqual(container)
      expect(loader1.playbackPlugins[0]).toEqual(playback)
    })
  })
})
