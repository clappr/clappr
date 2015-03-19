var UIObject = require('../../src/base/ui_object');

describe('UIObject', function() {
  beforeEach(function(){
    this.uiObject = new UIObject();
  });

  it('is a div', function(){
    expect(this.uiObject.tagName).to.be.equal("div");
  });

  it('has an unique id', function(){
    var uiObjectA = new UIObject();
    var uiObjectB = new UIObject();
    expect(uiObjectA.cid).to.be.not.equal(uiObjectB.cid);
  });
});
