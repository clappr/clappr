import { computeGeometry, transformForRect } from './viewport_geometry'

const SIZE = { width: 1280, height: 720 }

const margin = (top, right = top, bottom = top, left = right) => ({ top, right, bottom, left })

const place = ({ scale = 1, position = 'center', margin: edges = margin(0) } = {}, size = SIZE) =>
  computeGeometry({ scale, position, margin: edges }, size)

describe('computeGeometry', () => {
  test.each([
    [
      'top-left',
      '0% 0%',
      'translate(20px, 20px) scale(0.5)',
      { x: 20, y: 20, width: 640, height: 360 }
    ],
    [
      'top-center',
      '50% 0%',
      'translate(0px, 20px) scale(0.5)',
      { x: 320, y: 20, width: 640, height: 360 }
    ],
    [
      'top-right',
      '100% 0%',
      'translate(-20px, 20px) scale(0.5)',
      { x: 620, y: 20, width: 640, height: 360 }
    ],
    [
      'center-left',
      '0% 50%',
      'translate(20px, 0px) scale(0.5)',
      { x: 20, y: 180, width: 640, height: 360 }
    ],
    [
      'center',
      '50% 50%',
      'translate(0px, 0px) scale(0.5)',
      { x: 320, y: 180, width: 640, height: 360 }
    ],
    [
      'center-right',
      '100% 50%',
      'translate(-20px, 0px) scale(0.5)',
      { x: 620, y: 180, width: 640, height: 360 }
    ],
    [
      'bottom-left',
      '0% 100%',
      'translate(20px, -20px) scale(0.5)',
      { x: 20, y: 340, width: 640, height: 360 }
    ],
    [
      'bottom-center',
      '50% 100%',
      'translate(0px, -20px) scale(0.5)',
      { x: 320, y: 340, width: 640, height: 360 }
    ],
    [
      'bottom-right',
      '100% 100%',
      'translate(-20px, -20px) scale(0.5)',
      { x: 620, y: 340, width: 640, height: 360 }
    ]
  ])('places %s', (position, origin, transform, rect) => {
    expect(place({ scale: 0.5, position, margin: margin(20) })).toEqual({
      rect,
      transform,
      origin,
      fit: 0.5
    })
    expect(transformForRect(rect, SIZE, position)).toBe(transform)
  })

  test('shifts toward the larger margin', () => {
    expect(place({ scale: 0.5, margin: { top: 0, right: 0, bottom: 0, left: 40 } })).toEqual({
      rect: { x: 340, y: 180, width: 640, height: 360 },
      transform: 'translate(20px, 0px) scale(0.5)',
      origin: '50% 50%',
      fit: 0.5
    })
  })

  test.each([
    [
      'the margin box',
      { position: 'top-left', margin: { top: 0, right: 320, bottom: 180, left: 0 } },
      {
        rect: { x: 0, y: 0, width: 960, height: 540 },
        transform: 'translate(0px, 0px) scale(0.75)',
        origin: '0% 0%',
        fit: 0.75
      }
    ],
    [
      'an even margin',
      { margin: margin(100) },
      {
        rect: { x: 178, y: 100, width: 924, height: 520 },
        transform: 'translate(0px, 0px) scale(0.7222222222222222)',
        origin: '50% 50%',
        fit: 0.7222222222222222
      }
    ],
    [
      'the width of the margin box',
      { margin: margin(0, 200) },
      {
        rect: { x: 200, y: 113, width: 880, height: 495 },
        transform: 'translate(0px, 0px) scale(0.6875)',
        origin: '50% 50%',
        fit: 0.6875
      }
    ],
    [
      'a margin larger than the parent',
      { margin: margin(700) },
      {
        rect: { x: 640, y: 360, width: 0, height: 0 },
        transform: 'translate(0px, 0px) scale(0)',
        origin: '50% 50%',
        fit: 0
      }
    ]
  ])('clamps the fit to %s', (_, options, geometry) => {
    expect(place(options)).toEqual(geometry)
  })

  test('keeps an unrounded scale in the transform', () => {
    expect(place({ scale: 0.333, position: 'bottom-right', margin: margin(10) })).toEqual({
      rect: { x: 844, y: 470, width: 426, height: 240 },
      transform: 'translate(-10px, -10px) scale(0.333)',
      origin: '100% 100%',
      fit: 0.333
    })
  })

  test('returns a zero rect when the parent has no size', () => {
    expect(place({}, { width: 0, height: 0 })).toEqual({
      rect: { x: 0, y: 0, width: 0, height: 0 },
      transform: 'translate(0px, 0px) scale(0)',
      origin: '50% 50%',
      fit: 0
    })
  })
})
