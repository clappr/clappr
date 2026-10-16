import { copyRect, copyViewport, sameRect } from './viewport_rect'

const rect = { x: 1, y: 2, width: 3, height: 4 }

describe('viewport rect', () => {
  test('copies a rect without sharing the object', () => {
    const copy = copyRect(rect)

    copy.x = 9

    expect(copy).toEqual({ x: 9, y: 2, width: 3, height: 4 })
    expect(rect.x).toBe(1)
  })

  test.each([null, undefined])('copyRect returns %s unchanged', value => {
    expect(copyRect(value)).toBe(value)
  })

  test('copies the margin apart from the viewport', () => {
    const viewport = { scale: 0.5, margin: { top: 1, right: 2, bottom: 3, left: 4 } }
    const copy = copyViewport(viewport)

    copy.scale = 1
    copy.margin.top = 9

    expect(viewport).toEqual({ scale: 0.5, margin: { top: 1, right: 2, bottom: 3, left: 4 } })
    expect(copy.margin).not.toBe(viewport.margin)
  })

  test.each([null, undefined])('copyViewport returns %s unchanged', value => {
    expect(copyViewport(value)).toBe(value)
  })

  test('compares every edge of a rect', () => {
    expect(sameRect(rect, { ...rect })).toBe(true)
  })

  test.each(['x', 'y', 'width', 'height'])('sameRect is false when %s differs', key => {
    expect(sameRect(rect, { ...rect, [key]: rect[key] + 1 })).toBe(false)
  })
})
