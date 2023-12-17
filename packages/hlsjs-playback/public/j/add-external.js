/* eslint-disable */

window.clappr = window.clappr || {}
window.clappr.externals = []

function addExternal() {
  let url = document.getElementById('js-link')
  window.clappr.externals.push(url.value)
  addTag(url.value)
  url.value = ''
}

function addTag(url) {
  let colors = ['aliceblue', 'antiquewhite', 'azure', 'black', 'blue', 'brown', 'yellow', 'teal']
  let color = colors[Math.floor(Math.random() * colors.length)]
  let span = document.createElement('span')

  span.style.backgroundColor = color
  span.className = 'external-js'
  span.innerText = url.split(/\//).pop().split(/\./)[0]

  document.getElementById('external-js-panel').appendChild(span)
}
