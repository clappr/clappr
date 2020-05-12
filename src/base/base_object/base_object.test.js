import BaseObject from './base_object'

describe('BaseObject', function() {
  test('has unique id', () => {
    const baseObject = new BaseObject()
    const baseObject2 = new BaseObject()
    expect(baseObject.uniqueId).toEqual('o1')
    expect(baseObject2.uniqueId).toEqual('o2')
  })
})
