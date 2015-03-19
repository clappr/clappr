var BaseObject = require('../../src/base/base_object')

describe('BaseObject', function() {
  beforeEach(function(){
    this.baseObject = new BaseObject()
    this.baseObject2 = new BaseObject()
  })

  it('has unique id', function(){
    expect(this.baseObject.uniqueId).to.be.equal('o1')
    expect(this.baseObject2.uniqueId).to.be.equal('o2')
  })

  it('has a container', function(){
    expect(this.baseObject.container).to.be.equal(undefined)
  })
})
