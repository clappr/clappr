import Container from '../container'
import Playback from '../../../base/playback/playback'
import Events from '../../../base/events/events'

const FULL = { x: 0, y: 0, width: 1280, height: 720 }
const RECT_HALF_CENTER = { x: 320, y: 180, width: 640, height: 360 }
const RECT_HALF_TOP_LEFT = { x: 20, y: 20, width: 640, height: 360 }
const TRANSFORM_ANIMATED = { scale: 0.5, useTransform: true, animate: true }
const VIEWPORT_EVENTS = [
  Events.CONTAINER_VIEWPORT_WILL_CHANGE,
  Events.CONTAINER_VIEWPORT_DID_CHANGE
]

const measure = (el, width, height) => {
  Object.defineProperty(el, 'clientWidth', { value: width, configurable: true })
  Object.defineProperty(el, 'clientHeight', { value: height, configurable: true })
}

const createContainer = ({ width = 1280, height = 720 } = {}) => {
  const parent = document.createElement('div')
  measure(parent, width, height)
  const playback = new Playback({})
  vi.spyOn(playback, 'setDisplayRect')
  vi.spyOn(playback, 'resize')
  const container = new Container({ playback })
  parent.appendChild(container.el)
  return { parent, playback, container }
}

const recordEvents = container => {
  const recorded = []
  VIEWPORT_EVENTS.forEach(name => container.on(name, payload => recorded.push({ name, payload })))
  return recorded
}

const track = promise => {
  const state = { settled: false, value: undefined }
  promise.then(value => {
    state.settled = true
    state.value = value
  })
  return state
}

const flush = async () => {
  for (let i = 0; i < 5; i++) await Promise.resolve()
}

const fireTransitionEnd = (target, propertyName, type = 'transitionend') => {
  const event = new Event(type, { bubbles: true })
  Object.defineProperty(event, 'propertyName', { value: propertyName })
  target.dispatchEvent(event)
}

const inlineStyle = container => {
  const { style } = container.el
  return {
    top: style.top,
    left: style.left,
    width: style.width,
    height: style.height,
    transform: style.transform,
    transformOrigin: style.transformOrigin,
    transition: style.transition
  }
}

const replaceStyle = (container, style) => {
  Object.defineProperty(container.el, 'style', { value: style, configurable: true })
  return style
}

const recordStyle = initial => {
  const writes = []
  const style = new Proxy(initial, {
    set(target, prop, value) {
      writes.push([prop, value])
      target[prop] = value
      return true
    }
  })
  return { writes, style }
}

const errorOf = fn => {
  try {
    fn()
  } catch (error) {
    return error
  }
  return undefined
}

