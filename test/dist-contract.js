const { parse } = require('@babel/parser')

function walk(node, visit) {
  if (!node || typeof node !== 'object') return
  visit(node)
  for (const key of Object.keys(node)) {
    if (key === 'loc' || key === 'start' || key === 'end' || key === 'range' || key === 'extra') {
      continue
    }
    const child = node[key]
    if (Array.isArray(child)) {
      for (const item of child) walk(item, visit)
    } else if (child && typeof child.type === 'string') {
      walk(child, visit)
    }
  }
}

function findNativeClasses(code) {
  // No errorRecovery: a parse failure must fail the smoke test visibly.
  const ast = parse(code, {
    sourceType: 'unambiguous',
    allowReturnOutsideFunction: true
  })
  const classes = []
  walk(ast, node => {
    if (node.type === 'ClassDeclaration' || node.type === 'ClassExpression') {
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
