var Browser = require('../../src/components/browser');

describe('Browser', () => {
  it('checks localstorage support', () => {
    expect(Browser.hasLocalstorage).to.be.equal(true);
  });
});
