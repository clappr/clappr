var UIObject = require('../spec_helper').UIObject;

describe('UIObject', function() {
  it('should have an empty default element', function() {
    var obj = new UIObject();
    obj.$el.html().should.be.empty;
  });
});
