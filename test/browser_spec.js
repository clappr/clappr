var Browser = require('browser');

describe('Browser', () => {
  it('checks localstorage support', () => {
    expect(Browser.hasLocalstorage).to.be.equal(true);
  });
});
