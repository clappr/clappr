var windowImpl = window || null
var hasBeenAccessed = false

var mocks = {};
Object.defineProperty(mocks, 'window', {
  get: function()  {
    hasBeenAccessed = true
    if (!windowImpl) {
       throw new Error("Need an implementation of 'window' to run.")
    }
    return windowImpl
  },
  set: function(newWindowImpl) {
    if (hasBeenAccessed) {
       throw new Error("Cannot set window implementation after it has been accessed in the project.")
    }
    windowImpl = newWindowImpl
  },
  enumerable: true,
  configurable: false
})

module.exports = mocks;