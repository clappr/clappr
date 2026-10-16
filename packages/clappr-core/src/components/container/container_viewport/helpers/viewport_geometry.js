// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { POSITIONS } from './viewport_options'

const ORIGINS = { start: '0%', center: '50%', end: '100%' }

const toPx = value => Math.round(value) || 0
const fitRatio = (inner, total) => (total > 0 ? inner / total : 0)

const placeOnAxis = (align, startMargin, endMargin, total, size) => {
  if (align === 'start') return { offset: startMargin, shift: startMargin }
  if (align === 'end') return { offset: total - endMargin - size, shift: -endMargin }
  return {
    offset: startMargin + (total - startMargin - endMargin - size) / 2,
    shift: (startMargin - endMargin) / 2
  }
}

/**
 * Places an already-normalized viewport inside a parent size.
 * The rect is integer px; the transform keeps the unrounded fit.
 * @param {{scale: Number, position: String, margin: {top: Number, right: Number, bottom: Number, left: Number}}} viewport
 * @param {{width: Number, height: Number}} size
 * @return {{rect: {x: Number, y: Number, width: Number, height: Number}, transform: String, origin: String}}
 */
export const computeGeometry = ({ scale, position, margin }, { width, height }) => {
  const horizontalRoom = fitRatio(width - margin.left - margin.right, width)
  const verticalRoom = fitRatio(height - margin.top - margin.bottom, height)
  const fit = Math.max(0, Math.min(scale, horizontalRoom, verticalRoom))
  const [vertical, horizontal] = POSITIONS[position]
  const x = placeOnAxis(horizontal, margin.left, margin.right, width, fit * width)
  const y = placeOnAxis(vertical, margin.top, margin.bottom, height, fit * height)
  return {
    rect: {
      x: toPx(x.offset),
      y: toPx(y.offset),
      width: toPx(fit * width),
      height: toPx(fit * height)
    },
    transform: `translate(${x.shift}px, ${y.shift}px) scale(${fit})`,
    origin: `${ORIGINS[horizontal]} ${ORIGINS[vertical]}`
  }
}
