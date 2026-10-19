// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Events from '../../../base/events/events'
import { computeGeometry, transformForRect } from './helpers/viewport_geometry'
import { normalizeAnimation, normalizeViewport } from './helpers/viewport_options'
import { copyRect, copyViewport, sameRect } from './helpers/viewport_rect'
import {
  IDENTITY_TRANSFORM,
  PX_STYLES,
  SETTLE_MARGIN_MS,
  TRANSITION_CANCEL_EVENTS,
  TRANSITION_END_EVENTS,
  borderRadiusFor,
  findTransformStyles,
  flushLayout,
  transitionedProperties
} from './helpers/viewport_style'

const TRANSITION_EVENTS = TRANSITION_END_EVENTS.concat(TRANSITION_CANCEL_EVENTS)

/**
 * @typedef {Object} ViewportMargin
 * @property {Number} [top=0]
 * @property {Number} [right=0]
 * @property {Number} [bottom=0]
 * @property {Number} [left=0]
 */

/**
 * @typedef {Object} DisplayRect the area the video visually occupies, in integer px from the core's top-left corner
 * @property {Number} x
 * @property {Number} y
 * @property {Number} width
 * @property {Number} height
 */

/**
 * @typedef {Object} ViewportOptions
 * @property {Number} [scale=1] in (0, 1]
 * @property {'top-left'|'top-center'|'top-right'|'center-left'|'center'|'center-right'|'bottom-left'|'bottom-center'|'bottom-right'} [position='center']
 * @property {Number|ViewportMargin} [margin=0] px kept free around the video
 * @property {Number|null} [radius=null] visual corner radius in px. Omitted applies no border-radius
 * @property {Boolean} [useTransform=true] move the video with a CSS transform. `false` resizes the container box
 * @property {Boolean} [animate=false] transition the change, only with `useTransform`
 * @property {Number} [duration=300] transition time in ms
 * @property {String} [easing='ease'] CSS timing function
 */

/**
 * @typedef {Object} ViewportResult
 * @property {Boolean} interrupted `true` when a newer call replaced this one before it settled
 * @property {DisplayRect|null} rect
 */

/**
 * Places the video of a container inside the core: it validates the request, computes the display rect
 * and applies it either as inline px on the container (and the playback's `setDisplayRect` hook) or as a CSS transform.
 * @class ContainerViewport
 * @private
 */
export default class ContainerViewport {
  constructor(container) {
    this._container = container
    this._viewport = null
    this._rect = null
    this._pxRect = null
    this._strategy = null
    this._pending = null
    this._running = {}
    this._ignoreCancel = {}
    this._radiusOwned = false
  }

  /**
   * @type {{rect: DisplayRect|null, viewport: ViewportOptions|null}}
   */
  get current() {
    const size = this._measure()
    if (!size) return { rect: null, viewport: null }
    if (!this._viewport) return { rect: this._fullRect(size), viewport: null }
    return { rect: copyRect(this._rect), viewport: copyViewport(this._viewport) }
  }

  set(options) {
    const viewport = normalizeViewport(options)
    const size = this._measure()
    if (!size) throw new Error('The container has no parentElement to measure')
    viewport.useTransform = viewport.useTransform && !!findTransformStyles(this._container.el.style)
    const geometry = computeGeometry(viewport, size)

    this._begin(viewport, geometry.rect)
    const animated = viewport.useTransform && viewport.animate
    if (!animated) {
      this._apply(viewport, geometry, size, '')
      return this._finish()
    }
    // Commit the origin before the transition. In the same frame the browser would slide it.
    const pinned = this._pinOrigin(geometry.origin)
    const radiusCss = borderRadiusFor(viewport.radius, geometry.fit, true)
    const transition = this._transitionFor(viewport, !pinned, radiusCss)
    this._applyTransform(geometry, size, transition)
    return this._awaitSettle(viewport.duration, transition, () => {
      this._writeTransform({ transition: '' })
      if (this._viewport.radius == null) this._clearOwnedRadius()
    })
  }

  reset(options) {
    const { animate, duration, easing } = normalizeAnimation(options)
    const active = this._viewport || this._pending
    if (!active) {
      return Promise.resolve({ interrupted: false, rect: this._fullRect(this._measure()) })
    }

    const size = this._measure()
    if (!size) throw new Error('The container has no parentElement to measure')
    const rect = this._fullRect(size)

    this._begin(null, rect)
    const animated = animate && this._strategy === 'transform'
    if (!animated) {
      this._clearApplied(rect)
      return this._finish()
    }
    const transition = this._transitionFor({ duration, easing })
    const values = { transform: IDENTITY_TRANSFORM, transition }
    const radiusWrite = this._syncRadius(null, null, true)
    if (radiusWrite != null) values.borderRadius = radiusWrite
    this._writeTransform(values)
    return this._awaitSettle(duration, transition, () => this._clearApplied(rect))
  }

