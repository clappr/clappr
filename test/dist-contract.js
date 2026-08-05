const { parse } = require('acorn')
const walk = require('acorn-walk')

function parseDist(code) {
  try {
    return parse(code, { ecmaVersion: 'latest', sourceType: 'module' })
  } catch (moduleError) {
    try {
      return parse(code, {
        ecmaVersion: 'latest',
        sourceType: 'script',
        allowReturnOutsideFunction: true
      })
    } catch {
      throw moduleError
    }
  }
}

function findNativeClasses(code) {
  const ast = parseDist(code)
  const classes = []
  walk.simple(ast, {
    ClassDeclaration(node) {
      classes.push(node)
    },
    ClassExpression(node) {
      classes.push(node)
    }
  })
  return classes
}

function expectNoNativeClasses(code) {
  expect(findNativeClasses(code).map(n => n.id?.name ?? '<anonymous>')).toEqual([])
}

function expectEs5Subclassable(Base, ctorArg) {
  function Es5Subclass(arg) {
    Base.call(this, arg)
  }
  Es5Subclass.prototype = Object.create(Base.prototype)
  Es5Subclass.prototype.constructor = Es5Subclass
  Object.setPrototypeOf(Es5Subclass, Base)

  expect(() => new Es5Subclass(ctorArg)).not.toThrow()
}

module.exports = {
  expectNoNativeClasses,
  expectEs5Subclassable
}
