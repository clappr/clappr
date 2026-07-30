import Clappr, { $ as named$ } from './main'

describe('Clappr.$', () => {
  test('re-exports the Zepto collection constructor', () => {
    expect(Clappr.$).toBe(named$)
    expect(typeof Clappr.$).toBe('function')
  })

  test('parses single-tag and multi-node fragments', () => {
    const single = Clappr.$('<div/>')
    expect(single.length).toBe(1)
    expect(single[0].tagName).toBe('DIV')

    const rows = Clappr.$('<tr><td>x</td></tr>')
    expect(rows.length).toBe(1)
    expect(rows[0].tagName).toBe('TR')
    expect(rows[0].children[0].textContent).toBe('x')
  })

  test('expands self-closing non-void tags without breaking quoted attrs', () => {
    const nested = Clappr.$('<div><p class="x"/></div>')
    expect(nested.find('p').length).toBe(1)
    expect(nested.find('p').attr('class')).toBe('x')

    const quoted = Clappr.$('<div title="/>"/>')
    expect(quoted.attr('title')).toBe('/>')
  })

  test('comment and doctype-prefixed fragments still produce nodes', () => {
    const commented = Clappr.$('<!-- c --><span>y</span>')
    expect(commented.length).toBe(2)
    expect(commented[0].nodeType).toBe(Node.COMMENT_NODE)
    expect(commented.filter('span').text()).toBe('y')

    const withDoctype = Clappr.$('<!DOCTYPE html><div>z</div>')
    expect(withDoctype.filter('div').text()).toBe('z')
  })
})
