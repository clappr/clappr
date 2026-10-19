# Container viewport

By default the video fills the whole player. The container viewport lets you shrink the video and place it anywhere inside the player, with one call, and tells you the exact area it ends up occupying.

## Quick start

```javascript
const player = new Clappr.Player({ source: 'http://your.video/here.mp4', parentId: '#player' })

player.on(Clappr.Events.PLAYER_READY, async () => {
  const container = player.core.activeContainer
  const { rect } = await container.setViewport({ scale: 0.5, position: 'bottom-right', margin: 16 })
  console.log(rect) // { x: 624, y: 344, width: 640, height: 360 } in a 1280x720 player
})
```

The video is now half the size of the player, in its bottom-right corner, 16 px away from the edges. `setViewport` returns a Promise that resolves with that area, called the [rect](#the-rect).

## Strategies: px or transform

There are two ways to apply a viewport, and you choose per call with `useTransform`:

|                            | px (`useTransform: false`)                                                                               | transform (default)                                                               |
| -------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| What moves                 | the container box gets inline `top`, `left`, `width` and `height`                                        | the container gets a CSS `transform`, with `transform-origin` set from `position` |
| Layout changes             | yes, the box really shrinks                                                                              | no, the layout box keeps its size and only the paint moves                        |
| `setDisplayRect` is called | yes, with the rect                                                                                       | no, read the rect from the result or the events                                   |
| `animate` has an effect    | no, it is ignored                                                                                        | yes, the change is a CSS transition                                               |
| `CONTAINER_RESIZE` fires   | yes, the container's own polling reports the viewport's width and height                                 | never, the box does not change                                                    |
| When to pick it            | the playback must know the area (for example, it draws outside the DOM), or the box must match the video | you want an animation, or a DOM video moved without a layout cost                 |

Omitted, `useTransform` is `true`. If the engine supports neither `transform` nor `webkitTransform`, that call is applied as px and the `viewport` getter reports `useTransform: false`, so you can tell which strategy ran.

## Reference

You reach everything through the active container: `player.core.activeContainer`.

### setViewport(options)

Returns a `Promise` that resolves with `{ interrupted, rect }`. All options are optional.

| Option         | Type             | Default    | Accepted values                                                                                                 | Throws                                                                     |
| -------------- | ---------------- | ---------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `scale`        | number           | `1`        | greater than 0 and at most 1; clamped so the video fits inside the margins                                      | `RangeError` out of range or `NaN`, `TypeError` not a number               |
| `position`     | string           | `'center'` | one of the nine [positions](#positions)                                                                         | `RangeError` unknown value, `TypeError` not a string                       |
| `margin`       | number or object | `0`        | px free around the video, `>= 0`; an object takes `top`, `right`, `bottom` and `left`, and a missing key is `0` | `RangeError` negative or not finite, `TypeError` not a number or an object |
| `radius`       | number           | omitted    | visual corner radius in px, `>= 0`, the same on all four corners. Omitted does not set `border-radius`          | `RangeError` negative or not finite, `TypeError` not a number              |
| `useTransform` | boolean          | `true`     | `false` sizes the container box with inline px. Omitted uses a CSS transform                                    | -                                                                          |
| `animate`      | boolean          | `false`    | `true` transitions the change. Ignored when `useTransform` is `false`                                           | -                                                                          |
| `duration`     | number           | `300`      | ms, finite and `>= 0`                                                                                           | `RangeError` negative or not finite, `TypeError` not a number              |
| `easing`       | string           | `'ease'`   | any CSS timing function, not checked                                                                            | `TypeError` not a string                                                   |

A call that throws does so synchronously, before any style, event or Promise exists, and leaves the viewport and any pending call as they were. `TypeError` is also thrown when `options` is neither `undefined` nor an object, and a container that is not inside the player (no `parentElement`) throws a plain `Error`.

### resetViewport(options)

Removes the viewport and gives the whole player back to the video. It returns the same `{ interrupted, rect }` Promise, with the full rect. `options` takes `animate`, `duration` and `easing`, validated like above; `animate` only has an effect after a `useTransform: true` viewport. With no viewport it changes nothing and fires no event. With a viewport and no parent element it throws the same `Error` as `setViewport` and leaves the viewport in place, because the full rect cannot be measured.

### viewport

A read-only getter that returns `{ rect, viewport }`: the rect in effect and the options, normalized to all eight keys with `margin` expanded to `top`, `right`, `bottom` and `left`. `radius` is `null` when the call omitted it. Without a viewport it returns the full rect and `viewport: null`, and while the container is not inside the player it returns `{ rect: null, viewport: null }`.

### Positions

| Left          | Center          | Right          |
| ------------- | --------------- | -------------- |
| `top-left`    | `top-center`    | `top-right`    |
| `center-left` | `center`        | `center-right` |
| `bottom-left` | `bottom-center` | `bottom-right` |

### The rect

The rect is `{ x, y, width, height }` in integer px, counted from the Core's top-left corner. Every value is rounded. With `useTransform: true` it is the visual rect, the area the video appears in, not the layout box.

### The result

`setViewport` and `resetViewport` resolve with `{ interrupted, rect }`. `interrupted` is `true` when a newer call replaced the call before it finished; `rect` is then the rect that call was aiming for.

### Events

The container triggers two events on every change, both with the payload `{ rect, viewport }`, where `viewport` is the normalized options, or `null` after a reset:

- `CONTAINER_VIEWPORT_WILL_CHANGE` announces the target, before the styles change.
- `CONTAINER_VIEWPORT_DID_CHANGE` marks the viewport as visually applied. For an animated call it fires when the transition ends.

```javascript
const container = player.core.activeContainer

container.on(Clappr.Events.CONTAINER_VIEWPORT_DID_CHANGE, ({ rect, viewport }) => {
  console.log(rect, viewport)
})
```

### Playback#setDisplayRect

On the px strategy the container calls `playback.setDisplayRect({ x, y, width, height })` with the rect. The base `Playback` does nothing, and a playback that draws outside the DOM overrides it. See the [recipe](#place-a-native-video-plane).

## Lifecycle

- **`CORE_RESIZE`**: the viewport is recomputed from the current size of the player, never from the event payload, so it follows every resize. An unchanged rect fires no event. A container with no viewport is left alone. A reapplication adds no transition.
- **Fullscreen**: entering and leaving fullscreen resize the player, so the viewport is reapplied, and the video keeps its place in both.
- **Interruption**: a call made while an animated call is pending resolves that one with `interrupted: true` and its own target rect, without `CONTAINER_VIEWPORT_DID_CHANGE`, and the new call proceeds. A resize while an animation runs does not interrupt it: the transition is retargeted to the new rect.
- **Timeout**: an animated call settles when every property still transitioning has fired `transitionend` on the container. That includes a property left running by the call it replaced, so a same-scale move waits for `transform-origin` even after `transform` ends. If an event never arrives, the call settles `duration + 100` ms after it started, because some TV engines drop the event. A resize that retargets the animation restarts that wait. A timeout settles as completed, with `interrupted: false`.
- **From px to an animated transform**: the transition starts at the current px rect and moves from there to the new one.
- **`resetViewport`**: it brings back the full box. A pending animated call counts as an active viewport until it settles. A resize during an animated reset keeps the identity transform and fires `CONTAINER_VIEWPORT_WILL_CHANGE` when the full rect changes. The reset then reports that rect, without restarting its wait.
- **`destroy`**: destroying the container resolves a pending call with `interrupted: true`, fires no event, and clears the timer and the listeners. A later resize never reaches it.
- **`load()`**: a container created by `player.load()` starts with no viewport, even if the previous one had one.
- **First animated call**: `transform-origin` is painted before the transition, and that transition covers only `transform`. The video scales around `position` instead of sliding there from the center. A later call still transitions `transform-origin`, because a move between positions can live entirely in that property.
- **`animate` with `useTransform: false`**: it is ignored. The px strategy applies at once and the Promise resolves right away.
- **`radius`**: omitted, the call does not write `border-radius` or `overflow`. A number is the visual radius in px. The transform strategy writes `radius / fit` (`fit` is the scale actually applied after the margins), because the transform scales the curve: `radius: 16` at `scale: 0.5` is inline `32px`. The px strategy writes `radius` px. `overflow: hidden` is set only when the radius is greater than 0. `0` writes `0px` and clears that clip. A later call that omits `radius`, and `resetViewport`, remove a radius this viewport wrote. An animated transform eases `border-radius` with the same duration and easing, and the reset clears the inline style when that transition settles. A resize rewrites the compensated value with no new transition. The rect does not include the radius.
- **`resize()` and `setStyle()`**: calling them on the container while a viewport is active has no guarantee, because the next reapplication overwrites them.

## Recipes

### Shrink to a corner, animated

```javascript
const container = player.core.activeContainer

await container.setViewport({
  scale: 0.3,
  position: 'bottom-right',
  margin: 24,
  radius: 16,
  useTransform: true,
  animate: true,
  duration: 400,
  easing: 'ease-out'
})
```

Call `container.resetViewport({ animate: true })` to bring the video back with the same transition.

### Place a native video plane

A playback that draws outside the DOM learns where to draw from `setDisplayRect`:

```javascript
import { Playback } from '@clappr/core'

class NativePlanePlayback extends Playback {
  get name() {
    return 'native_plane_playback'
  }

  setDisplayRect({ x, y, width, height }) {
    // `nativePlane` is your host's own API for its video plane
    nativePlane.setRect(x, y, width, height)
  }
}
```

### Position a UI element from the viewport

```javascript
const container = player.core.activeContainer
const badge = document.querySelector('#badge')

container.on(Clappr.Events.CONTAINER_VIEWPORT_DID_CHANGE, ({ rect }) => {
  badge.style.left = `${rect.x}px`
  badge.style.top = `${rect.y + rect.height}px`
})
```
