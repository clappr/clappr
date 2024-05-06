window.clappr = window.clappr || {}
window.clappr.externals = []

function addExternal() {
  var url = document.getElementById('js-link')
  window.clappr.externals.push(url.value)
  addTag(url.value)
  url.value = ''
}

function addTag(url) {
  var colors = ["aliceblue", "antiquewhite", "azure", "black", "blue", "brown", "yellow", "teal"]
  var color = colors[Math.floor(Math.random() * colors.length)]
  var span = document.createElement('span')

  span.style.backgroundColor = color
  span.className = "external-js"
  span.innerText = url.split(/\//).pop().split(/\./)[0]

  document.getElementById('external-js-panel').appendChild(span)
}
