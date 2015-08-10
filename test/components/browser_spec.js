import Browser from '../../src/components/browser'

describe('Browser', function() {
  it('checks localstorage support', function() {
    expect(Browser.hasLocalstorage).to.be.equal(true)
  })
})
