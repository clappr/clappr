import PlayerError from '../../src/components/error'
import Core from '../../src/components/core'
import Events from '../../src/base/events'

describe('PlayerError', function() {
  beforeEach(function() {
    this.core = new Core({})

    this.errorData = {
      code: 'test_01',
      description: 'test error',
      level: PlayerError.Levels.FATAL,
      origin: 'test',
      scope: 'it',
      raw: {},
    }
  })

  it('trigger ERROR with error data when error method is called', function() {
    sinon.spy(this.core, 'trigger')
    PlayerError.error(this.errorData)

    assert.ok(this.core.trigger.calledWith(Events.ERROR, {
      code: 'test_01',
      description: 'test error',
      level: PlayerError.Levels.FATAL,
      origin: 'test',
      scope: 'it',
      raw: {},
    }))
  })

  it('does not trigger ERROR when core is not setted', function() {
    sinon.spy(this.core, 'trigger')
    PlayerError.core = undefined
    PlayerError.error(this.errorData)

    assert.notOk(this.core.trigger.calledWith(Events.ERROR, this.errorData))
  })
})
