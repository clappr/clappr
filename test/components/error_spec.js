import Core from '../../src/components/core'
import Events from '../../src/base/events'

describe('PlayerError', function() {
  beforeEach(function() {
    this.core = new Core({})
    this.playerError = this.core.playerError
    this.errorData = {
      code: 'test_01',
      description: 'test error',
      level: this.playerError.Levels.FATAL,
      origin: 'test',
      scope: 'it',
      raw: {},
    }
  })

  describe('when error method is called', function() {
    it('trigger ERROR event', function() {
      sinon.spy(this.core, 'trigger')
      this.playerError.error(this.errorData)

      assert.ok(this.core.trigger.calledWith(Events.ERROR, {
        code: 'test_01',
        description: 'test error',
        level: this.playerError.Levels.FATAL,
        origin: 'test',
        scope: 'it',
        raw: {},
      }))
    })

    describe('when core is not setted', function() {
      it('does not trigger ERROR event', function() {
        sinon.spy(this.core, 'trigger')
        this.playerError.core = undefined
        this.playerError.error(this.errorData)

        assert.notOk(this.core.trigger.calledWith(Events.ERROR, this.errorData))
      })
    })
  })
})
