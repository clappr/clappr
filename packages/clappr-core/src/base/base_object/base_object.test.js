import BaseObject from './base_object'

describe('BaseObject', () => {
  test('has a getter that returns the set of options', () => {
    const options = { clappr: 'is awesome!' }
    const baseObject = new BaseObject(options)

    expect(baseObject.options).toEqual(options)
  })

  test('has unique id', () => {
    const baseObject = new BaseObject()
    const baseObject2 = new BaseObject()

    expect(baseObject.uniqueId).toEqual('o2')
    expect(baseObject2.uniqueId).toEqual('o3')
  })
})
