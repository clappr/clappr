import {
  IDENTITY_TRANSFORM,
  PX_STYLES,
  SETTLE_MARGIN_MS,
  TRANSITION_END_EVENTS,
  findTransformStyles,
  flushLayout
} from './viewport_style'

describe('findTransformStyles', () => {
  test('prefers the unprefixed transform', () => {
    const inherited = Object.create({ transform: '' })

    expect(findTransformStyles({ transform: '', webkitTransform: '' })).toMatchObject({
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

describe('flushLayout', () => {
  test('reads offsetWidth so the browser flushes pending style', () => {
    expect(flushLayout({ offsetWidth: 12 })).toBe(12)
  })
})

describe('viewport style constants', () => {
  test('names the px box, the identity transform and the settle signals', () => {
    expect(PX_STYLES).toEqual(['top', 'left', 'width', 'height'])
    expect(IDENTITY_TRANSFORM).toBe('translate(0px, 0px) scale(1)')
    expect(TRANSITION_END_EVENTS).toEqual(['transitionend', 'webkitTransitionEnd'])
    expect(SETTLE_MARGIN_MS).toBe(100)
  })
})
