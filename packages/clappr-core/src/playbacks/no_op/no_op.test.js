import NoOp from './no_op'

const createContext = (width = 4, height = 4) => {
  const imageData = { data: new Uint8ClampedArray(width * height * 4) }
  return {
    canvas: { width, height },
    createImageData: vi.fn(() => imageData),
    putImageData: vi.fn()
  }
}

describe('NoOp playback', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  test('can play any source', () => {
    expect(NoOp.canPlay()).toBeTruthy()
    expect(NoOp.canPlay('http://example.com/video.mp4')).toBeTruthy()
  })

  test('fills noise with crypto.getRandomValues instead of Math.random', () => {
    const randomSpy = vi.spyOn(Math, 'random')
    const cryptoSpy = vi.spyOn(window.crypto, 'getRandomValues')
    const playback = new NoOp({})
    playback.context = createContext()

    playback._noise()

    expect(cryptoSpy).toHaveBeenCalled()
    expect(randomSpy).not.toHaveBeenCalled()
    expect(playback.context.putImageData).toHaveBeenCalled()
  })

  test('skips painting when getRandomValues is unavailable', () => {
    vi.stubGlobal('crypto', {})

    const playback = new NoOp({})
    playback.context = createContext()

    expect(() => playback._noise()).not.toThrow()
    expect(playback.context.createImageData).not.toHaveBeenCalled()
    expect(playback.context.putImageData).not.toHaveBeenCalled()
  })
})
