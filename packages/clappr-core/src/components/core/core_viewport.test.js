import Core from './core'
import Events from '../../base/events/events'

const FULL_HD = { width: 1920, height: 1080 }
const HD = { width: 1280, height: 720 }
const PX_VIEWPORT = { scale: 0.5, position: 'top-left', margin: 20, useTransform: false }
const RESIZE_PAYLOAD = { width: '100%', height: '100%' }
const VIEWPORT_EVENTS = [Events.CONTAINER_VIEWPORT_WILL_CHANGE, Events.CONTAINER_VIEWPORT_DID_CHANGE]

const flush = async () => {
  for (let i = 0; i < 5; i++) await Promise.resolve()
}

const track = (promise) => {
  const state = { settled: false, value: undefined }
  promise.then((value) => { state.settled = true; state.value = value })
  return state
}

const recordEvents = (container) => {
  const recorded = []
  VIEWPORT_EVENTS.forEach((name) => container.on(name, (payload) => recorded.push({ name, payload })))
  return recorded
}

const watch = (container) => {
  vi.spyOn(container.playback, 'setDisplayRect')
  return recordEvents(container)
}

const fireTransitionEnd = (target, propertyName) => {
  const event = new Event('transitionend', { bubbles: true })
  Object.defineProperty(event, 'propertyName', { value: propertyName })
  target.dispatchEvent(event)
}

