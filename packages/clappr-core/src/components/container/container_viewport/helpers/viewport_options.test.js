import { normalizeAnimation, normalizeViewport } from './viewport_options'

const ZERO_MARGIN = { top: 0, right: 0, bottom: 0, left: 0 }
const DEFAULT_VIEWPORT = {
  scale: 1,
  position: 'center',
  margin: ZERO_MARGIN,
  radius: null,
  useTransform: true,
  animate: false,
  duration: 300,
  easing: 'ease'
}
const DEFAULT_ANIMATION = { animate: false, duration: 300, easing: 'ease' }

const errorOf = fn => {
  try {
    fn()
  } catch (error) {
    return error
  }
  return undefined
}

describe('normalizeViewport', () => {
  test('fills every omitted field', () => {
    expect(normalizeViewport()).toEqual(DEFAULT_VIEWPORT)
    expect(normalizeViewport({})).toEqual(DEFAULT_VIEWPORT)
  })

  test('keeps a complete request and expands a partial margin', () => {
    const options = {
      scale: 0.5,
      position: 'bottom-right',
      margin: { left: 8 },
      useTransform: 1,
      animate: 'yes',
      duration: 0,
      easing: 'linear'
    }

    expect(normalizeViewport(options)).toEqual({
      scale: 0.5,
      position: 'bottom-right',
      margin: { top: 0, right: 0, bottom: 0, left: 8 },
      radius: null,
      useTransform: true,
      animate: true,
      duration: 0,
      easing: 'linear'
    })
    expect(options.margin).toEqual({ left: 8 })
  })

  test('keeps an explicit radius and treats 0 as a value', () => {
    expect(normalizeViewport({ radius: 16 }).radius).toBe(16)
    expect(normalizeViewport({ radius: 0 }).radius).toBe(0)
  })

  test('keeps an explicit px request', () => {
    expect(normalizeViewport({ useTransform: false }).useTransform).toBe(false)
  })

  test('expands a numeric margin into four edges', () => {
    expect(normalizeViewport({ margin: 20 }).margin).toEqual({
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    })
  })

  test.each([
    'top-left',
    'top-center',
    'top-right',
    'center-left',
    'center',
    'center-right',
    'bottom-left',
    'bottom-center',
    'bottom-right'
  ])('accepts position %s', position => {
    expect(normalizeViewport({ position }).position).toBe(position)
  })

  test.each([-1, NaN, Infinity])('rejects radius %s', radius => {
    expect(errorOf(() => normalizeViewport({ radius }))).toEqual(
      new RangeError('radius must be a finite number >= 0')
    )
  })

  test.each([0, -0.5, 1.01, NaN, Infinity])('rejects scale %s', scale => {
    expect(errorOf(() => normalizeViewport({ scale }))).toEqual(
      new RangeError('scale must be greater than 0 and at most 1')
    )
  })

  test.each([
    ['-1', -1, 'margin must be a finite number >= 0'],
    ['Infinity', Infinity, 'margin must be a finite number >= 0'],
    ['NaN', NaN, 'margin must be a finite number >= 0'],
    ['{left: -1}', { left: -1 }, 'margin.left must be a finite number >= 0']
  ])('rejects margin %s', (_, margin, message) => {
    expect(errorOf(() => normalizeViewport({ margin }))).toEqual(new RangeError(message))
  })

  test.each(['middle', 'top', 'Top-Left', 'top_left'])('rejects position %s', position => {
    expect(errorOf(() => normalizeViewport({ position }))).toEqual(
      new RangeError(`unknown position "${position}"`)
    )
  })

  test.each([
    ['options string', 'big', 'options must be an object'],
    ['options number', 42, 'options must be an object'],
    ['scale', { scale: '0.5' }, 'scale must be a number'],
    ['duration', { duration: '300' }, 'duration must be a number'],
    ['margin', { margin: '20px' }, 'margin must be a number or an object'],
    ['margin edge', { margin: { top: '10' } }, 'margin.top must be a number'],
    ['position', { position: 1 }, 'position must be a string'],
    ['easing', { easing: 1 }, 'easing must be a string'],
    ['radius', { radius: '16' }, 'radius must be a number'],
    ['radius null', { radius: null }, 'radius must be a number']
  ])('wrong type on %s', (_, options, message) => {
    expect(errorOf(() => normalizeViewport(options))).toEqual(new TypeError(message))
  })

  test('reports scale before a later invalid duration', () => {
    expect(errorOf(() => normalizeViewport({ scale: '0.5', duration: -1 }))).toEqual(
      new TypeError('scale must be a number')
    )
  })
})

describe('normalizeAnimation', () => {
  test('fills the reset defaults and ignores viewport fields', () => {
    expect(normalizeAnimation()).toEqual(DEFAULT_ANIMATION)
    expect(normalizeAnimation({ scale: 0, position: 'middle' })).toEqual(DEFAULT_ANIMATION)
  })

  test('reads animate, duration and easing', () => {
    expect(normalizeAnimation({ animate: true, duration: 500, easing: 'linear' })).toEqual({
      animate: true,
      duration: 500,
      easing: 'linear'
    })
  })

  test.each([-1, Infinity, NaN])('rejects duration %s', duration => {
    expect(errorOf(() => normalizeAnimation({ duration }))).toEqual(
      new RangeError('duration must be a finite number >= 0')
    )
  })

  test.each([
    ['options string', 'big', 'options must be an object'],
    ['duration', { duration: '300' }, 'duration must be a number'],
    ['easing', { easing: 1 }, 'easing must be a string']
  ])('wrong type on %s', (_, options, message) => {
    expect(errorOf(() => normalizeAnimation(options))).toEqual(new TypeError(message))
  })
})
