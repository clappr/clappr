/* eslint-disable no-undef */
module.exports = {
  process(sourceText) {
    return {
      code: `module.exports = ${JSON.stringify(sourceText)};`
    }
  }
}
