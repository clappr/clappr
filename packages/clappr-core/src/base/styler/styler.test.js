import Styler from './styler'

const TEST_STYLE = '#wp3-player-0 { .test { video { object-fit: cover; } } }'

describe('Styler', () => {
  test('generates a style HTML tag with received css', () => {
    const style = Styler.getStyleFor(TEST_STYLE)

    expect(style[0].innerHTML).toEqual(TEST_STYLE)
  })
})
