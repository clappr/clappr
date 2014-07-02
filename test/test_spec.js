var assert = require('assert');
var BaseObject = require('../../src/base/base_object');

describe('First spec', () => {
  it('should work', () => {
    $(document).click(() => {
      console.log('EEEEPA')
      console.log('EEEEPA')
      console.log('EEEEPA')
      console.log('EEEEPA')
    });
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

