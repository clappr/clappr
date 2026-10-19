// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

export const PX_STYLES = ['top', 'left', 'width', 'height']
export const IDENTITY_TRANSFORM = 'translate(0px, 0px) scale(1)'
export const TRANSITION_END_EVENTS = ['transitionend', 'webkitTransitionEnd']
export const TRANSITION_CANCEL_EVENTS = ['transitioncancel', 'webkitTransitionCancel']
// Old smart TV engines drop `transitionend`, so a call also settles on a timeout
export const SETTLE_MARGIN_MS = 100

const TRANSFORM_STYLES = [
  {
    transform: 'transform',
    origin: 'transformOrigin',
    transition: 'transition',
    borderRadius: 'borderRadius',
    property: 'transform',
    originProperty: 'transform-origin',
    radiusProperty: 'border-radius'
  },
  {
    transform: 'webkitTransform',
    origin: 'webkitTransformOrigin',
    transition: 'webkitTransition',
    borderRadius: 'borderRadius',
    property: '-webkit-transform',
    originProperty: '-webkit-transform-origin',
    radiusProperty: 'border-radius'
  }
]

export const findTransformStyles = style =>
  TRANSFORM_STYLES.filter(names => names.transform in style)[0] || null

export const flushLayout = element => element.offsetWidth

// A transform scales the curve, so the inline value is the visual radius divided by fit.
export const borderRadiusFor = (radius, fit, useTransform) => {
  if (radius == null) return null
  if (fit === 0) return '0px'
  if (!useTransform) return `${radius}px`
  return `${radius / fit}px`
}

// The first token is the property, so `transform` does not match `transform-origin`.
export const transitionedProperties = transition => {
  if (!transition) return []
  return transition.split(',').map(item => item.trim().split(' ')[0])
}
