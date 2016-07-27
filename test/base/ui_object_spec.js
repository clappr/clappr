import UIObject from '../../src/base/ui_object'
import  $ from 'clappr-zepto'

describe('UIObject', function() {
  beforeEach(function(){
    this.uiObject = new UIObject()
  })

  it('is a div tag by default', function(){
    expect(this.uiObject.tagName).to.be.equal('div')
  })

  it('can be any tag', function(){
    class MyButton extends UIObject { get tagName() { return 'button' } }
    const myButton = new MyButton()
    expect(myButton.tagName).to.be.equal('button')
  })

  it('has an unique id', function(){
    const uiObjectA = new UIObject()
    const uiObjectB = new UIObject()
    expect(uiObjectA.cid).to.be.not.equal(uiObjectB.cid)
  })

  it('creates element for a given ui component', function(){
    const component = $('<div></div>')
    expect(this.uiObject.el).to.be.not.equal(component[0])
    expect(this.uiObject.$el).to.be.not.equal(component)
  })

  it('can set element', function(){
    const element = $('<section></section>')
    this.uiObject.setElement(element)

    expect(this.uiObject.el).to.be.equal(element[0])
    expect(this.uiObject.$el).to.be.equal(element)
  })

  it('creates an element with attributes', function() {
    class MyButton extends UIObject {
      constructor(options) { super(options) }
      get attributes() { return { class: 'my-button'} }
    }

    const myButton = new MyButton()

    expect(myButton.el.className).to.be.equal('my-button')
  })

  it('binds events of an element to methods', function(){
    class MyButton extends UIObject {
      constructor(options) {
        super(options)
        this.myId = 0
      }
      get events() { return { 'click': 'myClick' } }
      myClick(){ this.myId = 42 }
    }

    const myButton = new MyButton()

    expect(myButton.myId).to.be.equal(0)

    myButton.$el.trigger('click')

    expect(myButton.myId).to.be.equal(42)
  })

  it('selects elements within the component', function(){
    const insideComponent = $('<p id="special-id">here</p>')[0]
    class MySpecialButton extends UIObject {
      constructor(options) {
        super(options)
      }
      render() { this.$el.append(insideComponent) }
    }

    const myButton = new MySpecialButton()
    myButton.render()

    expect(myButton.$('#special-id')[0]).to.be.equal(insideComponent)
  })

  it('removes it from DOM', function(){
    class FullscreenButton extends UIObject {
      constructor(options) {
        super(options)
      }
      get attributes() { return { id: 'my-0-button'} }
    }

    const myButton = new FullscreenButton()
    $(document.body).append(myButton.$el)

    expect($('#my-0-button').length).to.be.equal(1)

    myButton.remove()

    expect($('#my-0-button').length).to.be.equal(0)
  })

  it('stops listening', function(){
    class FullscreenButton extends UIObject {
      constructor(options) {
        super(options)
        this.myId = 0
      }
      get events() { return { 'click': 'myClick' } }
      myClick(){ this.myId += 1 }
    }

    const myButton = new FullscreenButton()

    myButton.$el.trigger('click')
    expect(myButton.myId).to.be.equal(1)

    myButton.remove()
    myButton.$el.trigger('click')
    myButton.$el.trigger('click')

    expect(myButton.myId).to.be.equal(1)
  })
})
