var $ = require('jquery');
var JST = require('./jst');

module.exports = Styler = {
  getStyleFor: function(name) {
    return $('<style></style>').html(JST.CSS[name]);
  }
}
