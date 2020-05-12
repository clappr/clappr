import UIObject from './ui_object'
import  $ from 'clappr-zepto'

describe('UIObject', function() {
  test('is a div tag by default', function() {
    const uiObject = new UIObject()
    expect(uiObject.tagName).toEqual('div')
  })

  test('can be any tag', function() {
    class MyButton extends UIObject { get tagName() { return 'button' } }
    const myButton = new MyButton()
    expect(myButton.tagName).toEqual('button')
  })

  test('has an unique id', function() {
    const uiObjectA = new UIObject()
    const uiObjectB = new UIObject()
    expect(uiObjectA.cid).not.toEqual(uiObjectB.cid)
  })

  test('creates element for a given ui component', function() {
    const uiObject = new UIObject()
    const component = $('<div></div>')
    expect(uiObject.el).toEqual(component[0])
    expect(uiObject.$el).toEqual(component)
  })

  test('can set element', function() {
    const uiObject = new UIObject()
    const element = $('<section></section>')
    uiObject.setElement(element)

    expect(uiObject.el).toEqual(element[0])
    expect(uiObject.$el).toEqual(element)
  })

  test('creates an element with attributes', function() {
    class MyButton extends UIObject {
      constructor(options) { super(options) }
      get attributes() { return { class: 'my-button' } }
    }

    const myButton = new MyButton()

    expect(myButton.el.className).toEqual('my-button')
  })

  test('binds events of an element to methods', function() {
    class MyButton extends UIObject {
      constructor(options) {
        super(options)
        this.myId = 0
      }
      get events() { return { 'click': 'myClick' } }
      myClick() { this.myId = 42 }
    }

    const myButton = new MyButton()

    expect(myButton.myId).toEqual(0)

    myButton.$el.trigger('click')

    expect(myButton.myId).toEqual(42)
  })

  test('selects elements within the component', function() {
    const insideComponent = $('<p id="special-id">here</p>')[0]
    class MySpecialButton extends UIObject {
      constructor(options) {
        super(options)
      }
      render() { this.$el.append(insideComponent) }
    }

    const myButton = new MySpecialButton()
    myButton.render()

    expect(myButton.$('#special-id')[0]).toEqual(insideComponent)
  })

  test('removes it from DOM', function() {
    class FullscreenButton extends UIObject {
      constructor(options) {
        super(options)
      }
      get attributes() { return { id: 'my-0-button' } }
    }

    const myButton = new FullscreenButton()
    $(document.body).append(myButton.$el)

    expect($('#my-0-button').length).toEqual(1)

    myButton.destroy()

    expect($('#my-0-button').length).toEqual(0)
  })

  test('stops listening', function() {
    class FullscreenButton extends UIObject {
      constructor(options) {
        super(options)
        this.myId = 0
      }
      get events() { return { 'click': 'myClick' } }
      myClick() { this.myId += 1 }
    }

    const myButton = new FullscreenButton()

    myButton.$el.trigger('click')
    expect(myButton.myId).toEqual(1)

    myButton.destroy()
    myButton.$el.trigger('click')
    myButton.$el.trigger('click')

    expect(myButton.myId).toEqual(1)
  })
})
