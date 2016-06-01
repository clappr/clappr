import mocks from '../../src/base/mocks'
import Clappr from '../../src/main'

describe('Mocks', function() {
  describe('window', function() {
    it('should allow the user to set the new "window" object immediately after requiring Clappr', function() {
      expect(function() {
        mocks.window = {};
      }).to.not.throw(Error)
    })
  })
})
