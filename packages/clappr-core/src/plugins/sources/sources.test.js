import SourcesPlugin from './sources'
import Playback from '@/base/playback'
import NoOp from '@/playbacks/no_op'
import Container from '@/components/container'
import Core from '@/components/core'
import Events from '@/base/events'

const createContainersArray = (options, quantity) => {
  const containers = []

  for (let i = 0; i < quantity; i++)
    containers.push(new Container(options))

  return containers
}

describe('SourcesPlugin', () => {
  window.HTMLMediaElement.prototype.load = () => { /* do nothing */ }

  test('is loaded on core plugins array', () => {
    const core = new Core({})
    const plugin = new SourcesPlugin(core)
    core.addPlugin(plugin)

    expect(core.getPlugin(plugin.name).name).toEqual('sources')
  })

  test('is compatible with the latest Clappr core version', () => {
    const core = new Core({})
    const plugin = new SourcesPlugin(core)
    core.addPlugin(plugin)

    expect(core.getPlugin(plugin.name).supportedVersion).toEqual({ min: VERSION })
  })

  test('guarantees only one container rendered', () => {
    const callback = jest.fn()

    const containerOptions = { playback: new Playback() }

    const containersArray = createContainersArray(containerOptions, 3)

    const core = new Core({})
    const plugin = new SourcesPlugin(core)

    core.containers = containersArray
    core.containers.forEach(container => plugin.listenTo(container, Events.CONTAINER_DESTROYED, callback))
    core.trigger(Events.CORE_CONTAINERS_CREATED)

    expect(callback).toHaveBeenCalledTimes(2)
  })

  test('destroys containers with NoOp playback', () => {
    const callback = jest.fn()

    const containerOptions = { playback: new NoOp() }

    const containers = createContainersArray(containerOptions, 5)
    const validContainer = new Container({ playback: new Playback() })
    const core = new Core({})
    const plugin = new SourcesPlugin(core)

    core.containers = containers
    core.containers.push(validContainer)
    core.containers.forEach(container => plugin.listenTo(container, Events.CONTAINER_DESTROYED, callback))
    plugin.listenTo(validContainer, Events.CORE_CONTAINERS_CREATED, callback)
    core.trigger(Events.CORE_CONTAINERS_CREATED)

    expect(callback).toHaveBeenCalledTimes(5)
  })
})
