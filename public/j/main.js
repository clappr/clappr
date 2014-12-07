var Parser = function(output) {
  this.output = output;
  this.console = $("#console");
  this.context = document;
};

Parser.prototype = {
  parse: function(code) {
    try {
      var old = player;
      eval(code);
      old.destroy();
      window.player = player;
      this.console.empty();
    } catch(err) {
      this.console.html(err.message);
    }
  }
};
window.onload = function() {
  var parser = new Parser($('#output'));
  $('.run').click(function() {
    var code = ace.edit('editor').getSession().getValue();
    parser.parse(code);
  });
}
