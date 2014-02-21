var Core = require('../spec_helper').Core;

describe('Core', function() {
  it('should receive embed parameters', function() {
    var core = new Core({width: 320, height: 240});

    core.embedParams.should.have.property("width");
    core.embedParams.should.have.property("height");
  });
});
