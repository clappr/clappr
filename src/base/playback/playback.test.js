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
  let basePlayback
  beforeEach(() => {
    basePlayback = new Playback({})
  })

  describe('have a getter', () => {
    test('called isAudioOnly', () => {
      expect(isGetterProperty(basePlayback, 'isAudioOnly')).toBeTruthy()
      expect(isSetterProperty(basePlayback, 'isAudioOnly')).toBeFalsy()
    })
    test('called isAdaptive', () => {
      expect(isGetterProperty(basePlayback, 'isAdaptive')).toBeTruthy()
      expect(isSetterProperty(basePlayback, 'isAdaptive')).toBeFalsy()
    })
    test('called ended', () => {
      expect(isGetterProperty(basePlayback, 'ended')).toBeTruthy()
      expect(isSetterProperty(basePlayback, 'ended')).toBeFalsy()
    })
    test('called i18n', () => {
      expect(isGetterProperty(basePlayback, 'i18n')).toBeTruthy()
      expect(isSetterProperty(basePlayback, 'i18n')).toBeFalsy()
    })
    test('called buffering', () => {
      expect(isGetterProperty(basePlayback, 'buffering')).toBeTruthy()
      expect(isSetterProperty(basePlayback, 'buffering')).toBeFalsy()
    })
    test('called isReady', () => {
      expect(isGetterProperty(basePlayback, 'isReady')).toBeTruthy()
      expect(isSetterProperty(basePlayback, 'isReady')).toBeFalsy()
    })
    test('called audioTracks', () => {
      expect(isGetterProperty(basePlayback, 'audioTracks')).toBeTruthy()
      expect(isSetterProperty(basePlayback, 'audioTracks')).toBeFalsy()
    })
    test('called currentAudioTracks', () => {
      expect(isGetterProperty(basePlayback, 'currentAudioTrack')).toBeTruthy()
      expect(isSetterProperty(basePlayback, 'currentAudioTrack')).toBeFalsy()
    })
    test('called hasClosedCaptionsTracks', () => {
      expect(isGetterProperty(basePlayback, 'hasClosedCaptionsTracks')).toBeTruthy()
      expect(isSetterProperty(basePlayback, 'hasClosedCaptionsTracks')).toBeFalsy()
    })
    test('called closedCaptionsTracks', () => {
      expect(isGetterProperty(basePlayback, 'closedCaptionsTracks')).toBeTruthy()
      expect(isSetterProperty(basePlayback, 'closedCaptionsTracks')).toBeFalsy()
    })
    test('called closedCaptionsTrackId and a setter too', () => {
      expect(isGetterProperty(basePlayback, 'closedCaptionsTrackId')).toBeTruthy()
      expect(isSetterProperty(basePlayback, 'closedCaptionsTrackId')).toBeTruthy()
    })
  })

  test('isAudioOnly getter returns default value', () => {
    expect(basePlayback.isAudioOnly).toBeFalsy()
  })

  test('isAdaptive getter returns default value', () => {
    expect(basePlayback.isAdaptive).toBeFalsy()
  })

  test('ended getter returns default value', () => {
    expect(basePlayback.ended).toBeFalsy()
  })

  test('buffering getter returns default value', () => {
    expect(basePlayback.buffering).toBeFalsy()
  })

  test('isReady getter returns default value', () => {
    expect(basePlayback.isReady).toBeFalsy()
  })

  test('closedCaptionsTracks getter returns default value', () => {
    expect(basePlayback.closedCaptionsTracks).toEqual([])
  })

  test('hasClosedCaptionsTracks getter returns default value', () => {
    expect(basePlayback.hasClosedCaptionsTracks).toBeFalsy()
  })

  test('closedCaptionsTrackId getter returns default value', () => {
    expect(basePlayback.closedCaptionsTrackId).toEqual(-1)
  })

  test('audioTracks getter returns default value', () => {
    expect(basePlayback.audioTracks).toEqual([])
  })

  test('currentAudioTrack getter returns default value', () => {
    expect(basePlayback.currentAudioTrack).toBeNull()
  })

  test('i18n getter returns default value', () => {
    const i18n = { t: (key) => key }
    const playback = new Playback({}, i18n)

    expect(playback.i18n).toEqual(i18n)
  })

  test('has default duration', () => {
    expect(basePlayback.getDuration()).toEqual(0)
  })

  test('has default getStartTimeOffset', () => {
    expect(basePlayback.getStartTimeOffset()).toEqual(0)
  })

  test('has static method to check if playback implementation can play one source', () => {
    expect(Playback.canPlay()).toBeFalsy()
  })

  test('is not playing by default', () => {
    expect(basePlayback.isPlaying()).toBeFalsy()
  })

  test('is not ready by default', () => {
    expect(basePlayback.isReady).toBeFalsy()
  })

  test('has NO_OP as playback type', () => {
    expect(basePlayback.getPlaybackType()).toEqual(Playback.NO_OP)
  })

  test('is not on high definition by default', () => {
    expect(basePlayback.isHighDefinitionInUse()).toBeFalsy()
  })

  test('can be consented', (done) => {
    const callback = jest.fn(() => {
      expect(callback).toHaveBeenCalledTimes(1)
      done()
    })
    basePlayback.consent(callback)
  })

  test('consider auto play is available as default', () => {
    const spy = jest.fn()
    basePlayback.canAutoPlay(spy)

    expect(spy).toHaveBeenCalledWith(true, null)
  })

  test('can checks if auto play is available', () => {
    jest.spyOn(basePlayback, 'play')
    basePlayback.attemptAutoPlay()

    expect(basePlayback.play).toHaveBeenCalledTimes(1)
  })

  test('destroys by removing element from DOM', () => {
    const spy = jest.fn()
    basePlayback.$el = { remove: spy, off: () => {} }

    basePlayback.destroy()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  test('can be configured after your creation', () => {
    const newOptions = { test: 'test' }

    basePlayback.configure(newOptions)

    expect(basePlayback.options).toEqual({ ...basePlayback.options, ...newOptions })
  })

  test('can be created via extends method', () => {
    const plugin = Playback.extend({ name: 'test_plugin' })

    expect(plugin.prototype instanceof Playback).toBeTruthy()
  })

  describe('error', () => {
    let defaultError
    let core
    beforeEach(() => {
      core = new Core({})
      basePlayback = new Playback({}, null, core.playerError)
      defaultError = {
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
        const errorData = basePlayback.createError()

        expect(errorData).toEqual(defaultError)
      })

      test('has default error level equals to FATAL', () => {
        const errorData = basePlayback.createError()

        expect(errorData.level).toEqual(PlayerError.Levels.FATAL)
      })

      describe('when i18n is defined', () => {
        test('creates a default error with UI data', () => {
          const basePlayback = new Playback({}, core.i18n, core.playerError)
          const errorData = basePlayback.createError()
          const defaultError = { ...defaultError, UI: { title: 'default_error_title', message: 'default_error_message' } }
          expect(errorData.UI).toEqual(defaultError.UI)
        })
      })
    })

    describe('when some data is given', () => {
      test('creates a code error on the following format: name:code', () => {
        const basePlayback = new Playback({}, null, core.playerError)
        basePlayback.name = 'test'
        const error = { code: '42' }
        const errorData = basePlayback.createError(error)

        expect(errorData.code).toEqual(`${basePlayback.name}:${error.code}`)
      })

      test('does not overwrite level when it is not equal to default', () => {
        const error = { level: PlayerError.Levels.WARN }
        const errorData = basePlayback.createError(error)

        expect(errorData.level).toEqual(PlayerError.Levels.WARN)
      })

      test('does not overwrite code when useCodePrefix is false', () => {
        const error = { code: 'MY_CODE' }
        const options = { useCodePrefix: false }
        const errorData = basePlayback.createError(error, options)

        expect(errorData.code).toEqual(error.code)
      })

      describe('when i18n is defined', () => {
        
        beforeEach(() => { new Playback({}, core.i18n, core.playerError) })

        test('does not overwrite UI when it is defined', () => {
          const UIData = { title: 'my_title', message: 'my_message' }
          const errorData = basePlayback.createError({ UI: UIData })
          expect(errorData.UI).toEqual(UIData)
        })

        test('does not add UI data if level is not FATAL', () => {
          const error = { level: PlayerError.Levels.WARN }
          const errorData = basePlayback.createError(error)

          expect(errorData.UI).toBeUndefined()
        })
      })
    })

    test('always calls error method to trigger ERROR event', () => {
      const spy = jest.spyOn(basePlayback.playerError, 'createError')
      basePlayback.createError()

      expect(spy).toHaveBeenCalledWith(defaultError)
    })
  })
})
