/* eslint-disable no-undef */
const htmlLoader = require('html-loader')

module.exports = {
  process(src) {
    return htmlLoader(src)
  },
}