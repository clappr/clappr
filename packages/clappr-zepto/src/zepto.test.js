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

  test('singleTagRE createElement: <div></div>', () => {
    const nodes = $('<div></div>')
    expect(nodes.length).toBe(1)
    expect(nodes[0].tagName).toBe('DIV')
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

  test('fragmentRE with comment-only fragment', () => {
    const nodes = $('<!-- c -->')
    expect(nodes.length).toBe(1)
    expect(nodes[0].nodeType).toBe(Node.COMMENT_NODE)
    expect(nodes[0].textContent).toBe(' c ')
  })

  test('fragmentRE with comment-prefixed fragment', () => {
    const nodes = $('<!--c--><div>y</div>')
    expect(nodes.length).toBe(2)
    expect(nodes[0].nodeType).toBe(Node.COMMENT_NODE)
    expect(nodes[1].tagName).toBe('DIV')
    expect(nodes[1].textContent).toBe('y')
  })

  test('fragmentRE with doctype-prefixed fragment', () => {
    const nodes = $('<!DOCTYPE html><div>z</div>')
    expect(nodes.length).toBeGreaterThanOrEqual(1)
    expect(nodes.filter('div').length).toBe(1)
    expect(nodes.filter('div')[0].textContent).toBe('z')
  })

  test('$() entry path uses fragmentRE capture for container tag', () => {
    const nodes = $('<tr><td>x</td></tr>')
    expect(nodes.length).toBe(1)
    expect(nodes[0].tagName).toBe('TR')
    expect(nodes[0].children[0].tagName).toBe('TD')
    expect(nodes[0].children[0].textContent).toBe('x')
  })

  test('fragment with attributes preserves attr values', () => {
    const nodes = $('<div id="a" class="b" data-x="1">c</div>')
    expect(nodes.length).toBe(1)
    expect(nodes[0].tagName).toBe('DIV')
    expect(nodes.attr('id')).toBe('a')
    expect(nodes.attr('class')).toBe('b')
    expect(nodes.attr('data-x')).toBe('1')
    expect(nodes.text()).toBe('c')
  })

  test('fragmentRE no-match falls through to default container', () => {
    // name = fragmentRE.test(html) && RegExp.$1 yielded false without a match;
    // exec() yields null. Both hit name = '*'.
    const nodes = $.zepto.fragment('plain text', undefined)
    expect(nodes.length).toBe(1)
    expect(nodes[0].nodeType).toBe(Node.TEXT_NODE)
    expect(nodes[0].textContent).toBe('plain text')
  })
})

describe('$.zepto.isZ', () => {
  test('detects Zepto collections only', () => {
    expect($.zepto.isZ($('<div/>'))).toBe(true)
    expect($.zepto.isZ($(document.createElement('span')))).toBe(true)
    expect($.zepto.isZ(document.createElement('div'))).toBe(false)
    expect($.zepto.isZ({})).toBe(false)
    expect($.zepto.isZ(null)).toBe(false)
  })
})

describe('html() and tagExpander paths', () => {
  test('html() setter preserves entity-encoded text', () => {
    const el = $('<div/>').html('a &amp; b &lt;c&gt;')
    expect(el.html()).toBe('a &amp; b &lt;c&gt;')
    expect(el[0].textContent).toBe('a & b <c>')
  })

  test('self-closing non-void tags expand before innerHTML', () => {
    const nodes = $('<div><p/></div>')
    expect(nodes.find('p').length).toBe(1)
    expect(nodes.find('p')[0].tagName).toBe('P')
  })

  test('self-closing tag with attributes expands', () => {
    const nodes = $('<div><span class="x"/></div>')
    expect(nodes.find('span').length).toBe(1)
    expect(nodes.find('span').attr('class')).toBe('x')
  })

  test('self-closing tag with quoted attr containing /> does not break out', () => {
    // Previously [^>]* crossed the quote and expanded at the /> inside the
    // attribute value (#111). Quote-aware expansion must leave the attr intact.
    const nodes = $('<div title="/>"/>')
    expect(nodes.length).toBe(1)
    expect(nodes[0].tagName).toBe('DIV')
    expect(nodes.attr('title')).toBe('/>')
  })

  test('unterminated quote no longer expands self-closing tag', () => {
    // Intentional divergence: lone " cannot be consumed by any branch, so the
    // expander does not match. Old [^>]* swallowed it.
    const html = '<div title="unclosed />'
    const expanded = html.replace(
      /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)(?![\w:])(?:"[^"]*"|'[^']*'|\/(?!>)|[^>"'\/])*)\/>/ig,
      '<$1></$2>'
    )
    expect(expanded).toBe(html)
  })

  test('tagExpanderRE and fragmentRE stay linear on pathological input', () => {
    const html = '<' + 'a'.repeat(50000)
    const start = Date.now()
    const nodes = $.zepto.fragment(html)
    const elapsed = Date.now() - start
    expect(elapsed).toBeLessThan(2000)
    expect($(nodes).filter('*').length).toBe(0)
  })

  test('malformed fragment still yields a collection', () => {
    const nodes = $('<div><span>unclosed')
    expect(nodes.length).toBe(1)
    expect(nodes[0].tagName).toBe('DIV')
    expect(nodes.find('span').length).toBe(1)
  })
})

