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
  })

  test('can play any source', () => {
    expect(NoOp.canPlay()).toBeTruthy()
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
})
