import CoreFactory from './core_factory'
import Core from '@/components/core'
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
})
