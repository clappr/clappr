var BaseObject = require('../spec_helper').BaseObject;

describe('BaseObject', function() {
  it('should have an empty default element', function() {
    var obj = new BaseObject();
    obj.$el.html().should.be.empty;
  });
});
