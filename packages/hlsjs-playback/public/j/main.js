/* eslint-disable */

// Query String
let urlParams
(function() {
  Clappr.Log.setLevel(Clappr.Log.LEVEL_WARN)
  window.onpopstate = function () {
    let match,
      pl     = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')) },
      query  = window.location.search.substring(1)

    urlParams = {}
    while (match = search.exec(query))
      urlParams[decode(match[1])] = decode(match[2])
  }
  window.onpopstate()
})()

// Parser
const Parser = function(output) {
  this.output = output
  this.console = $('#console')
  this.context = document
};

Parser.prototype = {
  parse: function(code) {
    try {
      let old = player
      eval(code)
      old && old.destroy()
      window.player = player
      this.console.empty()
    } catch(err) {
      this.console.html(err.message)
    }
  }
};

$(document).ready(function() {
  let parser = new Parser($('#output'))
  let load = function (fn) {
    if (window.clappr.externals.length > 0) {
      let lastScript = window.clappr.externals.length
      window.clappr.externals.forEach(function (url, index) {
        let script = document.createElement('script')

        script.setAttribute('type', 'text/javascript')
        script.setAttribute('src', url)
        if (index === (lastScript - 1)) script.onload = fn
        script.onerror = function (e) { alert('we cant load ' + url + ': e' + e) }

        document.body.appendChild(script)
      })
    } else {
      fn()
    }
  }
  $('.run').click(function() {
    const code = ace.edit('editor').getSession().getValue()
    load(function () { parser.parse(code) })
  })
})

// Editor
window.onload = function() {
  const editor = ace.edit('editor')
  const session = editor.getSession()

  editor.setTheme('ace/theme/katzenmilch')
  editor.$blockScrolling = Infinity
  session.setMode('ace/mode/javascript')
  session.setTabSize(2)
  session.setUseSoftTabs(true)
  editor.commands.addCommand({
    name: 'run',
    bindKey: {mac: 'Command-Enter'},
    exec: function(editor) {
      document.querySelector('.run').click()
    },
  })
}