  reapply() {
    const size = this._measure()
    if (!size) return
    if (!this._viewport) {
      this._refreshPendingReset(size)
      return
    }
    const geometry = computeGeometry(this._viewport, size)
    if (sameRect(geometry.rect, this._rect)) return

    this._rect = geometry.rect
    this._notify(Events.CONTAINER_VIEWPORT_WILL_CHANGE)
    // A pending animated call retargets in place and restarts its settle timer; its own settle fires the did event.
    if (this._pending) {
      this._applyTransform(geometry, size, this._pending.transition)
      this._restartSettleTimer()
      return
    }

    this._apply(this._viewport, geometry, size, '')
    this._notify(Events.CONTAINER_VIEWPORT_DID_CHANGE)
  }

  destroy() {
    this._interrupt()
    this._viewport = null
    this._rect = null
    this._strategy = null
  }

  _refreshPendingReset(size) {
    if (!this._pending) return
    const rect = this._fullRect(size)
    if (sameRect(rect, this._rect)) return
    // The identity transform does not depend on the parent size, but the reported full rect does.
    this._rect = rect
    this._notify(Events.CONTAINER_VIEWPORT_WILL_CHANGE)
  }

  _measure() {
    const parent = this._container.el.parentElement
    if (!parent) return null
    return { width: parent.clientWidth, height: parent.clientHeight }
  }

  _fullRect(size) {
    if (!size) return null
    return { x: 0, y: 0, width: size.width, height: size.height }
  }

  _begin(viewport, rect) {
    this._interrupt()
    this._viewport = viewport
    this._rect = rect
    this._notify(Events.CONTAINER_VIEWPORT_WILL_CHANGE)
  }

  _finish() {
    this._notify(Events.CONTAINER_VIEWPORT_DID_CHANGE)
    return Promise.resolve({ interrupted: false, rect: copyRect(this._rect) })
  }

  _notify(eventName) {
    this._container.trigger(eventName, {
      rect: copyRect(this._rect),
      viewport: copyViewport(this._viewport)
    })
  }

  _pinOrigin(origin) {
    const el = this._container.el
    const names = findTransformStyles(el.style)
    if (!names || el.style[names.transform]) return false
    el.style[names.origin] = origin
    flushLayout(el)
    return true
  }

  _transitionFor({ duration, easing }, includeOrigin = true, radiusCss = null) {
    const names = findTransformStyles(this._container.el.style)
    const timing = `${duration}ms ${easing}`
    // Position with no margin lives in transform-origin, so the same translate would not move.
    const parts = [`${names.property} ${timing}`]
    if (includeOrigin) parts.push(`${names.originProperty} ${timing}`)
    const radiusWrite = this._ownedRadiusWrite(radiusCss, true)
    if (radiusWrite != null && this._container.el.style[names.borderRadius] !== radiusWrite) {
      parts.push(`${names.radiusProperty} ${timing}`)
    }
    return parts.join(', ')
  }

  _apply(viewport, geometry, size, transition) {
    if (!viewport.useTransform) {
      this._applyPx(geometry.rect)
      const radiusWrite = this._syncRadius(
        viewport.radius,
        borderRadiusFor(viewport.radius, geometry.fit, false),
        false
      )
      if (radiusWrite != null) this._container.el.style.borderRadius = radiusWrite
      return
    }
    this._applyTransform(geometry, size, transition)
  }

  _applyPx(rect) {
    if (this._strategy === 'transform') this._clearTransform()
    const { style } = this._container.el
    style.top = `${rect.y}px`
    style.left = `${rect.x}px`
    style.width = `${rect.width}px`
    style.height = `${rect.height}px`
    this._strategy = 'px'
    this._pxRect = copyRect(rect)
    this._container.playback.setDisplayRect(copyRect(rect))
  }

  _applyTransform(geometry, size, transition) {
    if (this._strategy === 'px') {
      // The px box is where the transition starts. Clearing it first would jump to the full player.
      if (transition) {
        const start = transformForRect(this._pxRect, size, this._viewport.position)
        this._writeTransform({ transform: start })
      }
      this._clearPx()
      this._container.playback.setDisplayRect(this._fullRect(size))
      if (transition) flushLayout(this._container.el)
    }
    this._strategy = 'transform'
    const values = { origin: geometry.origin, transform: geometry.transform, transition }
    const radiusWrite = this._syncRadius(
      this._viewport.radius,
      borderRadiusFor(this._viewport.radius, geometry.fit, true),
      !!transition
    )
    if (radiusWrite != null) values.borderRadius = radiusWrite
    this._writeTransform(values)
  }

