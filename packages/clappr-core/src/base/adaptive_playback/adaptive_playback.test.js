import AdaptivePlayback from './adaptive_playback'

const getProperty = (obj, prop) => {
  return Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), prop)
}

const isSetterProperty = (obj, prop) => {
  return getProperty(obj, prop).set
}

const isGetterProperty = (obj, prop) => {
  return getProperty(obj, prop).get
}

describe('AdaptivePlayback', () => {
  describe('have a getter', function () {
    let playback
    beforeEach(() => {
      playback = new AdaptivePlayback()
    })

    test('called isAdaptive', () => {
      expect(isGetterProperty(playback, 'isAdaptive')).toBeTruthy()
      expect(isSetterProperty(playback, 'isAdaptive')).toBeFalsy()
    })

    test('called isAutoAdaptive and a setter too', () => {
      expect(isGetterProperty(playback, 'isAutoAdaptive')).toBeTruthy()
      expect(isSetterProperty(playback, 'isAutoAdaptive')).toBeTruthy()
    })

    test('called activeVideoQualityLevels', () => {
      expect(isGetterProperty(playback, 'activeVideoQualityLevels')).toBeTruthy()
      expect(isSetterProperty(playback, 'activeVideoQualityLevels')).toBeFalsy()
    })

    test('called videoQualityLevels', () => {
      expect(isGetterProperty(playback, 'videoQualityLevels')).toBeTruthy()
      expect(isSetterProperty(playback, 'videoQualityLevels')).toBeFalsy()
    })

    test('called availableAudioOptions', () => {
      expect(isGetterProperty(playback, 'availableAudioOptions')).toBeTruthy()
      expect(isSetterProperty(playback, 'availableAudioOptions')).toBeFalsy()
    })

    test('called audioOptions', () => {
      expect(isGetterProperty(playback, 'audioOptions')).toBeTruthy()
      expect(isSetterProperty(playback, 'audioOptions')).toBeFalsy()
    })

    test('called availableClosedCaptions', () => {
      expect(isGetterProperty(playback, 'availableClosedCaptions')).toBeTruthy()
      expect(isSetterProperty(playback, 'availableClosedCaptions')).toBeFalsy()
    })

    test('called closedCaptions', () => {
      expect(isGetterProperty(playback, 'closedCaptions')).toBeTruthy()
      expect(isSetterProperty(playback, 'closedCaptions')).toBeFalsy()
    })
  })

  test('isAdaptive getter returns default value', () => {
    const playback = new AdaptivePlayback()

    expect(playback.isAdaptive).toBeTruthy()
  })

  test('isAutoAdaptive getter returns default value', () => {
    const playback = new AdaptivePlayback()

    expect(playback.isAutoAdaptive).toBeFalsy()
  })
})
