import Core from '@/components/core'
import PlayerError from './error'
import Events from '@/base/events'

describe('PlayerError', function() {
  beforeEach(() => {
    this.core = new Core({})
    this.playerError = this.core.playerError
    this.errorData = {
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
      jest.spyOn(this.core, 'trigger')
      this.playerError.createError(this.errorData)

      expect(this.core.trigger).toHaveBeenCalledWith(Events.ERROR, this.errorData)
    })

    describe('when core is not set', () => {
      test('does not trigger ERROR event', () => {
        jest.spyOn(this.core, 'trigger')
        this.playerError.core = undefined
        this.playerError.createError(this.errorData)

        expect(this.core.trigger).not.toHaveBeenCalledWith(Events.ERROR, this.errorData)
      })
    })
  })
})
