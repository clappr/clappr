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

describe('behavior freeze corpus', () => {
  const corpus = [
    {
      name: 'empty selection',
      run: () => {
        document.body.innerHTML = ''
        return { length: $('nosuch').length, html: $('nosuch').html() }
      }
    },
    {
      name: 'id selector',
      run: () => {
        document.body.innerHTML = '<div id="a">hello</div>'
        return { length: $('#a').length, html: $('#a').html(), tag: $('#a')[0].tagName }
      }
    },
    {
      name: 'class selector',
      run: () => {
        document.body.innerHTML = '<div class="x">1</div><div class="x">2</div>'
        return { length: $('.x').length, texts: $('.x').map((_, el) => el.textContent).get() }
      }
    },
    {
      name: 'html fragment single tag',
      run: () => {
        const el = $('<div class="box"/>')
        return { length: el.length, tag: el[0].tagName, className: el[0].className }
      }
    },
    {
      name: 'html fragment with children',
      run: () => {
        const el = $('<ul><li>a</li><li>b</li></ul>')
        return {
          length: el.length,
          tag: el[0].tagName,
          html: el.html(),
          liCount: el.find('li').length
        }
      }
    },
    {
      name: 'addClass removeClass',
      run: () => {
        document.body.innerHTML = '<div id="t" class="a"></div>'
        const el = $('#t').addClass('b c').removeClass('a')
        return { className: el[0].className }
      }
    },
    {
      name: 'html getter setter',
      run: () => {
        document.body.innerHTML = '<div id="t">old</div>'
        const before = $('#t').html()
        $('#t').html('<span>new</span>')
        return { before, after: $('#t').html(), childTag: $('#t').children()[0].tagName }
      }
    },
    {
      name: 'append content',
      run: () => {
        document.body.innerHTML = '<div id="t"></div>'
        $('#t').append('<i>x</i>')
        return { html: $('#t').html() }
      }
    }
  ]

  test.each(corpus)('$name', ({ run }) => {
    expect(run()).toMatchSnapshot()
  })
})
