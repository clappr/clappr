var Events = require('events')

describe('Events', function(){
  beforeEach(function(){
    this.events = new Events();
  });

  it('subs to a given event', function(){
    var counter = 0;
    var sumCounter = () => {
      counter += 1;
    };

    this.events.on("clappr.any.event", sumCounter)
    expect(counter).to.be.equal(0)

    this.events.trigger("clappr.any.event")
    expect(counter).to.be.equal(1)
  });
});
