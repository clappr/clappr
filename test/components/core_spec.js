import Core from '../../src/components/core'
import Events from '../../src/base/events'

describe('Core', function() {
  describe('When configure', function() {
    beforeEach(function () {
      this.core = new Core({})
      this.core.load = sinon.spy()
    })

    it('should update option', function() {
      const newOptions = {
        autoPlay: true
      }
      this.core.configure(newOptions)

      expect(this.core.options.autoPlay).to.equal(newOptions.autoPlay)
    })

    it('should update option and load source', function() {
      const newOptions = {
        source: 'some/path/to/media.mp4',
        mute: true
      }
      this.core.configure(newOptions)

      assert.ok(this.core.load.called)
      expect(this.core.options.mute).to.equal(newOptions.mute)
    })

    it('shoud trigger options change event', function () {
      let callback = sinon.spy()
      this.core.on(Events.CORE_OPTIONS_CHANGE, callback)

      const newOptions = {
        autoPlay: false
      }
      this.core.configure(newOptions)

      assert.ok(callback.called)
      expect(this.core.options.autoPlay).to.equal(newOptions.autoPlay)
    })
  })
})