describe('Core container viewport', () => {
  let core
  let parent
  let size

  const setSize = ({ width, height }) => Object.assign(size, { width, height })
  const triggerCoreResize = () => core.trigger(Events.CORE_RESIZE, RESIZE_PAYLOAD)

  beforeEach(() => {
    vi.useFakeTimers()
    parent = document.createElement('div')
    document.body.appendChild(parent)
    size = { ...HD }
    const options = {
      width: HD.width,
      height: HD.height,
      parentElement: parent,
      sources: ['one.mp4', 'two.mp4'],
      loader: { playbackPlugins: [], containerPlugins: [] }
    }
    core = new Core(options)
    Object.defineProperty(core.el, 'clientWidth', { get: () => size.width, configurable: true })
    Object.defineProperty(core.el, 'clientHeight', { get: () => size.height, configurable: true })
    core.createContainers(options)
  })

  afterEach(() => {
    core.destroy()
    parent.remove()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  test('core polling triggers CORE_RESIZE every 500 ms with the measured size', () => {
    const callback = vi.fn()
    core.on(Events.CORE_RESIZE, callback)
    setSize({ width: 1500, height: 800 })

    vi.advanceTimersByTime(499)
    expect(callback).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith({ width: 1500, height: 800 })
  })

  test('reapplies on core resize', () => {
    const [container] = core.containers
    const events = watch(container)
    container.setViewport(PX_VIEWPORT)
    events.length = 0
    container.playback.setDisplayRect.mockClear()
    setSize(FULL_HD)

    triggerCoreResize()

    const rect = { x: 20, y: 20, width: 960, height: 540 }
    expect(container.el.style.width).toBe('960px')
    expect(container.playback.setDisplayRect).toHaveBeenCalledTimes(1)
    expect(container.playback.setDisplayRect).toHaveBeenCalledWith(rect)
    expect(events.map(({ name, payload }) => [name, payload.rect])).toEqual([
      [Events.CONTAINER_VIEWPORT_WILL_CHANGE, rect],
      [Events.CONTAINER_VIEWPORT_DID_CHANGE, rect]
    ])
    expect(container.el.style.transition).toBe('')
  })

  test('reapplies on core resize with a settled animated transform', async () => {
    const [container] = core.containers
    const events = watch(container)
    container.setViewport({ ...PX_VIEWPORT, useTransform: true, animate: true })
    await vi.advanceTimersByTimeAsync(400)
    events.length = 0
    setSize(FULL_HD)

    triggerCoreResize()

    const rect = { x: 20, y: 20, width: 960, height: 540 }
    expect(events.map(({ payload }) => payload.rect)).toEqual([rect, rect])
    expect(container.el.style.transition).toBe('')
  })

  test('skips an unchanged rect on core resize', () => {
    const [container] = core.containers
    const events = watch(container)
    container.setViewport(PX_VIEWPORT)
    events.length = 0
    container.playback.setDisplayRect.mockClear()

    triggerCoreResize()

    expect(events).toEqual([])
    expect(container.playback.setDisplayRect).toHaveBeenCalledTimes(0)
  })

  test('leaves a container without a viewport alone on core resize', () => {
    const [first, second] = core.containers
    watch(first)
    const secondEvents = watch(second)
    first.setViewport(PX_VIEWPORT)
    const styleBefore = second.el.getAttribute('style')
    setSize(FULL_HD)

    triggerCoreResize()

    expect(second.el.getAttribute('style')).toBe(styleBefore)
    expect(secondEvents).toEqual([])
    expect(second.playback.setDisplayRect).toHaveBeenCalledTimes(0)
  })

  test('keeps the viewport across fullscreen', () => {
    const [container] = core.containers
    watch(container)
    container.setViewport(PX_VIEWPORT)
    const isFullscreen = vi.spyOn(core, 'isFullscreen').mockReturnValue(true)
    setSize(FULL_HD)
    core.handleFullscreenChange()

    vi.advanceTimersByTime(500)

    expect(container.playback.setDisplayRect).toHaveBeenLastCalledWith({ x: 20, y: 20, width: 960, height: 540 })

    isFullscreen.mockReturnValue(false)
    setSize(HD)
    core.handleFullscreenChange()

    expect(container.playback.setDisplayRect).toHaveBeenLastCalledWith({ x: 20, y: 20, width: 640, height: 360 })
  })

  test('retargets a pending animation on core resize', async () => {
    const [container] = core.containers
    const events = watch(container)
    const call = track(container.setViewport({
      position: 'top-left', margin: { right: 320, bottom: 180 }, useTransform: true, animate: true
    }))
    expect(container.el.style.transform).toBe('translate(0px, 0px) scale(0.75)')
    events.length = 0
    setSize({ width: 2560, height: 1440 })

    triggerCoreResize()
    await flush()

    const rect = { x: 0, y: 0, width: 2240, height: 1260 }
    expect(container.el.style.transform).toBe('translate(0px, 0px) scale(0.875)')
    expect(events.map(({ name, payload }) => [name, payload.rect])).toEqual([[Events.CONTAINER_VIEWPORT_WILL_CHANGE, rect]])
    expect(call.settled).toBe(false)

    fireTransitionEnd(container.el, 'transform')
    await flush()

    expect(events.map(({ name }) => name)).toEqual(VIEWPORT_EVENTS)
    expect(events[1].payload.rect).toEqual(rect)
    expect(call.value).toEqual({ interrupted: false, rect })
  })

  test('restarts the settle timer when a resize retargets a pending animation', async () => {
    const [container] = core.containers
    const events = watch(container)
    const call = track(container.setViewport({ ...PX_VIEWPORT, useTransform: true, animate: true, duration: 1000 }))
    events.length = 0

    await vi.advanceTimersByTimeAsync(900)
    setSize(FULL_HD)
    triggerCoreResize()
    await flush()

    const rect = { x: 20, y: 20, width: 960, height: 540 }
    await vi.advanceTimersByTimeAsync(1099)
    await flush()
    expect(call.settled).toBe(false)
    expect(events.map(({ name }) => name)).toEqual([Events.CONTAINER_VIEWPORT_WILL_CHANGE])

    await vi.advanceTimersByTimeAsync(1)
    await flush()

    expect(call.value).toEqual({ interrupted: false, rect })
    expect(events.map(({ name }) => name)).toEqual(VIEWPORT_EVENTS)
    expect(events[1].payload.rect).toEqual(rect)
  })

  test('ignores core resize without parentElement', () => {
    const [container] = core.containers
    const events = watch(container)
    container.setViewport(PX_VIEWPORT)
    container.el.remove()
    events.length = 0
    const styleBefore = container.el.getAttribute('style')
    setSize(FULL_HD)

    expect(() => triggerCoreResize()).not.toThrow()

    expect(container.el.getAttribute('style')).toBe(styleBefore)
    expect(events).toEqual([])
  })

  test('reapplies on a container from createContainer', () => {
    const container = core.createContainer('three.mp4')
    watch(container)
    container.setViewport(PX_VIEWPORT)
    setSize(FULL_HD)

    triggerCoreResize()

    expect(container.playback.setDisplayRect).toHaveBeenLastCalledWith({ x: 20, y: 20, width: 960, height: 540 })
  })

  test('destroyed container ignores core resize', () => {
    const [container] = core.containers
    const events = watch(container)
    container.setViewport(PX_VIEWPORT)
    container.destroy()
    container.playback.setDisplayRect.mockClear()
    events.length = 0
    setSize(FULL_HD)

    triggerCoreResize()

    expect(container.playback.setDisplayRect).toHaveBeenCalledTimes(0)
    expect(events).toEqual([])
  })

  test('a container created by load starts without a viewport', () => {
    const [container] = core.containers
    container.setViewport({ ...PX_VIEWPORT, useTransform: true })

    core.load(['three.mp4'])

    const fresh = core.activeContainer
    expect(fresh).not.toBe(container)
    expect(fresh.viewport).toEqual({ rect: { x: 0, y: 0, ...HD }, viewport: null })
    const { top, left, width, height, transform, transformOrigin, transition } = fresh.el.style
    expect([top, left, width, height, transform, transformOrigin, transition]).toEqual(['', '', '', '', '', '', ''])
  })
})

describe('Core container viewport set during setup', () => {
  test('reapplies a viewport set before the core is attached', () => {
    vi.useFakeTimers()
    const parent = document.createElement('div')
    document.body.appendChild(parent)
    const options = {
      width: HD.width,
      height: HD.height,
      parentElement: parent,
      sources: ['one.mp4'],
      loader: { playbackPlugins: [], containerPlugins: [] }
    }
    const core = new Core(options)
    const measured = () => (core.el.isConnected ? HD : { width: 0, height: 0 })
    Object.defineProperty(core.el, 'clientWidth', { get: () => measured().width, configurable: true })
    Object.defineProperty(core.el, 'clientHeight', { get: () => measured().height, configurable: true })
    core.on(Events.CORE_ACTIVE_CONTAINER_CHANGED, (container) => container.setViewport(PX_VIEWPORT))

    core.createContainers(options)

    const { rect } = core.activeContainer.viewport
    expect(rect).toEqual({ x: 20, y: 20, width: 640, height: 360 })
    expect(core.activeContainer.el.style.width).toBe('640px')
    expect(core.activeContainer.el.style.height).toBe('360px')

    core.destroy()
    parent.remove()
    vi.useRealTimers()
  })
})
