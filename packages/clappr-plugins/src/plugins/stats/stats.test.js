import { Container, Events, Playback } from '@clappr/core'

const ctx = {}
import Stats from './stats'

const FakePlayback = Playback

describe('StatsPlugin', function () {
  beforeEach(function () {
    localStorage.clear()
    ctx.playback = new FakePlayback()
    ctx.container = new Container({ playback: ctx.playback })
    ctx.stats = new Stats(ctx.container)
    ctx.container.addPlugin(ctx.stats)
    vi.useFakeTimers()
    ctx.startTime = Date.now()
    vi.setSystemTime(ctx.startTime)
  })

  afterEach(function () {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should calculate startup time', function () {
    ctx.container.onBuffering()
    vi.advanceTimersByTime(1000)
    ctx.container.bufferfull()
    expect(ctx.stats.getStats().startupTime).toBe(1000)
  })

  it('should calculate rebuffer events', function () {
    // to maintain compatibility with the first ping version
    // we'll increment rebuffers even on the startup rebuffer event
    ctx.container.onBuffering()
    ctx.container.bufferfull()

    ctx.container.onBuffering()
    ctx.container.bufferfull()

    expect(ctx.stats.getStats().rebuffers).toBe(2)
  })

  it('should calculate total rebuffer time', function () {
    ctx.container.play()
    ctx.container.onBuffering() // startup time
    vi.advanceTimersByTime(1000)
    ctx.container.bufferfull()

    ctx.container.onBuffering()
    vi.advanceTimersByTime(1000)
    ctx.container.bufferfull()

    ctx.container.onBuffering()
    vi.advanceTimersByTime(500)
    ctx.container.bufferfull()

    expect(ctx.stats.getStats().rebufferingTime).toBe(1500)
  })

  it('should avoid NaN on watching time and rebuffering time when more than one bufferfull is dispatched', function () {
    ctx.container.play()
    ctx.container.onBuffering() // startup time
    vi.advanceTimersByTime(1000)
    ctx.container.bufferfull()
    ctx.container.bufferfull()

    vi.advanceTimersByTime(2000) // watching for 2 secs
    expect(ctx.stats.getStats().watchingTime).toBe(2000)
    expect(ctx.stats.getStats().rebufferingTime).toBe(0)
    expect(ctx.stats.getStats().startupTime).toBe(1000)
  })

  it('should calculate total watching time', function () {
    ctx.container.play()
    ctx.container.onBuffering() // startup time
    vi.advanceTimersByTime(1000)
    ctx.container.bufferfull()

    vi.advanceTimersByTime(2000) // watching for 2 secs
    expect(ctx.stats.getStats().watchingTime).toBe(2000)

    ctx.container.onBuffering()
    vi.advanceTimersByTime(500)
    ctx.container.bufferfull()

    vi.advanceTimersByTime(2000) // watching for 2 secs
    expect(ctx.stats.getStats().watchingTime).toBe(4000)
  })

  it('should consider current rebuffering state', function () {
    ctx.container.play()
    ctx.container.onBuffering() // startup time
    vi.advanceTimersByTime(1000)
    ctx.container.bufferfull()

    ctx.container.onBuffering()
    vi.advanceTimersByTime(1000)
    ctx.container.bufferfull()
    vi.advanceTimersByTime(10000)

    ctx.container.onBuffering()
    vi.advanceTimersByTime(500)
    // still rebuffering

    expect(ctx.stats.getStats().rebufferingTime).toBe(1500)
    expect(ctx.stats.getStats().watchingTime).toBe(10000)
  })

  it('should announce statistics periodically', function () {
    const statsReportSpy = vi.spyOn(ctx.container, 'statsReport')
    ctx.container.reportInterval = 10

    const stats = new Stats(ctx.container)
    ctx.container.addPlugin(stats)
    ctx.playback.trigger(Events.PLAYBACK_PLAY)
    // clock.tick freezes when used with {set,clear}Interval and I don't know why
    setTimeout(function () {
      expect(statsReportSpy).toHaveBeenCalledTimes(2)
      ctx.container.restore()
    }, 20)
  })
})
