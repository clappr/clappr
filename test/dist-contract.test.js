const { expectEs5Syntax } = require('./dist-contract')

const LABEL = 'artifact.js'

function expectRejection(code, form) {
  expect(() => expectEs5Syntax(code, LABEL)).toThrow(`${LABEL} contains ${form}`)
}

describe('expectEs5Syntax', () => {
  describe('class', () => {
    it('accepts ES5 without class', () => {
      expect(() => expectEs5Syntax('function Foo() {}', LABEL)).not.toThrow()
    })

    it('rejects class and names the form and artifact', () => {
      expectRejection('class Foo {}', 'class')
    })
  })

  describe('arrow', () => {
    it('accepts ES5 without arrow', () => {
      expect(() => expectEs5Syntax('var f = function () { return 1 }', LABEL)).not.toThrow()
    })

    it('rejects arrow and names the form and artifact', () => {
      expectRejection('var f = function () { return 1 }; var g = () => 1', 'arrow')
    })
  })

  describe('const', () => {
    it('accepts ES5 without const', () => {
      expect(() => expectEs5Syntax('var x = 1', LABEL)).not.toThrow()
    })

    it('rejects const and names the form and artifact', () => {
      expectRejection('var y = 1; const x = 1', 'const')
    })
  })

  describe('let', () => {
    it('accepts ES5 without let', () => {
      expect(() => expectEs5Syntax('var x = 1', LABEL)).not.toThrow()
    })

    it('rejects let and names the form and artifact', () => {
      expectRejection('var y = 1; let x = 1', 'let')
    })
  })

  describe('template literal', () => {
    it('accepts ES5 without template literal', () => {
      expect(() => expectEs5Syntax('var t = "hello"', LABEL)).not.toThrow()
    })

    it('rejects template literal and names the form and artifact', () => {
      expectRejection('var t = "hello"; var u = `world`', 'template literal')
    })
  })

  describe('shorthand', () => {
    it('accepts ES5 without shorthand', () => {
      expect(() => expectEs5Syntax('var a = 1; var o = { a: a }', LABEL)).not.toThrow()
    })

    it('rejects shorthand and names the form and artifact', () => {
      expectRejection('var a = 1; var o = { a: a }; var p = { a }', 'shorthand')
    })
  })

  describe('default param', () => {
    it('accepts ES5 without default param', () => {
      expect(() => expectEs5Syntax('function f(a) { return a }', LABEL)).not.toThrow()
    })

    it('rejects default param and names the form and artifact', () => {
      expectRejection('function f(a) { return a }; function g(a = 1) { return a }', 'default param')
    })
  })

  describe('rest param', () => {
    it('accepts ES5 without rest param', () => {
      expect(() => expectEs5Syntax('function f(a) { return a }', LABEL)).not.toThrow()
    })

    it('rejects rest param and names the form and artifact', () => {
      expectRejection('function f(a) { return a }; function h() {}; function g(...a) { return a }', 'rest param')
    })
  })
})
