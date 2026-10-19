// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// [vertical, horizontal] alignment consumed by the geometry helper
export const POSITIONS = {
  'top-left': ['start', 'start'],
  'top-center': ['start', 'center'],
  'top-right': ['start', 'end'],
  'center-left': ['center', 'start'],
  center: ['center', 'center'],
  'center-right': ['center', 'end'],
  'bottom-left': ['end', 'start'],
  'bottom-center': ['end', 'center'],
  'bottom-right': ['end', 'end']
}

const DEFAULTS = { scale: 1, position: 'center', margin: 0, duration: 300, easing: 'ease' }
const EDGES = ['top', 'right', 'bottom', 'left']

const isObject = value => value !== null && typeof value === 'object'

const assertNumber = (name, value) => {
  if (typeof value !== 'number') throw new TypeError(`${name} must be a number`)
}

const assertString = (name, value) => {
  if (typeof value !== 'string') throw new TypeError(`${name} must be a string`)
}

const assertNonNegative = (name, value) => {
  assertNumber(name, value)
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be a finite number >= 0`)
  if (value < 0) throw new RangeError(`${name} must be a finite number >= 0`)
}

const readOptions = options => {
  if (options === undefined) return {}
  if (!isObject(options)) throw new TypeError('options must be an object')
  return options
}

const readOption = (options, key) => (options[key] === undefined ? DEFAULTS[key] : options[key])

const normalizeScale = scale => {
  assertNumber('scale', scale)
  if (!Number.isFinite(scale)) throw new RangeError('scale must be greater than 0 and at most 1')
  if (scale <= 0) throw new RangeError('scale must be greater than 0 and at most 1')
  if (scale > 1) throw new RangeError('scale must be greater than 0 and at most 1')
  return scale
}

const normalizePosition = position => {
  assertString('position', position)
  if (!Object.prototype.hasOwnProperty.call(POSITIONS, position)) {
    throw new RangeError(`unknown position "${position}"`)
  }
  return position
}

const normalizeRadius = radius => {
  if (radius === undefined) return null
  assertNonNegative('radius', radius)
  return radius
}

const normalizeMargin = margin => {
  if (typeof margin === 'number') {
    assertNonNegative('margin', margin)
    return { top: margin, right: margin, bottom: margin, left: margin }
  }
  if (!isObject(margin)) throw new TypeError('margin must be a number or an object')
  return EDGES.reduce((normalized, edge) => {
    const value = margin[edge] === undefined ? 0 : margin[edge]
    assertNonNegative(`margin.${edge}`, value)
    return { ...normalized, [edge]: value }
  }, {})
}

/**
 * Checks the arguments accepted by a viewport reset.
 * @param {Object} [options]
 * @return {{animate: Boolean, duration: Number, easing: String}}
 */
export const normalizeAnimation = options => {
  const source = readOptions(options)
  const duration = readOption(source, 'duration')
  assertNonNegative('duration', duration)
  const easing = readOption(source, 'easing')
  assertString('easing', easing)
  return { animate: !!source.animate, duration, easing }
}

/**
 * Checks a viewport request and fills every omitted field.
 * Throws TypeError or RangeError and does not mutate `options`.
 * @param {Object} [options]
 * @return {Object}
 */
export const normalizeViewport = options => {
  const source = readOptions(options)
  const scale = normalizeScale(readOption(source, 'scale'))
  const position = normalizePosition(readOption(source, 'position'))
  const margin = normalizeMargin(readOption(source, 'margin'))
  const radius = normalizeRadius(source.radius)
  return {
    scale,
    position,
    margin,
    radius,
    useTransform: source.useTransform === undefined ? true : !!source.useTransform,
    ...normalizeAnimation(source)
  }
}
