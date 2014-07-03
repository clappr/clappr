var assert = require('assert');
var BaseObject = require('../../src/base/base_object');
var $ = require('jquery');

describe('First spec', () => {
  it('should work', () => {
    $(document).click(() => { });
    $(document).click();
    assert.equal(true, true)
  });

  it('should work twice', () => {
    assert.equal(true, true)
  });

  it('should work again', () => {
    assert.equal(true, true)
  });
});

