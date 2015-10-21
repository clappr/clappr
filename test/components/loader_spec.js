import Loader from '../../src/components/loader'

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
})
