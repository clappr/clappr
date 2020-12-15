import CoreFactory from './core_factory'
import Core from '@/components/core'
import CorePlugin from '@/base/core_plugin'
import Player from '@/components/player'

describe('CoreFactory', () => {
  const bareOptions = { source: 'http://some.url/for/video.mp4' }
  const barePlayer = new Player(bareOptions)
  const bareFactory = new CoreFactory(barePlayer)

  test('creates player reference on constructor', () => {
    expect(bareFactory.player).toEqual(barePlayer)
  })

  test('have a getter called loader', () => {
    expect(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(bareFactory), 'loader').get).toBeTruthy()
  })

  test('loader getter returns current player loader reference', () => {
    expect(bareFactory.loader).toEqual(barePlayer.loader)
  })

  describe('create method', () => {
    const factory = new CoreFactory(barePlayer)
    jest.spyOn(factory, 'addCorePlugins')
    const coreInstance = factory.create()

    test('sets a loader instance into options reference', () => {
      expect(factory.options.loader).toEqual(barePlayer.loader)
    })

    test('sets a core instance into internal reference', () => {
      expect(factory.core instanceof Core).toBeTruthy()
    })

    test('calls addCorePlugins method', () => {
      expect(factory.addCorePlugins).toHaveBeenCalledTimes(1)
    })

    test('trigger container creation for the core instance', () => {
      expect(factory.core.activeContainer).not.toBeUndefined()
    })

    test('returns the internal core instance', () => {
      expect(coreInstance).toEqual(factory.core)
      expect(coreInstance instanceof Core).toBeTruthy()
    })
  })

  describe('addCorePlugins method', () => {
    const factory = new CoreFactory(barePlayer)
    const plugin = CorePlugin.extend({ name: 'test_plugin' })
    factory.loader.corePlugins = [plugin]
    factory.create()
    jest.spyOn(factory, 'setupExternalInterface')
    const coreInstance = factory.addCorePlugins()

    test('adds registered core plugins into the core instance', () => {
      expect(factory.core.getPlugin('test_plugin')).not.toBeUndefined()

      const pluginInstance = factory.core.getPlugin('test_plugin')

      expect(pluginInstance.core).toEqual(factory.core)
    })

    test('calls setupExternalInterface method for each plugin added', () => {
      expect(factory.setupExternalInterface).toHaveBeenCalledTimes(1)
    })

    test('returns the internal core instance', () => {
      expect(coreInstance).toEqual(factory.core)
      expect(coreInstance instanceof Core).toBeTruthy()
    })
  })

  describe('setupExternalInterface method', () => {
    class TestPlugin extends CorePlugin {
      get name() { return 'test_plugin' }
      constructor(core) {
        super(core)
        this.message = ''
      }
      addMessage(message) { this.message = message }
      getExternalInterface() { return { addMessage: message => this.addMessage(message) } }
    }

    const player = new Player(bareOptions)
    const factory = new CoreFactory(player)
    factory.loader.corePlugins = [TestPlugin]
    factory.create()
    factory.setupExternalInterface(factory.core.getPlugin('test_plugin'))

    test('binds registered methods in core plugins on Player component ', () => {
      expect(player.addMessage).not.toBeUndefined()

      player.addMessage('My awesome test!')

      expect(factory.core.getPlugin('test_plugin').message).toEqual('My awesome test!')
    })
  })
})