describe('Container viewport', () => {
  let playback
  let container
  let parent
  let events

  beforeEach(() => {
    vi.useFakeTimers()
    ;({ parent, playback, container } = createContainer())
    events = recordEvents(container)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('S1 - px viewport', () => {
    test('px path applies top-left styles and display rect', () => {
      container.setViewport({ scale: 0.5, position: 'top-left', margin: 20, useTransform: false })

      expect(inlineStyle(container)).toMatchObject({
        top: '20px',
        left: '20px',
        width: '640px',
        height: '360px'
      })
      expect(playback.setDisplayRect).toHaveBeenCalledTimes(1)
      expect(playback.setDisplayRect).toHaveBeenCalledWith(RECT_HALF_TOP_LEFT)
    })

    test('px path leaves playback resize and styles alone', () => {
      container.setViewport({ scale: 0.5, position: 'top-left', margin: 20, useTransform: false })

      expect(playback.resize).toHaveBeenCalledTimes(0)
      const { style } = playback.el
      expect([style.top, style.left, style.width, style.height]).toEqual(['', '', '', ''])
    })

    test('px path triggers will then did and resolves', async () => {
      const result = container.setViewport({
        scale: 0.5,
        position: 'top-left',
        margin: 20,
        useTransform: false
      })

      const payload = {
        rect: RECT_HALF_TOP_LEFT,
        viewport: {
          scale: 0.5,
          position: 'top-left',
          margin: { top: 20, right: 20, bottom: 20, left: 20 },
          radius: null,
          useTransform: false,
          animate: false,
          duration: 300,
          easing: 'ease'
        }
      }
      expect(events).toEqual([
        { name: Events.CONTAINER_VIEWPORT_WILL_CHANGE, payload },
        { name: Events.CONTAINER_VIEWPORT_DID_CHANGE, payload }
      ])
      await expect(result).resolves.toEqual({ interrupted: false, rect: RECT_HALF_TOP_LEFT })
    })

    test('px path ignores animate', async () => {
      const result = container.setViewport({ scale: 0.5, useTransform: false, animate: true })

      expect(container.el.style.transition).toBe('')
      await expect(result).resolves.toEqual({ interrupted: false, rect: RECT_HALF_CENTER })
    })

    test('getter matches the last will payload', () => {
      container.setViewport({ scale: 0.5, position: 'top-left', margin: 20, useTransform: false })

      const willPayload = events.find(
        ({ name }) => name === Events.CONTAINER_VIEWPORT_WILL_CHANGE
      ).payload
      expect(container.viewport).toEqual(willPayload)
    })

    test('normalizes a partial margin object', () => {
      container.setViewport({ margin: { top: 10 } })

      const expected = { top: 10, right: 0, bottom: 0, left: 0 }
      expect(container.viewport.viewport.margin).toEqual(expected)
      expect(events).toHaveLength(2)
      events.forEach(({ payload }) => expect(payload.viewport.margin).toEqual(expected))
    })
  })

  describe('S2 - argument validation', () => {
    describe('rejected call leaves state untouched', () => {
      const detach = c => c.el.remove()
      const rejected = [
        ['scale 0', 'setViewport', { scale: 0 }, RangeError],
        ['scale -0.5', 'setViewport', { scale: -0.5 }, RangeError],
        ['scale 1.01', 'setViewport', { scale: 1.01 }, RangeError],
        ['scale NaN', 'setViewport', { scale: NaN }, RangeError],
        ['margin -1', 'setViewport', { margin: -1 }, RangeError],
        ['margin {left: -1}', 'setViewport', { margin: { left: -1 } }, RangeError],
        ['position middle', 'setViewport', { position: 'middle' }, RangeError],
        ['position top', 'setViewport', { position: 'top' }, RangeError],
        ['position Top-Left', 'setViewport', { position: 'Top-Left' }, RangeError],
        ['position top_left', 'setViewport', { position: 'top_left' }, RangeError],
        ['duration -1 on set', 'setViewport', { duration: -1 }, RangeError],
        ['duration Infinity on set', 'setViewport', { duration: Infinity }, RangeError],
        ['duration NaN on set', 'setViewport', { duration: NaN }, RangeError],
        ['duration -1 on reset', 'resetViewport', { duration: -1 }, RangeError],
        ['duration Infinity on reset', 'resetViewport', { duration: Infinity }, RangeError],
        ['duration NaN on reset', 'resetViewport', { duration: NaN }, RangeError],
        ['options big', 'setViewport', 'big', TypeError],
        ['options 42', 'setViewport', 42, TypeError],
        ['scale string', 'setViewport', { scale: '0.5' }, TypeError],
        ['duration string', 'setViewport', { duration: '300' }, TypeError],
        ['margin string', 'setViewport', { margin: '20px' }, TypeError],
        ['position number', 'setViewport', { position: 1 }, TypeError],
        ['easing number', 'setViewport', { easing: 1 }, TypeError],
        ['reset options big', 'resetViewport', 'big', TypeError],
        ['reset duration string', 'resetViewport', { duration: '300' }, TypeError],
        ['reset easing number', 'resetViewport', { easing: 1 }, TypeError],
        ['no parentElement', 'setViewport', { scale: 0.5 }, Error, detach]
      ]

      test.each(rejected)(
        'rejected call leaves state untouched: %s',
        async (_, method, options, errorClass, prepare) => {
          const pending = track(container.setViewport(TRANSFORM_ANIMATED))
          events.length = 0
          prepare && prepare(container)
          const styleBefore = container.el.getAttribute('style')
          const getterBefore = container.viewport

          const error = errorOf(() => container[method](options))

          expect(error).toBeInstanceOf(errorClass)
          expect(error.constructor).toBe(errorClass)
          expect(container.el.getAttribute('style')).toBe(styleBefore)
          expect(container.viewport).toEqual(getterBefore)
          expect(events).toEqual([])
          await vi.advanceTimersByTimeAsync(399)
          expect(pending.settled).toBe(false)
          await vi.advanceTimersByTimeAsync(1)
          expect(pending.value.interrupted).toBe(false)
        }
      )
    })
  })

  describe('S3 - transform viewport and animation', () => {
    test('transform path top-left', async () => {
      const result = container.setViewport({
        scale: 0.5,
        position: 'top-left',
        margin: 20,
        useTransform: true
      })

      expect(container.el.style.transformOrigin).toBe('0% 0%')
      expect(container.el.style.transform).toBe('translate(20px, 20px) scale(0.5)')
      const { top, left, width, height } = inlineStyle(container)
      expect([top, left, width, height]).toEqual(['', '', '', ''])
      expect(playback.setDisplayRect).toHaveBeenCalledTimes(0)
      await expect(result).resolves.toEqual({ interrupted: false, rect: RECT_HALF_TOP_LEFT })
    })

    describe('animated call', () => {
      const animated = {
        scale: 0.5,
        useTransform: true,
        animate: true,
        duration: 500,
        easing: 'linear'
      }

      test('pins transform-origin before the first scale animation', () => {
        const { writes, style } = recordStyle({
          transform: '',
          transformOrigin: '',
          transition: ''
        })
        replaceStyle(container, style)

        container.setViewport({
          scale: 0.5,
          position: 'top-left',
          animate: true,
          duration: 400,
          easing: 'ease-out'
        })

        const originAt = writes.findIndex(([prop]) => prop === 'transformOrigin')
        const transitionAt = writes.findIndex(([prop]) => prop === 'transition')
        expect(writes[originAt]).toEqual(['transformOrigin', '0% 0%'])
        expect(originAt).toBeLessThan(transitionAt)
        expect(style.transition).toBe('transform 400ms ease-out')
        expect(style.transform).toBe('translate(0px, 0px) scale(0.5)')
      })

      test('animates from a transform that was applied without animation', () => {
        container.setViewport({ scale: 0.5, position: 'bottom-right', useTransform: true })
        const flushLayout = vi.spyOn(container.el, 'offsetWidth', 'get')

        container.setViewport({
          scale: 0.5,
          position: 'center',
          useTransform: true,
          animate: true,
          duration: 400,
          easing: 'ease-out'
        })

        expect(container.el.style.transform).toBe('translate(0px, 0px) scale(0.5)')
        expect(container.el.style.transformOrigin).toBe('50% 50%')
        expect(flushLayout).toHaveBeenCalled()
        expect(container.el.style.transition).toBe(
          'transform 400ms ease-out, transform-origin 400ms ease-out'
        )
      })

      test('animated call settles on its own transitionend', async () => {
        const call = track(container.setViewport(animated))

        expect(container.el.style.transition).toBe('transform 500ms linear')
        expect(events.map(({ name }) => name)).toEqual([Events.CONTAINER_VIEWPORT_WILL_CHANGE])
        await flush()
        expect(call.settled).toBe(false)

        fireTransitionEnd(container.el, 'transform')
        await flush()

        expect(events.map(({ name }) => name)).toEqual(VIEWPORT_EVENTS)
        expect(call.value).toEqual({ interrupted: false, rect: RECT_HALF_CENTER })
        expect(container.el.style.transition).toBe('')
      })

      test('ignores a foreign transitionend', async () => {
        const call = track(container.setViewport(animated))
        const child = document.createElement('span')
        container.el.appendChild(child)

        fireTransitionEnd(child, 'transform')
        fireTransitionEnd(container.el, 'opacity')
        await flush()

        expect(events.map(({ name }) => name)).toEqual([Events.CONTAINER_VIEWPORT_WILL_CHANGE])
        expect(call.settled).toBe(false)
      })

      test('animated call settles at duration plus 100', async () => {
        const call = track(container.setViewport(animated))

        await vi.advanceTimersByTimeAsync(599)
        expect(call.settled).toBe(false)
        await vi.advanceTimersByTimeAsync(1)

        expect(events.map(({ name }) => name)).toEqual(VIEWPORT_EVENTS)
        expect(call.value).toEqual({ interrupted: false, rect: RECT_HALF_CENTER })
      })

      test('waits for transform-origin when a same-scale move interrupts an animation', async () => {
        const topLeft = { x: 0, y: 0, width: 640, height: 360 }
        const bottomRight = { x: 640, y: 360, width: 640, height: 360 }
        const first = track(
          container.setViewport({ scale: 0.5, position: 'top-left', animate: true, duration: 300 })
        )
        await vi.advanceTimersByTimeAsync(100)
        events.length = 0

        const second = track(
          container.setViewport({
            scale: 0.5,
            position: 'bottom-right',
            animate: true,
            duration: 300
          })
        )
        await flush()

        expect(first.value).toEqual({ interrupted: true, rect: topLeft })
        fireTransitionEnd(container.el, 'transform')
        await flush()

        expect(second.settled).toBe(false)
        expect(events.map(({ name }) => name)).toEqual([Events.CONTAINER_VIEWPORT_WILL_CHANGE])

        fireTransitionEnd(container.el, 'transform-origin')
        await flush()

        expect(second.value).toEqual({ interrupted: false, rect: bottomRight })
        expect(
          events.filter(({ name }) => name === Events.CONTAINER_VIEWPORT_DID_CHANGE)
        ).toHaveLength(1)
      })

      test('animated call settles on transitioncancel', async () => {
        const call = track(container.setViewport(animated))

        fireTransitionEnd(container.el, 'transform', 'transitioncancel')
        await flush()

        expect(call.value).toEqual({ interrupted: false, rect: RECT_HALF_CENTER })
        expect(events.map(({ name }) => name)).toEqual(VIEWPORT_EVENTS)
      })

      test('a retargeted animation does not settle on the cancelled transition', async () => {
        const call = track(
          container.setViewport({
            position: 'top-left',
            margin: { right: 320, bottom: 180 },
            animate: true,
            duration: 500
          })
        )
        measure(parent, 2560, 1440)

        container.reapplyViewport()
        fireTransitionEnd(container.el, 'transform', 'transitioncancel')
        await flush()

        expect(call.settled).toBe(false)

        fireTransitionEnd(container.el, 'transform')
        await flush()

        expect(call.value).toEqual({
          interrupted: false,
          rect: { x: 0, y: 0, width: 2240, height: 1260 }
        })
      })
    })

    describe('is interrupted by', () => {
      const settledTransform = c => c.setViewport({ scale: 0.5, useTransform: true })
      const pendingKinds = {
        setViewport: {
          start: c => c.setViewport(TRANSFORM_ANIMATED),
          rect: RECT_HALF_CENTER
        },
        resetViewport: {
          start: c => {
            settledTransform(c)
            return c.resetViewport({ animate: true })
          },
          rect: FULL
        }
      }
      const newKinds = {
        setViewport: {
          call: c => c.setViewport({ scale: 0.25, useTransform: true }),
          result: { interrupted: false, rect: { x: 480, y: 270, width: 320, height: 180 } },
          verify: (c, recorded) => {
            expect(c.el.style.transform).toBe('translate(0px, 0px) scale(0.25)')
            expect(recorded.map(({ payload }) => payload.rect)).toEqual([
              { x: 480, y: 270, width: 320, height: 180 },
              { x: 480, y: 270, width: 320, height: 180 }
            ])
          }
        },
        resetViewport: {
          call: c => c.resetViewport(),
          result: { interrupted: false, rect: FULL },
          verify: (c, recorded) => {
            const { transform, transformOrigin, transition } = inlineStyle(c)
            expect([transform, transformOrigin, transition]).toEqual(['', '', ''])
            expect(recorded).toEqual([
              {
                name: Events.CONTAINER_VIEWPORT_WILL_CHANGE,
                payload: { rect: FULL, viewport: null }
              },
              {
                name: Events.CONTAINER_VIEWPORT_DID_CHANGE,
                payload: { rect: FULL, viewport: null }
              }
            ])
          }
        }
      }

      test.each([
        ['setViewport', 'setViewport'],
        ['setViewport', 'resetViewport'],
        ['resetViewport', 'setViewport'],
        ['resetViewport', 'resetViewport']
      ])('%s is interrupted by %s', async (pendingName, newName) => {
        const pendingCall = track(pendingKinds[pendingName].start(container))
        events.length = 0

        const newCall = track(newKinds[newName].call(container))
        await flush()

        expect(pendingCall.value).toEqual({
          interrupted: true,
          rect: pendingKinds[pendingName].rect
        })
        expect(newCall.value).toEqual(newKinds[newName].result)
        newKinds[newName].verify(container, events)
        const didEvents = events.filter(({ name }) => name === Events.CONTAINER_VIEWPORT_DID_CHANGE)
        expect(didEvents).toHaveLength(1)
        expect(didEvents[0].payload.rect).toEqual(newKinds[newName].result.rect)
      })
    })

    test('uses the webkit prefixed transform', async () => {
      const style = replaceStyle(container, {
        webkitTransform: '',
        webkitTransformOrigin: '',
        webkitTransition: ''
      })

      const call = track(
        container.setViewport({
          scale: 0.5,
          useTransform: true,
          animate: true,
          duration: 500,
          easing: 'linear'
        })
      )

      expect(style.webkitTransform).toBe('translate(0px, 0px) scale(0.5)')
      expect(style.webkitTransformOrigin).toBe('50% 50%')
      expect(style.webkitTransition).toBe('-webkit-transform 500ms linear')
      fireTransitionEnd(container.el, 'transform', 'transitionend')
      await flush()
      expect(call.settled).toBe(false)

      fireTransitionEnd(container.el, '-webkit-transform', 'webkitTransitionEnd')
      await flush()

      expect(call.value).toEqual({ interrupted: false, rect: RECT_HALF_CENTER })
    })

    test('falls back to px without transform support', async () => {
      const style = replaceStyle(container, {})

      const result = container.setViewport({ scale: 0.5, useTransform: true })

      expect(style).toMatchObject({ top: '180px', left: '320px', width: '640px', height: '360px' })
      expect(Object.keys(style).filter(key => /transform/i.test(key))).toEqual([])
      expect(playback.setDisplayRect).toHaveBeenCalledWith(RECT_HALF_CENTER)
      expect(container.viewport.viewport.useTransform).toBe(false)
      await expect(result).resolves.toEqual({ interrupted: false, rect: RECT_HALF_CENTER })
    })
  })

  describe('S4 - existing resize contract', () => {
    test('container polling triggers CONTAINER_RESIZE every 500 ms with the measured size', () => {
      measure(container.el, 800, 450)
      const callback = vi.fn()
      container.on(Events.CONTAINER_RESIZE, callback)
      container.enableResizeObserver()

      vi.advanceTimersByTime(499)
      expect(callback).not.toHaveBeenCalled()
      vi.advanceTimersByTime(1)

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith({ width: 800, height: 450 })
      container.disableResizeObserver()
    })
  })

  describe('S5 - reset and lifecycle', () => {
    test('reset removes a px viewport', async () => {
      container.setViewport({ scale: 0.5, position: 'top-left', margin: 20, useTransform: false })
      playback.setDisplayRect.mockClear()
      events.length = 0

      const result = container.resetViewport()

      const { top, left, width, height } = inlineStyle(container)
      expect([top, left, width, height]).toEqual(['', '', '', ''])
      expect(playback.setDisplayRect).toHaveBeenCalledWith(FULL)
      const payload = { rect: FULL, viewport: null }
      expect(events).toEqual([
        { name: Events.CONTAINER_VIEWPORT_WILL_CHANGE, payload },
        { name: Events.CONTAINER_VIEWPORT_DID_CHANGE, payload }
      ])
      await expect(result).resolves.toEqual({ interrupted: false, rect: FULL })
    })

    describe('animated reset', () => {
      const startAnimatedReset = () => {
        container.setViewport({ scale: 0.5, useTransform: true })
        events.length = 0
        const call = track(container.resetViewport({ animate: true, duration: 500 }))
        expect(container.el.style.transform).toBe('translate(0px, 0px) scale(1)')
        return call
      }

      const expectSettled = call => {
        const { transform, transformOrigin, transition } = inlineStyle(container)
        expect([transform, transformOrigin, transition]).toEqual(['', '', ''])
        expect(events.map(({ name }) => name)).toContain(Events.CONTAINER_VIEWPORT_DID_CHANGE)
        expect(
          events.find(({ name }) => name === Events.CONTAINER_VIEWPORT_DID_CHANGE).payload
        ).toEqual({ rect: FULL, viewport: null })
        expect(call.value).toEqual({ interrupted: false, rect: FULL })
      }

      test('animated reset settles on transitionend', async () => {
        const call = startAnimatedReset()
        await flush()
        expect(call.settled).toBe(false)

        fireTransitionEnd(container.el, 'transform')
        await flush()

        expectSettled(call)
      })

      test('animated reset settles at the timeout', async () => {
        const call = startAnimatedReset()

        await vi.advanceTimersByTimeAsync(599)
        expect(call.settled).toBe(false)
        await vi.advanceTimersByTimeAsync(1)

        expectSettled(call)
      })

      test('resize during an animated reset reports the new full rect', async () => {
        const call = startAnimatedReset()
        await vi.advanceTimersByTimeAsync(500)
        events.length = 0
        measure(parent, 640, 360)

        container.reapplyViewport()

        const rect = { x: 0, y: 0, width: 640, height: 360 }
        expect(container.el.style.transform).toBe('translate(0px, 0px) scale(1)')
        expect(events).toEqual([
          { name: Events.CONTAINER_VIEWPORT_WILL_CHANGE, payload: { rect, viewport: null } }
        ])
        expect(call.settled).toBe(false)

        await vi.advanceTimersByTimeAsync(99)
        expect(call.settled).toBe(false)
        await vi.advanceTimersByTimeAsync(1)
        await flush()

        expect(call.value).toEqual({ interrupted: false, rect })
        expect(events.map(({ name }) => name)).toEqual(VIEWPORT_EVENTS)
        expect(events[1].payload).toEqual({ rect, viewport: null })
      })
    })

    test('reset throws without parentElement while a viewport is set', () => {
      container.setViewport({ scale: 0.5, position: 'top-left', margin: 20, useTransform: false })
      playback.setDisplayRect.mockClear()
      container.el.remove()

      const error = errorOf(() => container.resetViewport())

      expect(error).toBeInstanceOf(Error)
      expect(error.constructor).toBe(Error)
      expect(error.message).toBe('The container has no parentElement to measure')
      expect(playback.setDisplayRect).not.toHaveBeenCalled()
      parent.appendChild(container.el)
      expect(container.viewport.viewport.scale).toBe(0.5)
      expect(container.el.style.width).toBe('640px')
    })

    test('reset without a viewport', async () => {
      const styleBefore = container.el.getAttribute('style')

      const result = container.resetViewport()

      expect(container.el.getAttribute('style')).toBe(styleBefore)
      expect(events).toEqual([])
      await expect(result).resolves.toEqual({ interrupted: false, rect: FULL })
    })

    test('switches from px to transform', () => {
      container.setViewport({ scale: 0.5, position: 'top-left', margin: 20, useTransform: false })
      const snapshots = []
      playback.setDisplayRect.mockImplementation(rect =>
        snapshots.push({ rect, ...inlineStyle(container) })
      )

      container.setViewport({ scale: 0.5, useTransform: true })

      expect(snapshots).toHaveLength(1)
      expect(snapshots[0]).toMatchObject({
        rect: FULL,
        top: '',
        left: '',
        width: '',
        height: '',
        transform: ''
      })
      expect(container.el.style.transform).toBe('translate(0px, 0px) scale(0.5)')
    })

    test('animates from the current px rect', () => {
      container.setViewport({ scale: 0.5, position: 'top-left', margin: 20, useTransform: false })
      const { writes, style } = recordStyle(inlineStyle(container))
      replaceStyle(container, style)

      container.setViewport({
        scale: 0.5,
        position: 'bottom-right',
        margin: 20,
        useTransform: true,
        animate: true
      })

      const initial = writes.findIndex(
        ([prop, value]) => prop === 'transform' && value === 'translate(-620px, -340px) scale(0.5)'
      )
      const transitionAt = writes.findIndex(([prop]) => prop === 'transition')
      const cleared = writes.findIndex(([prop, value]) => prop === 'width' && value === '')
      const finalAt = writes.findIndex(
        ([prop, value]) => prop === 'transform' && value === 'translate(-20px, -20px) scale(0.5)'
      )

      expect(initial).toBeGreaterThanOrEqual(0)
      expect(initial).toBeLessThan(cleared)
      expect(cleared).toBeLessThan(transitionAt)
      expect(transitionAt).toBeLessThan(finalAt)
      expect(inlineStyle(container)).toMatchObject({
        top: '',
        left: '',
        width: '',
        height: '',
        transform: 'translate(-20px, -20px) scale(0.5)'
      })
    })

    test('switches from transform to px', async () => {
      container.setViewport(TRANSFORM_ANIMATED)
      await vi.advanceTimersByTimeAsync(400)

      container.setViewport({ scale: 0.5, position: 'top-left', margin: 20, useTransform: false })

      expect(inlineStyle(container)).toEqual({
        top: '20px',
        left: '20px',
        width: '640px',
        height: '360px',
        transform: '',
        transformOrigin: '',
        transition: ''
      })
    })

    test('destroy resolves a pending call as interrupted', async () => {
      const timersBefore = vi.getTimerCount()
      const addSpy = vi.spyOn(container.el, 'addEventListener')
      const removeSpy = vi.spyOn(container.el, 'removeEventListener')
      const call = track(container.setViewport(TRANSFORM_ANIMATED))
      events.length = 0

      container.destroy()
      await flush()

      expect(call.value).toEqual({ interrupted: true, rect: RECT_HALF_CENTER })
      expect(events).toEqual([])
      expect(vi.getTimerCount()).toBe(timersBefore)
      const isTransitionEvent = ([type]) =>
        type === 'transitionend' ||
        type === 'webkitTransitionEnd' ||
        type === 'transitioncancel' ||
        type === 'webkitTransitionCancel'
      const added = addSpy.mock.calls.filter(isTransitionEvent)
      const removed = removeSpy.mock.calls.filter(isTransitionEvent)
      expect(added.length).toBeGreaterThan(0)
      added.forEach(([type, handler]) => {
        expect(
          removed.some(
            ([removedType, removedHandler]) => removedType === type && removedHandler === handler
          )
        ).toBe(true)
      })
    })

    test('getter without a viewport', () => {
      expect(container.viewport).toEqual({ rect: FULL, viewport: null })
    })

    test('getter when detached', () => {
      parent.removeChild(container.el)

      expect(container.viewport).toEqual({ rect: null, viewport: null })
    })
  })

  describe('S6 - radius', () => {
    test('an omitted radius leaves an existing border-radius alone', () => {
      container.el.style.borderRadius = '4px'
      container.el.style.overflow = 'scroll'

      container.setViewport({ scale: 0.5 })
      measure(parent, 640, 360)
      container.reapplyViewport()

      expect(container.el.style.borderRadius).toBe('4px')
      expect(container.el.style.overflow).toBe('scroll')
      expect(container.el.style.transition).toBe('')
      expect(container.viewport.viewport.radius).toBeNull()
    })

    test('transform path writes the visual radius divided by fit', () => {
      container.setViewport({ scale: 0.5, radius: 16 })

      expect(container.el.style.borderRadius).toBe('32px')
      expect(container.el.style.overflow).toBe('hidden')
      expect(container.viewport.viewport.radius).toBe(16)
      expect(playback.setDisplayRect).not.toHaveBeenCalled()
    })

    test('px path writes the visual radius', () => {
      container.setViewport({ scale: 0.5, radius: 16, useTransform: false })

      expect(container.el.style.borderRadius).toBe('16px')
      expect(container.el.style.overflow).toBe('hidden')
      expect(playback.setDisplayRect).toHaveBeenCalledWith(RECT_HALF_CENTER)
    })

    test('an explicit 0 clears the clip', () => {
      container.setViewport({ scale: 0.5, radius: 16 })

      container.setViewport({ scale: 0.5, radius: 0 })

      expect(container.el.style.borderRadius).toBe('0px')
      expect(container.el.style.overflow).toBe('')
      expect(container.viewport.viewport.radius).toBe(0)
    })

    test('a later call without radius removes the one we wrote', () => {
      container.setViewport({ scale: 0.5, radius: 16 })

      container.setViewport({ scale: 0.5 })

      expect(container.el.style.borderRadius).toBe('')
      expect(container.el.style.overflow).toBe('')
      expect(container.viewport.viewport.radius).toBeNull()
    })

    test('an invalid radius leaves the previous style', () => {
      container.setViewport({ scale: 0.5, radius: 16 })

      expect(() => container.setViewport({ radius: -1 })).toThrow(RangeError)

      expect(container.el.style.borderRadius).toBe('32px')
      expect(container.viewport.viewport.radius).toBe(16)
    })

    test('resize rewrites the compensated radius without a transition', () => {
      container.setViewport({ scale: 1, margin: 100, radius: 16 })
      expect(container.el.style.borderRadius).toBe(`${16 / (520 / 720)}px`)

      measure(parent, 1000, 1000)
      container.reapplyViewport()

      expect(container.el.style.borderRadius).toBe('20px')
      expect(container.el.style.transition).toBe('')
      expect(container.viewport.viewport.radius).toBe(16)
    })

    test('an animated radius waits for border-radius and keeps it after settle', async () => {
      const call = track(
        container.setViewport({
          scale: 0.5,
          radius: 16,
          animate: true,
          duration: 400,
          easing: 'ease-out'
        })
      )

      expect(container.el.style.borderRadius).toBe('32px')
      expect(container.el.style.overflow).toBe('hidden')
      expect(container.el.style.transition).toBe(
        'transform 400ms ease-out, border-radius 400ms ease-out'
      )
      await flush()
      expect(call.settled).toBe(false)

      fireTransitionEnd(container.el, 'transform')
      await flush()
      expect(call.settled).toBe(false)

      fireTransitionEnd(container.el, 'border-radius')
      await flush()

      expect(call.value).toEqual({ interrupted: false, rect: RECT_HALF_CENTER })
      expect(container.el.style.transition).toBe('')
      expect(container.el.style.borderRadius).toBe('32px')
      expect(container.viewport.viewport.radius).toBe(16)
    })

    test('a radius added to a settled transform is animated', () => {
      container.setViewport({ scale: 0.5, useTransform: true })
      const flushLayout = vi.spyOn(container.el, 'offsetWidth', 'get')

      container.setViewport({ scale: 0.5, radius: 16, animate: true, duration: 300 })

      expect(flushLayout).toHaveBeenCalled()
      expect(container.el.style.borderRadius).toBe('32px')
      expect(container.el.style.transition).toBe(
        'transform 300ms ease, transform-origin 300ms ease, border-radius 300ms ease'
      )
    })

    test('an animated reset eases the radius out and then clears it', async () => {
      container.setViewport({ scale: 0.5, radius: 16 })
      const call = track(container.resetViewport({ animate: true, duration: 400 }))

      expect(container.el.style.borderRadius).toBe('0px')
      expect(container.el.style.overflow).toBe('hidden')
      expect(container.el.style.transition).toContain('border-radius 400ms ease')
      await flush()
      expect(call.settled).toBe(false)

      fireTransitionEnd(container.el, 'transform')
      await flush()
      expect(call.settled).toBe(false)

      fireTransitionEnd(container.el, 'border-radius')
      await flush()

      expect(call.value).toEqual({ interrupted: false, rect: FULL })
      expect(container.el.style.borderRadius).toBe('')
      expect(container.el.style.overflow).toBe('')
      expect(container.el.style.transition).toBe('')
    })

    test('reset removes a px radius immediately', () => {
      container.setViewport({ scale: 0.5, radius: 16, useTransform: false })

      container.resetViewport()

      expect(container.el.style.borderRadius).toBe('')
      expect(container.el.style.overflow).toBe('')
    })

    test('falls back to the visual radius when the engine has no transform', () => {
      const style = replaceStyle(container, {})

      container.setViewport({ scale: 0.5, radius: 16, useTransform: true })

      expect(style.borderRadius).toBe('16px')
      expect(style.overflow).toBe('hidden')
      expect(container.viewport.viewport.useTransform).toBe(false)
    })
  })
})