describe('$.fn.load', () => {
  let originalAjax

  beforeEach(() => {
    originalAjax = $.ajax
  })

  afterEach(() => {
    $.ajax = originalAjax
  })

  test('without selector inserts the full response including script nodes', () => {
    const html = '<p>hi</p><script type="text/plain">keep</script><span>there</span>'
    $.ajax = jest.fn(options => {
      options.success(html)
      return {}
    })
    const el = $('<div/>')
    el.load('/x')
    expect(el.find('p').length).toBe(1)
    expect(el.find('span').length).toBe(1)
    expect(el.find('script').length).toBe(1)
    expect(el.text()).toContain('hi')
    expect(el.text()).toContain('there')
  })

  test('with selector inserts matches and removes script nodes structurally', () => {
    const html =
      '<div class="item">keep</div>' +
      '<script>window.__zeptoLoadSpy=1</script>' +
      '<div class="other">drop</div>' +
      '<div class="item"><script type="text/plain">nested</script>ok</div>'
    $.ajax = jest.fn(options => {
      expect(options.url).toBe('/x')
      options.success(html)
      return {}
    })
    const el = $('<div/>')
    el.load('/x .item')
    expect(el.find('.item').length).toBe(2)
    expect(el.find('.other').length).toBe(0)
    expect(el.find('script').length).toBe(0)
    expect(el.text()).toContain('keep')
    expect(el.text()).toContain('ok')
    expect(window.__zeptoLoadSpy).toBeUndefined()
  })
})

describe('$.ajaxJSONP', () => {
  let appendSpy
  let appended

  beforeEach(() => {
    appended = []
    appendSpy = jest.spyOn(document.head, 'appendChild').mockImplementation(node => {
      appended.push(node)
      return node
    })
  })

  afterEach(() => {
    appendSpy.mockRestore()
    Object.keys(window).forEach(key => {
      if (/^Zepto(TestCb)?\d*$/.test(key) || /^ZeptoTestCb\d+$/.test(key)) {
        delete window[key]
      }
    })
  })

  // Pass type so ajaxJSONP does not redirect into $.ajax (which adds a cache
  // buster and would obscure the URL rewrite under test). Direct calls also
  // skip ajaxSettings merge, so supply the callbacks ajaxBeforeSend/ajaxError use.
  function jsonpOptions(url, jsonpCallback) {
    const noop = () => {}
    return {
      type: 'GET',
      url,
      jsonpCallback,
      beforeSend: noop,
      success: noop,
      error: noop,
      complete: noop,
      global: false
    }
  }

  test('rewrites ?a=1&callback=? with the generated callback name', () => {
    $.ajaxJSONP(
      jsonpOptions('https://example.com/api?a=1&callback=?', 'ZeptoTestCb1')
    )
    expect(appended.length).toBe(1)
    expect(appended[0].src).toBe(
      'https://example.com/api?a=1&callback=ZeptoTestCb1'
    )
  })

  test('with two =? placeholders rewrites the last match', () => {
    $.ajaxJSONP(
      jsonpOptions('https://example.com/api?x=?&callback=?', 'ZeptoTestCb2')
    )
    expect(appended[0].src).toBe(
      'https://example.com/api?x=?&callback=ZeptoTestCb2'
    )
  })

  test('without =? leaves the url unchanged', () => {
    $.ajaxJSONP(
      jsonpOptions('https://example.com/api?callback=fixed', 'ZeptoTestCb3')
    )
    expect(appended.length).toBe(1)
    expect(appended[0].src).toBe('https://example.com/api?callback=fixed')
  })

  test('requires at least one character between ? and =?', () => {
    // Original /\?(.+)=\?/ needed `.+`; `i > q + 1` preserves that.
    $.ajaxJSONP(jsonpOptions('https://example.com/api?=?', 'ZeptoTestCb4'))
    expect(appended[0].src).toBe('https://example.com/api?=?')
  })
})
