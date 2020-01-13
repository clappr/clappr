const autoprefixer = require('autoprefixer')
const postcssUrl = require('postcss-url')

module.exports = {
  plugins: [
    autoprefixer,
    postcssUrl({ url: 'rebase' })
  ]
}
