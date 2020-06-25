import Playback from './playback'
import Core from '../../components/core'
import PlayerError from '../../components/error'

describe('Playback', function() {
  beforeEach(() => {
    this.basePlayback = new Playback({})
  })

  test('has default duration', () => {
    expect(this.basePlayback.getDuration()).toEqual(0)
  })

  test('is not playing', () => {
    expect(this.basePlayback.isPlaying()).toBeFalsy()
  })

  test('is not ready', () => {
    expect(this.basePlayback.isReady).toBeFalsy()
  })

  test('has NO_OP as playback type', () => {
    expect(this.basePlayback.getPlaybackType()).toEqual(Playback.NO_OP)
  })

  test('is not on highdefintion', () => {
    expect(this.basePlayback.isHighDefinitionInUse()).toBeFalsy()
  })

  test('can be consented', (done) => {
    const callback = jest.fn(() => {
      expect(callback).toHaveBeenCalledTimes(1)
      done()
    })
    this.basePlayback.consent(callback)
  })

  test('destroys by removing element from DOM', () => {
    const spy = jest.fn()
    this.basePlayback.$el = { remove: spy, off: () => {} }

    this.basePlayback.destroy()

    expect(spy).toHaveBeenCalledTimes(1)
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
