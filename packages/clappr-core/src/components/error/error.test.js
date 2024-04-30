import Core from '@/components/core'
import PlayerError from './error'
import Events from '@/base/events'

describe('PlayerError', function() {
  let core, playerError, errorData
  beforeEach(() => {
    core = new Core({})
    playerError = core.playerError
    errorData = {
      code: 'test_01',
      description: 'test error',
      level: PlayerError.Levels.FATAL,
      origin: 'test',
      scope: 'it',
      raw: {},
    }
  })

  test('has default value to options', () => {
    const playerError = new PlayerError(undefined, new Core({}))

    expect(playerError.options).toEqual({})
  })

  test('have reference to access received options on your construction', () => {
    const options = { testOption: 'some_option' }
    const playerError = new PlayerError(options, new Core(options))

    expect(playerError.options).toEqual(options)
  })

  describe('when error method is called', () => {
    test('triggers ERROR event', () => {
      jest.spyOn(core, 'trigger')
      playerError.createError(errorData)

      expect(core.trigger).toHaveBeenCalledWith(Events.ERROR, errorData)
    })

    describe('when core is not set', () => {
      test('does not trigger ERROR event', () => {
        jest.spyOn(core, 'trigger')
        playerError.core = undefined
        playerError.createError(errorData)

        expect(core.trigger).not.toHaveBeenCalledWith(Events.ERROR, errorData)
      })
    })
  })
})
