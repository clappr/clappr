import CoreFactory from './core_factory'
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
})
