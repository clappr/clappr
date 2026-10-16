import { findTransformStyles } from './viewport_style'

describe('findTransformStyles', () => {
  test('prefers the unprefixed transform', () => {
    const inherited = Object.create({ transform: '' })

    expect(findTransformStyles({ transform: '', webkitTransform: '' })).toEqual({
      transform: 'transform',
      origin: 'transformOrigin',
      transition: 'transition',
      property: 'transform',
      originProperty: 'transform-origin'
    })
    expect(findTransformStyles(inherited).property).toBe('transform')
  })

  test('uses the webkit prefix when it is the only transform', () => {
    expect(findTransformStyles({ webkitTransform: '' })).toEqual({
      transform: 'webkitTransform',
      origin: 'webkitTransformOrigin',
      transition: 'webkitTransition',
      property: '-webkit-transform',
      originProperty: '-webkit-transform-origin'
    })
  })

  test('returns null when the style cannot transform', () => {
    expect(findTransformStyles({})).toBeNull()
  })
})
