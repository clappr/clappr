import Loader from '../../src/components/loader'

import PlaybackPlugin from 'base/playback'
import CorePlugin from 'base/core_plugin'
import ContainerPlugin from 'base/container_plugin'
import UICorePlugin from 'base/ui_core_plugin'
import UIContainerPlugin from 'base/ui_container_plugin'

describe('Loader', function() {
  describe('getPlugin function', function() {
    it('should return plugin based on its name', function() {
      var fooPlugin = {prototype: {name: 'foo'}}
      var barPlugin = {prototype: {name: 'bar'}}

      var loader = new Loader({playback: [fooPlugin, barPlugin]})
      expect(loader.getPlugin('foo')).to.be.equal(fooPlugin)
    })

    it('should search for any type of plugin', function() {
      var playbackPlugin = {prototype: {name: 'playbackPlugin'}}
      var containerPlugin = {prototype: {name: 'containerPlugin'}}
      var corePlugin = {prototype: {name: 'corePlugin'}}

      var loader = new Loader({playback: [playbackPlugin], container: [containerPlugin], core: [corePlugin]})

      expect(loader.getPlugin('playbackPlugin')).to.be.equal(playbackPlugin)
      expect(loader.getPlugin('containerPlugin')).to.be.equal(containerPlugin)
      expect(loader.getPlugin('corePlugin')).to.be.equal(corePlugin)
    })
  })

  describe('addExternalPlugins function', function() {
    it("should extend the plugins array with the external ones", function() {
      var playbackPlugin = {prototype: {name: 'playbackPlugin'}}
      var containerPlugin = {prototype: {name: 'containerPlugin'}}
      var corePlugin = {prototype: {name: 'corePlugin'}}

      var loader = new Loader()

      var nativePlaybackPluginsCount = loader.playbackPlugins.length
      var nativeContainerPluginsCount = loader.containerPlugins.length
      var nativeCorePluginsCount = loader.corePlugins.length

      loader.addExternalPlugins({playback: [playbackPlugin]})
      expect(loader.playbackPlugins.length).to.be.equal(nativePlaybackPluginsCount + 1)

      loader.addExternalPlugins({container: [containerPlugin]})
      expect(loader.containerPlugins.length).to.be.equal(nativeContainerPluginsCount + 1)

      loader.addExternalPlugins({core: [corePlugin]})
      expect(loader.corePlugins.length).to.be.equal(nativeCorePluginsCount + 1)
    })

    it("should prioritize external plugins if their names collide", function() {
      var playbackPlugin = {prototype: {name: 'flash'}}
      var loader = new Loader()
      loader.addExternalPlugins({playback: [playbackPlugin]})

      expect(loader.getPlugin('flash')).to.be.equal(playbackPlugin)
    })
  })

  describe('checkExternalPluginsType function', function() {
    it('should throw an exception if its not core plugin', function() {
      var loader = new Loader()

      var playbackPlugin = new PlaybackPlugin()
      expect(function() { loader.checkExternalPluginsType({core: [playbackPlugin]}) }).to.throw('external playback plugin on core array')
      expect(function() { loader.checkExternalPluginsType({container: [playbackPlugin]}) }).to.throw('external playback plugin on container array')

      var containerPlugin = new ContainerPlugin({container: {}})
      expect(function() { loader.checkExternalPluginsType({core: [containerPlugin]}) }).to.throw('external container plugin on core array')
      expect(function() { loader.checkExternalPluginsType({playback: [containerPlugin]}) }).to.throw('external container plugin on playback array')

      var corePlugin = new CorePlugin()
      expect(function() { loader.checkExternalPluginsType({container: [corePlugin]}) }).to.throw('external core plugin on container array')
      expect(function() { loader.checkExternalPluginsType({playback: [corePlugin]}) }).to.throw('external core plugin on playback array')

      var uiContainerPlugin = new UIContainerPlugin({container: {}})
      expect(function() { loader.checkExternalPluginsType({core: [uiContainerPlugin]}) }).to.throw('external container plugin on core array')
      expect(function() { loader.checkExternalPluginsType({playback: [uiContainerPlugin]}) }).to.throw('external container plugin on playback array')

      UICorePlugin.prototype.render = function() {}
      var uiCorePlugin = new UICorePlugin()
      expect(function() { loader.checkExternalPluginsType({container: [uiCorePlugin]}) }).to.throw('external core plugin on container array')
      expect(function() { loader.checkExternalPluginsType({playback: [uiCorePlugin]}) }).to.throw('external core plugin on playback array')
    })
  })
})
