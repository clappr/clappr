import $ from './zepto'

describe('window globals', () => {
  test('sets window.Zepto and window.$ after import', () => {
    expect(window.Zepto).toBe($)
    expect(window.$).toBe($)
  })
})

describe('RegExp.$1 fragment sites', () => {
  test('singleTagRE createElement: <div/>', () => {
    const nodes = $('<div/>')
    expect(nodes.length).toBe(1)
    expect(nodes[0].tagName).toBe('DIV')
    expect(nodes[0].childNodes.length).toBe(0)
  })

  test('singleTagRE createElement: <p></p>', () => {
    const nodes = $('<p></p>')
    expect(nodes.length).toBe(1)
    expect(nodes[0].tagName).toBe('P')
  })

  test('fragmentRE tag name: <li>a</li><li>b</li>', () => {
    const nodes = $('<li>a</li><li>b</li>')
    expect(nodes.length).toBe(2)
    expect(nodes[0].tagName).toBe('LI')
    expect(nodes[0].textContent).toBe('a')
    expect(nodes[1].tagName).toBe('LI')
    expect(nodes[1].textContent).toBe('b')
  })

  test('fragmentRE with leading whitespace', () => {
    const nodes = $('  <span>x</span>')
    expect(nodes.length).toBe(1)
    expect(nodes[0].tagName).toBe('SPAN')
    expect(nodes[0].textContent).toBe('x')
  })

  test('fragmentRE with comment-prefixed fragment', () => {
    const nodes = $('<!--c--><div>y</div>')
    expect(nodes.length).toBe(2)
    expect(nodes[0].nodeType).toBe(Node.COMMENT_NODE)
    expect(nodes[1].tagName).toBe('DIV')
    expect(nodes[1].textContent).toBe('y')
  })

  test('$() entry path uses fragmentRE capture for container tag', () => {
    const nodes = $('<tr><td>cell</td></tr>')
    expect(nodes.length).toBe(1)
    expect(nodes[0].tagName).toBe('TR')
    expect(nodes[0].children[0].tagName).toBe('TD')
  })
})