  _ownedRadiusWrite(radiusCss, animated) {
    if (radiusCss != null) return radiusCss
    if (!this._radiusOwned) return null
    return animated ? '0px' : ''
  }

  _syncRadius(radius, radiusCss, animated) {
    const write = this._ownedRadiusWrite(radiusCss, animated)
    if (write == null) return null
    // The curve is still visible while it eases back to 0, so the clip stays until settle.
    const clearing = radius == null && write === '0px'
    if (radius > 0) this._container.el.style.overflow = 'hidden'
    else if (!clearing) this._container.el.style.overflow = ''
    this._radiusOwned = write !== ''
    return write
  }

  _clearOwnedRadius() {
    if (!this._radiusOwned) return
    const { style } = this._container.el
    style.borderRadius = ''
    style.overflow = ''
    this._radiusOwned = false
  }

  _writeTransform(values) {
    const el = this._container.el
    const names = findTransformStyles(el.style)
    const before = {
      transform: el.style[names.transform],
      origin: el.style[names.origin],
      borderRadius: el.style[names.borderRadius]
    }
    this._armTransition(el, names, values)
    Object.keys(values).forEach(key => {
      el.style[names[key]] = values[key]
    })
    this._trackRunning(names, values, before)
  }

  _trackRunning(names, values, before) {
    if ('transition' in values && !values.transition) {
      this._running = {}
      this._ignoreCancel = {}
      return
    }
    const transition =
      'transition' in values ? values.transition : this._container.el.style[names.transition]
    const listed = transitionedProperties(transition)
    const tracked = [
      ['transform', names.property],
      ['origin', names.originProperty],
      ['borderRadius', names.radiusProperty]
    ]
    tracked.forEach(([key, prop]) => {
      if (!(key in values)) return
      const changed = before[key] !== this._container.el.style[names[key]]
      if (changed && listed.indexOf(prop) !== -1) {
        // Rewriting a moving property cancels its old transition. That cancel is not the new end.
        if (this._running[prop]) this._ignoreCancel[prop] = true
        this._running[prop] = true
        return
      }
      if (listed.indexOf(prop) === -1) {
        delete this._running[prop]
        delete this._ignoreCancel[prop]
      }
    })
  }

  _armTransition(el, names, values) {
    if (!values.transition) return
    const changes = key => key in values && values[key] !== el.style[names[key]]
    const moves = ['transform', 'origin', 'borderRadius'].some(changes)
    if (!moves) return
    if (el.style[names.transition]) return
    // The transition has to be painted before the new value, or the change is instant.
    el.style[names.transition] = values.transition
    flushLayout(el)
  }

  _clearPx() {
    const { style } = this._container.el
    PX_STYLES.forEach(name => {
      style[name] = ''
    })
    this._pxRect = null
  }

  _clearTransform() {
    this._writeTransform({ origin: '', transform: '', transition: '' })
  }

  _clearApplied(rect) {
    if (this._strategy === 'px') {
      this._clearPx()
      if (rect) this._container.playback.setDisplayRect(copyRect(rect))
    } else if (this._strategy === 'transform') this._clearTransform()
    this._strategy = null
    this._clearOwnedRadius()
  }

  _awaitSettle(duration, transition, onSettle) {
    return new Promise(resolve => {
      const el = this._container.el
      const listener = event => {
        if (event.target !== el) return
        const prop = event.propertyName
        if (!this._running[prop]) return
        const cancelled =
          event.type === 'transitioncancel' || event.type === 'webkitTransitionCancel'
        if (cancelled && this._ignoreCancel[prop]) {
          delete this._ignoreCancel[prop]
          return
        }
        delete this._running[prop]
        delete this._ignoreCancel[prop]
        if (Object.keys(this._running).length === 0) this._settle()
      }
      this._pending = { resolve, listener, onSettle, transition, duration, timer: null }
      this._restartSettleTimer()
      TRANSITION_EVENTS.forEach(type => el.addEventListener(type, listener))
    })
  }

  _restartSettleTimer() {
    clearTimeout(this._pending.timer)
    this._pending.timer = setTimeout(
      () => this._settle(),
      this._pending.duration + SETTLE_MARGIN_MS
    )
  }

  _release() {
    const pending = this._pending
    const el = this._container.el
    clearTimeout(pending.timer)
    TRANSITION_EVENTS.forEach(type => el.removeEventListener(type, pending.listener))
    this._pending = null
    return pending
  }

  _settle() {
    if (!this._pending) return
    const { resolve, onSettle } = this._release()
    onSettle()
    this._notify(Events.CONTAINER_VIEWPORT_DID_CHANGE)
    resolve({ interrupted: false, rect: copyRect(this._rect) })
  }

  _interrupt() {
    if (!this._pending) return
    const { resolve } = this._release()
    resolve({ interrupted: true, rect: copyRect(this._rect) })
  }
}
