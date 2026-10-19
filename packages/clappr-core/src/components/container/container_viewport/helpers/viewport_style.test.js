import { borderRadiusFor, findTransformStyles, transitionedProperties } from './viewport_style'

describe('findTransformStyles', () => {
  test('prefers the unprefixed transform', () => {
    const inherited = Object.create({ transform: '' })

    expect(findTransformStyles({ transform: '', webkitTransform: '' })).toEqual({
      transform: 'transform',
      origin: 'transformOrigin',
      transition: 'transition',
      borderRadius: 'borderRadius',
      property: 'transform',
      originProperty: 'transform-origin',
      radiusProperty: 'border-radius'
    })
    expect(findTransformStyles(inherited).property).toBe('transform')
  })

  test('uses the webkit prefix when it is the only transform', () => {
    expect(findTransformStyles({ webkitTransform: '' })).toEqual({
      transform: 'webkitTransform',
      origin: 'webkitTransformOrigin',
      transition: 'webkitTransition',
      borderRadius: 'borderRadius',
      property: '-webkit-transform',
      originProperty: '-webkit-transform-origin',
      radiusProperty: 'border-radius'
    })
  })

  test('returns null when the style cannot transform', () => {
    expect(findTransformStyles({})).toBeNull()
  })
})

describe('borderRadiusFor', () => {
  test('returns null when radius is absent', () => {
    expect(borderRadiusFor(null, 0.5, true)).toBeNull()
    expect(borderRadiusFor(undefined, 0.5, false)).toBeNull()
  })

  test('divides by fit on the transform path', () => {
    expect(borderRadiusFor(16, 0.5, true)).toBe('32px')
    expect(borderRadiusFor(16, 1, true)).toBe('16px')
  })

  test('keeps the visual px when the box is not scaled', () => {
    expect(borderRadiusFor(16, 0.5, false)).toBe('16px')
    expect(borderRadiusFor(0, 0.5, true)).toBe('0px')
  })

  test('writes 0px when the video has no size', () => {
    expect(borderRadiusFor(16, 0, true)).toBe('0px')
    expect(borderRadiusFor(16, 0, false)).toBe('0px')
  })
})

describe('transitionedProperties', () => {
  test('reads each property without matching transform inside transform-origin', () => {
    expect(transitionedProperties('transform 300ms ease, transform-origin 300ms ease')).toEqual([
      'transform',
      'transform-origin'
    ])
  })

  test('returns nothing for an empty transition', () => {
    expect(transitionedProperties('')).toEqual([])
  })
})
