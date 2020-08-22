import UIObject from './ui_object'
import  $ from 'clappr-zepto'

describe('UIObject', () => {
  test('is a div tag by default', () => {
    const uiObject = new UIObject()
    expect(uiObject.tagName).toEqual('div')
  })

  test('render method returns the component itself by default', () => {
    const uiObject = new UIObject()

    expect(uiObject.render()).toEqual(uiObject)
  })

  test('can be any tag', () => {
    class MyButton extends UIObject { get tagName() { return 'button' } }
    const myButton = new MyButton()
    expect(myButton.tagName).toEqual('button')
  })

  test('has an unique id', () => {
    const uiObjectA = new UIObject()
    const uiObjectB = new UIObject()
    expect(uiObjectA.cid).not.toEqual(uiObjectB.cid)
  })

  test('creates element for a given ui component', () => {
    const uiObject = new UIObject()
    const component = $('<div></div>')
    expect(uiObject.el).toEqual(component[0])
    expect(uiObject.$el).toEqual(component)
  })

  test('can set element', () => {
    const uiObject = new UIObject()
    const element = $('<section></section>')
    uiObject.setElement(element)

    expect(uiObject.el).toEqual(element[0])
    expect(uiObject.$el).toEqual(element)
  })

  test('creates an element with attributes', () => {
    class MyButton extends UIObject {
      constructor(options) { super(options) }
      get attributes() { return { class: 'my-button' } }
    }

    const myButton = new MyButton()

    expect(myButton.el.className).toEqual('my-button')
  })

  test('creates an element with only id/className attributes', () => {
    class MyButton extends UIObject {
      constructor(options) { super(options) }
      get id() { return 'id-example' }
      get className() { return 'class__example' }
    }

    const myButton = new MyButton()

    expect(myButton.el.id).toEqual('id-example')
    expect(myButton.el.className).toEqual('class__example')
  })

  test('binds events of an element to methods', () => {
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

  test('can bind events dynamically', () => {
    class MyButton extends UIObject {
      constructor(options) {
        super(options)
        this.myId = 0
      }
      myClick() { this.myId = 42 }
    }

    const myButton = new MyButton()

    myButton.delegateEvents({ 'click': 'myClick' })

    expect(myButton.myId).toEqual(0)

    myButton.$el.trigger('click')

    expect(myButton.myId).toEqual(42)
  })

  test('binds events of an element with specific selectors to methods', () => {
    class MyButton extends UIObject { myClick() {} }
    const myButton = new MyButton()
    jest.spyOn(myButton, 'myClick')

    myButton.$el.append($('<div class="class__example" data-example="example"></div>'))
    const $specificSelector = myButton.$('.class__example[data-example]')

    myButton.delegateEvents({ 'click .class__example[data-example]': 'myClick' })

    myButton.$el.trigger('click')
    $specificSelector.trigger('click')

    expect(myButton.myClick).toHaveBeenCalledTimes(1)
  })

  test('only bind events whit correct dictionary { event: callback } input', () => {
    class MyButton extends UIObject { myClick() {} }
    const myButton = new MyButton()
    jest.spyOn(myButton, 'myClick')

    myButton.delegateEvents({ 'click': null })
    myButton.delegateEvents({ 'click': 'test' })
    myButton.delegateEvents({ 'click': 'myClick' })

    myButton.$el.trigger('click')

    expect(myButton.myClick).toHaveBeenCalledTimes(1)
  })

  test('selects elements within the component', () => {
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

  test('uses the existent element if _ensureElement method is called after one component is created', () => {
    class MyButton extends UIObject { get tagName() { return 'button' } }
    const myButton = new MyButton()
    const component = $('<button></button>')

    expect(myButton.el).toEqual(component[0])
    expect(myButton.$el).toEqual(component)

    myButton._ensureElement()

    expect(myButton.el).toEqual(component[0])
    expect(myButton.$el).toEqual(component)
  })

  test('removes it from DOM', () => {
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

  test('stops listening', () => {
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
