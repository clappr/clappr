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
      old && old.destroy();
      window.player = player;
      this.console.empty();
    } catch(err) {
      this.console.html(err.message);
    }
  }
};
