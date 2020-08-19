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
  describe('have a getter', function() {
    beforeEach(() => {
      this.playback = new AdaptivePlayback()
    })

    test('called isAdaptive', () => {
      expect(isGetterProperty(this.playback, 'isAdaptive')).toBeTruthy()
      expect(isSetterProperty(this.playback, 'isAdaptive')).toBeFalsy()
    })

    test('called isAutoAdaptive and a setter too', () => {
      expect(isGetterProperty(this.playback, 'isAutoAdaptive')).toBeTruthy()
      expect(isSetterProperty(this.playback, 'isAutoAdaptive')).toBeTruthy()
    })

    test('called activeVideoQualityLevels', () => {
      expect(isGetterProperty(this.playback, 'activeVideoQualityLevels')).toBeTruthy()
      expect(isSetterProperty(this.playback, 'activeVideoQualityLevels')).toBeFalsy()
    })

    test('called videoQualityLevels', () => {
      expect(isGetterProperty(this.playback, 'videoQualityLevels')).toBeTruthy()
      expect(isSetterProperty(this.playback, 'videoQualityLevels')).toBeFalsy()
    })

    test('called availableAudioOptions', () => {
      expect(isGetterProperty(this.playback, 'availableAudioOptions')).toBeTruthy()
      expect(isSetterProperty(this.playback, 'availableAudioOptions')).toBeFalsy()
    })

    test('called audioOptions', () => {
      expect(isGetterProperty(this.playback, 'audioOptions')).toBeTruthy()
      expect(isSetterProperty(this.playback, 'audioOptions')).toBeFalsy()
    })

    test('called availableClosedCaptions', () => {
      expect(isGetterProperty(this.playback, 'availableClosedCaptions')).toBeTruthy()
      expect(isSetterProperty(this.playback, 'availableClosedCaptions')).toBeFalsy()
    })

    test('called closedCaptions', () => {
      expect(isGetterProperty(this.playback, 'closedCaptions')).toBeTruthy()
      expect(isSetterProperty(this.playback, 'closedCaptions')).toBeFalsy()
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
