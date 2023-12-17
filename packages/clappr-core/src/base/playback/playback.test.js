import Playback from './playback'
import Core from '@/components/core'
import PlayerError from '@/components/error'

const getProperty = (obj, prop) => {
  return Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), prop)
}

const isGetterProperty = (obj, prop) => {
  return getProperty(obj, prop).get
}

const isSetterProperty = (obj, prop) => {
  return getProperty(obj, prop).set
}

describe('Playback', function() {
  beforeEach(() => {
    this.basePlayback = new Playback({})
  })

  describe('have a getter', () => {
    test('called isAudioOnly', () => {
      expect(isGetterProperty(this.basePlayback, 'isAudioOnly')).toBeTruthy()
      expect(isSetterProperty(this.basePlayback, 'isAudioOnly')).toBeFalsy()
    })
    test('called isAdaptive', () => {
      expect(isGetterProperty(this.basePlayback, 'isAdaptive')).toBeTruthy()
      expect(isSetterProperty(this.basePlayback, 'isAdaptive')).toBeFalsy()
    })
    test('called ended', () => {
      expect(isGetterProperty(this.basePlayback, 'ended')).toBeTruthy()
      expect(isSetterProperty(this.basePlayback, 'ended')).toBeFalsy()
    })
    test('called i18n', () => {
      expect(isGetterProperty(this.basePlayback, 'i18n')).toBeTruthy()
      expect(isSetterProperty(this.basePlayback, 'i18n')).toBeFalsy()
    })
    test('called buffering', () => {
      expect(isGetterProperty(this.basePlayback, 'buffering')).toBeTruthy()
      expect(isSetterProperty(this.basePlayback, 'buffering')).toBeFalsy()
    })
    test('called isReady', () => {
      expect(isGetterProperty(this.basePlayback, 'isReady')).toBeTruthy()
      expect(isSetterProperty(this.basePlayback, 'isReady')).toBeFalsy()
    })
    test('called audioTracks', () => {
      expect(isGetterProperty(this.basePlayback, 'audioTracks')).toBeTruthy()
      expect(isSetterProperty(this.basePlayback, 'audioTracks')).toBeFalsy()
    })
    test('called currentAudioTracks', () => {
      expect(isGetterProperty(this.basePlayback, 'currentAudioTrack')).toBeTruthy()
      expect(isSetterProperty(this.basePlayback, 'currentAudioTrack')).toBeFalsy()
    })
    test('called hasClosedCaptionsTracks', () => {
      expect(isGetterProperty(this.basePlayback, 'hasClosedCaptionsTracks')).toBeTruthy()
      expect(isSetterProperty(this.basePlayback, 'hasClosedCaptionsTracks')).toBeFalsy()
    })
    test('called closedCaptionsTracks', () => {
      expect(isGetterProperty(this.basePlayback, 'closedCaptionsTracks')).toBeTruthy()
      expect(isSetterProperty(this.basePlayback, 'closedCaptionsTracks')).toBeFalsy()
    })
    test('called closedCaptionsTrackId and a setter too', () => {
      expect(isGetterProperty(this.basePlayback, 'closedCaptionsTrackId')).toBeTruthy()
      expect(isSetterProperty(this.basePlayback, 'closedCaptionsTrackId')).toBeTruthy()
    })
  })

  test('isAudioOnly getter returns default value', () => {
    expect(this.basePlayback.isAudioOnly).toBeFalsy()
  })

  test('isAdaptive getter returns default value', () => {
    expect(this.basePlayback.isAdaptive).toBeFalsy()
  })

  test('ended getter returns default value', () => {
    expect(this.basePlayback.ended).toBeFalsy()
  })

  test('buffering getter returns default value', () => {
    expect(this.basePlayback.buffering).toBeFalsy()
  })

  test('isReady getter returns default value', () => {
    expect(this.basePlayback.isReady).toBeFalsy()
  })

  test('closedCaptionsTracks getter returns default value', () => {
    expect(this.basePlayback.closedCaptionsTracks).toEqual([])
  })

  test('hasClosedCaptionsTracks getter returns default value', () => {
    expect(this.basePlayback.hasClosedCaptionsTracks).toBeFalsy()
  })

  test('closedCaptionsTrackId getter returns default value', () => {
    expect(this.basePlayback.closedCaptionsTrackId).toEqual(-1)
  })

  test('audioTracks getter returns default value', () => {
    expect(this.basePlayback.audioTracks).toEqual([])
  })

  test('currentAudioTrack getter returns default value', () => {
    expect(this.basePlayback.currentAudioTrack).toBeNull()
  })

  test('i18n getter returns default value', () => {
    const i18n = { t: (key) => key }
    const playback = new Playback({}, i18n)

    expect(playback.i18n).toEqual(i18n)
  })

  test('has default duration', () => {
    expect(this.basePlayback.getDuration()).toEqual(0)
  })

  test('has default getStartTimeOffset', () => {
    expect(this.basePlayback.getStartTimeOffset()).toEqual(0)
  })

  test('has static method to check if playback implementation can play one source', () => {
    expect(Playback.canPlay()).toBeFalsy()
  })

  test('is not playing by default', () => {
    expect(this.basePlayback.isPlaying()).toBeFalsy()
  })

  test('is not ready by default', () => {
    expect(this.basePlayback.isReady).toBeFalsy()
  })

  test('has NO_OP as playback type', () => {
    expect(this.basePlayback.getPlaybackType()).toEqual(Playback.NO_OP)
  })

  test('is not on high definition by default', () => {
    expect(this.basePlayback.isHighDefinitionInUse()).toBeFalsy()
  })

  test('can be consented', (done) => {
    const callback = jest.fn(() => {
      expect(callback).toHaveBeenCalledTimes(1)
      done()
    })
    this.basePlayback.consent(callback)
  })

  test('consider auto play is available as default', () => {
    const spy = jest.fn()
    this.basePlayback.canAutoPlay(spy)

    expect(spy).toHaveBeenCalledWith(true, null)
  })

  test('can checks if auto play is available', () => {
    jest.spyOn(this.basePlayback, 'play')
    this.basePlayback.attemptAutoPlay()

    expect(this.basePlayback.play).toHaveBeenCalledTimes(1)
  })

  test('destroys by removing element from DOM', () => {
    const spy = jest.fn()
    this.basePlayback.$el = { remove: spy, off: () => {} }

    this.basePlayback.destroy()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('can be configured after your creation', () => {
    const newOptions = { test: 'test' }

    this.basePlayback.configure(newOptions)

    expect(this.basePlayback.options).toEqual({ ...this.basePlayback.options, ...newOptions })
  })

  test('can be created via extends method', () => {
    const plugin = Playback.extend({ name: 'test_plugin' })

    expect(plugin.prototype instanceof Playback).toBeTruthy()
  })

  describe('error', () => {
    beforeEach(() => {
      this.core = new Core({})
      this.basePlayback = new Playback({}, null, this.core.playerError)
      this.defaultError = {
        description: '',
        level: PlayerError.Levels.FATAL,
        origin: 'playback',
        scope: 'playback',
        raw: {},
        code: 'playback:unknown',
      }
    })

    describe('when no data is given', () => {

      test('creates a default error', () => {
        const errorData = this.basePlayback.createError()

        expect(errorData).toEqual(this.defaultError)
      })

      test('has default error level equals to FATAL', () => {
        const errorData = this.basePlayback.createError()

        expect(errorData.level).toEqual(PlayerError.Levels.FATAL)
      })

      describe('when i18n is defined', () => {
        test('creates a default error with UI data', () => {
          const basePlayback = new Playback({}, this.core.i18n, this.core.playerError)
          const errorData = basePlayback.createError()
          const defaultError = { ...this.defaultError, UI: { title: 'default_error_title', message: 'default_error_message' } }
          expect(errorData.UI).toEqual(defaultError.UI)
        })
      })
    })

    describe('when some data is given', () => {
      test('creates a code error on the following format: name:code', () => {
        const basePlayback = new Playback({}, null, this.core.playerError)
        basePlayback.name = 'test'
        const error = { code: '42' }
        const errorData = basePlayback.createError(error)

        expect(errorData.code).toEqual(`${basePlayback.name}:${error.code}`)
      })

      test('does not overwrite level when it is not equal to default', () => {
        const error = { level: PlayerError.Levels.WARN }
        const errorData = this.basePlayback.createError(error)

        expect(errorData.level).toEqual(PlayerError.Levels.WARN)
      })

      test('does not overwrite code when useCodePrefix is false', () => {
        const error = { code: 'MY_CODE' }
        const options = { useCodePrefix: false }
        const errorData = this.basePlayback.createError(error, options)

        expect(errorData.code).toEqual(error.code)
      })

      describe('when i18n is defined', () => {
        beforeEach(() => { this.defaultPlayback = new Playback({}, this.core.i18n, this.core.playerError) })

        test('does not overwrite UI when it is defined', () => {
          const UIData = { title: 'my_title', message: 'my_message' }
          const errorData = this.basePlayback.createError({ UI: UIData })
          expect(errorData.UI).toEqual(UIData)
        })

        test('does not add UI data if level is not FATAL', () => {
          const error = { level: PlayerError.Levels.WARN }
          const errorData = this.basePlayback.createError(error)

          expect(errorData.UI).toBeUndefined()
        })
      })
    })

    test('always calls error method to trigger ERROR event', () => {
      const spy = jest.spyOn(this.basePlayback.playerError, 'createError')
      this.basePlayback.createError()

      expect(spy).toHaveBeenCalledWith(this.defaultError)
    })
  })
})
