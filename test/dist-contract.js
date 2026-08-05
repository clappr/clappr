const NATIVE_CLASS_PATTERN = /class [A-Za-z_$]+ extends/

function stripBlockComments(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, '')
}

function expectNoNativeClasses(code) {
  expect(stripBlockComments(code)).not.toMatch(NATIVE_CLASS_PATTERN)
}

function expectEs5Subclassable(Base, options = {}) {
  function Es5Subclass(opts) {
    Base.call(this, opts)
  }
  Es5Subclass.prototype = Object.create(Base.prototype)
  Es5Subclass.prototype.constructor = Es5Subclass
  Object.setPrototypeOf(Es5Subclass, Base)

  expect(() => new Es5Subclass(options)).not.toThrow()
}

module.exports = {
  expectNoNativeClasses,
  expectEs5Subclassable
}
