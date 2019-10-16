import Loader from '../../src/components/loader'

import PlaybackPlugin from 'base/playback'
import CorePlugin from 'base/core_plugin'
import ContainerPlugin from 'base/container_plugin'
import UIContainerPlugin from 'base/ui_container_plugin'

describe('Loader', function () {
  let loader
  beforeEach(function () {
    loader = new Loader()
  })

  it('starts with an empty plugin registry', function() {
    expect(Loader.registeredPlugins.core).to.be.empty
    expect(Loader.registeredPlugins.container).to.be.empty
  })

  it('starts with an empty playback list', function() {
    expect(Loader.registeredPlaybacks).to.be.empty
  })

  describe('registerPlugin', function() {
    let corePlugin, containerPlugin
    beforeEach(function() {
      corePlugin = CorePlugin.extend({ name: 'core-plugin' })
      containerPlugin = ContainerPlugin.extend({ name: 'container-plugin' })
    })

    afterEach(function() {
      Loader.clearPlugins()
    })

    it('rejects invalid plugin parameter', function() {
      const registered = Loader.registerPlugin(undefined)

      expect(registered).to.be.false
      expect(Loader.registeredPlugins.core).to.be.empty
    })

    it('rejects a plugin without a valid name', function() {
      const plugin = CorePlugin.extend({ name: '' })
      const registered = Loader.registerPlugin(plugin)

      expect(registered).to.be.false
      expect(Loader.registeredPlugins.core).to.be.empty
    })

    it('adds a plugin to the corresponding scope registry', function() {
      let registered = Loader.registerPlugin(corePlugin)

      expect(registered).to.be.true
      expect(Loader.registeredPlugins.container).to.be.empty
      expect(Loader.registeredPlugins.core).to.not.be.empty
      expect(Loader.registeredPlugins.core).to.contain(corePlugin)

      registered = Loader.registerPlugin(containerPlugin)

      expect(registered).to.be.true
      expect(Loader.registeredPlugins.container).to.not.be.empty
      expect(Loader.registeredPlugins.container).to.contain(containerPlugin)
    })

    it('overrides a plugin with the same name', function() {
      const otherPlugin = CorePlugin.extend({ name: 'core-plugin' })
      Loader.registerPlugin(corePlugin)
      const registered = Loader.registerPlugin(otherPlugin)

      expect(registered).to.be.true
      expect(Loader.registeredPlugins.core).to.contain(otherPlugin)
      expect(Loader.registeredPlugins.core).to.not.contain(corePlugin)
    })
  })

  describe('registerPlayback', function() {
    let playback
    beforeEach(function() {
      playback = PlaybackPlugin.extend({ name: 'some-playback' })
    })

    afterEach(function() {
      Loader.clearPlaybacks()
    })

    it('rejects invalid playback parameter', function() {
      const registered = Loader.registerPlayback(undefined)

      expect(registered).to.be.false
      expect(Loader.registeredPlaybacks).to.be.empty
    })

    it('rejects a plugin without a valid name', function() {
      const invalidPlayback = PlaybackPlugin.extend({ name: '' })
      const registered = Loader.registerPlayback(invalidPlayback)

      expect(registered).to.be.false
      expect(Loader.registeredPlaybacks).to.be.empty
    })

    it('adds a playback to the registry', function() {
      const registered = Loader.registerPlayback(playback)

      expect(registered).to.be.true
      expect(Loader.registeredPlaybacks).to.not.be.empty
      expect(Loader.registeredPlaybacks).to.contain(playback)
    })

    it('overrides a playback with the same name', function() {
      const otherPlayback = PlaybackPlugin.extend({ name: 'some-playback' })
      Loader.registerPlugin(playback)
      const registered = Loader.registerPlayback(otherPlayback)

      expect(registered).to.be.true
      expect(Loader.registeredPlaybacks).to.contain(otherPlayback)
      expect(Loader.registeredPlaybacks).to.not.contain(playback)
    })
  })

  describe('addExternalPlugins function', function () {
    it('extends the plugins array with the external ones', function () {
      const playbackPlugin = PlaybackPlugin.extend({ name: 'playbackPlugin' })
      playbackPlugin.canPlay = () => true
      const containerPlugin = ContainerPlugin.extend({ name: 'containerPlugin' })
      const corePlugin = CorePlugin.extend({ name: 'corePlugin' })

      const nativePlaybackPluginsCount = loader.playbackPlugins.length
      const nativeContainerPluginsCount = loader.containerPlugins.length
      const nativeCorePluginsCount = loader.corePlugins.length

      loader.addExternalPlugins({ playback: [playbackPlugin] })
      expect(loader.playbackPlugins.length).to.be.equal(nativePlaybackPluginsCount + 1)
      const selected = loader.playbackPlugins.filter((p) => p.canPlay('source'))[0]
      expect(selected.prototype.name).to.eq('playbackPlugin')

      loader.addExternalPlugins({ container: [containerPlugin] })
      expect(loader.containerPlugins.length).to.be.equal(nativeContainerPluginsCount + 1)

      loader.addExternalPlugins({ core: [corePlugin] })
      expect(loader.corePlugins.length).to.be.equal(nativeCorePluginsCount + 1)
    })

    it('supports an array of plugins and group them by type', function () {
      const playbackPlugin = PlaybackPlugin.extend({ name: 'playbackPlugin' })
      const containerPlugin = ContainerPlugin.extend({ name: 'containerPlugin' })
      const corePlugin = CorePlugin.extend({ name: 'corePlugin' })

      const nativePlaybackPluginsCount = loader.playbackPlugins.length
      const nativeContainerPluginsCount = loader.containerPlugins.length
      const nativeCorePluginsCount = loader.corePlugins.length

      loader.addExternalPlugins([playbackPlugin, containerPlugin, corePlugin])
      expect(loader.playbackPlugins.length).to.be.equal(nativePlaybackPluginsCount + 1)
      expect(loader.containerPlugins.length).to.be.equal(nativeContainerPluginsCount + 1)
      expect(loader.corePlugins.length).to.be.equal(nativeCorePluginsCount + 1)
    })

    describe('overriding plugins', function () {
      beforeEach(function() {
        loader.containerPlugins = [
          ...loader.containerPlugins,
          ContainerPlugin.extend({ name: 'spinner' })
        ]
      })

      it('prioritizes external plugins if their names collide', function () {
        const spinnerPlugin = ContainerPlugin.extend({ container: {}, name: 'spinner', myprop: 'myvalue' })

        expect(loader.containerPlugins.filter((plugin) => {
          return plugin.prototype.name === 'spinner'
        })[0]).to.not.be.equal(spinnerPlugin)

        loader.addExternalPlugins({ container: [spinnerPlugin] })

        const firstLoadedPlugin = loader.containerPlugins[0]
        expect(firstLoadedPlugin).to.be.equal(spinnerPlugin)
        expect(firstLoadedPlugin.prototype.myprop).to.be.equal('myvalue')
      })

      it('allows only one plugin with a given name', function () {
        const spinnerPlugin = ContainerPlugin.extend({ container: {}, name: 'spinner' })

        expect(loader.containerPlugins.filter((plugin) => {
          return plugin.prototype.name === 'spinner'
        }).length).to.be.equal(1)

        loader.addExternalPlugins({ container: [spinnerPlugin] })

        expect(loader.containerPlugins.filter((plugin) => {
          return plugin.prototype.name === 'spinner'
        }).length).to.be.equal(1)
      })

      // TODO: this behavior will change from 0.5.x on, preventing plugins from loading
      it('accepts plugins with missing version information', function() {
        const SomePlugin = ContainerPlugin.extend({ container: {},  name: 'plugin' })
        const loader = new Loader()

        loader.addExternalPlugins({ container: [SomePlugin] })

        expect(loader.containerPlugins.filter((plugin) => {
          return plugin.prototype.name === 'plugin'
        }).length).to.be.equal(1)
      })
    })

  })

  describe('validateExternalPluginsType function', function () {
    it('throws an exception if plugin type does not match where it\'s being added', function () {
      expect(function () { loader.validateExternalPluginsType({ core: [PlaybackPlugin] }) }).to.throw('external playback plugin on core array')
      expect(function () { loader.validateExternalPluginsType({ container: [PlaybackPlugin] }) }).to.throw('external playback plugin on container array')

      expect(function () { loader.validateExternalPluginsType({ core: [ContainerPlugin] }) }).to.throw('external container plugin on core array')
      expect(function () { loader.validateExternalPluginsType({ playback: [ContainerPlugin] }) }).to.throw('external container plugin on playback array')

      expect(function () { loader.validateExternalPluginsType({ container: [CorePlugin] }) }).to.throw('external core plugin on container array')
      expect(function () { loader.validateExternalPluginsType({ playback: [CorePlugin] }) }).to.throw('external core plugin on playback array')

      expect(function () { loader.validateExternalPluginsType({ core: [UIContainerPlugin] }) }).to.throw('external container plugin on core array')
      expect(function () { loader.validateExternalPluginsType({ playback: [UIContainerPlugin] }) }).to.throw('external container plugin on playback array')
    })
  })
})
