import BaseObject from 'base/base_object'

describe('BaseObject', function() {
  beforeEach(() => {
    this.baseObject = new BaseObject()
    this.baseObject2 = new BaseObject()
  })

  it('has unique id', () => {
    expect(this.baseObject.uniqueId).to.be.equal('o1')
    expect(this.baseObject2.uniqueId).to.be.equal('o2')
  })
})
