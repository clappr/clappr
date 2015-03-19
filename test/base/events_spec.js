var Events = require('events')

describe('Events', function(){
  beforeEach(function(){
    this.events = new Events()
  })

  it('subs to a given event', function(){
    var counter = 0
    var sumCounter = function() {
      counter += 1
    }

    this.events.on("clappr.any.event", sumCounter)
    expect(counter).to.be.equal(0)

    this.events.trigger("clappr.any.event")
    expect(counter).to.be.equal(1)
  })

  it('subs to a list of events separated by spaces', function(){
    var counter = 0
    var sumCounter = function() {
      counter += 1
    }

    this.events.on("clappr.any.event clappr.my.event", sumCounter)
    expect(counter).to.be.equal(0)

    this.events.trigger("clappr.my.event")
    expect(counter).to.be.equal(1)
  })

  it('subs to a given event using an object', function(){
    var counter = 0

    this.events.on({"clappr.any.event": function(){ counter += 1  }})
    expect(counter).to.be.equal(0)

    this.events.trigger("clappr.any.event")
    expect(counter).to.be.equal(1)
  })

  it('subs to a given event with context', function(){
    var ctx = { counter: 9 }
    var sumCounter = function() {
      this.counter += 1
    }

    this.events.on("clappr.any.event", sumCounter, ctx)
    expect(ctx.counter).to.be.equal(9)

    this.events.trigger("clappr.any.event")
    expect(ctx.counter).to.be.equal(10)
  })

  it('can unsub an event', function(){
    var counter = 0
    var sumCounter = function() {
      counter += 1
    }

    this.events.on("clappr.any.event", sumCounter)
    expect(counter).to.be.equal(0)
    this.events.off("clappr.any.event")

    this.events.trigger("clappr.any.event")
    expect(counter).to.be.equal(0)
  })

  it('can trigger multiple times', function(){
    var counter = 1
    var sumCounter = function() {
      counter += 1
    }

    this.events.on("clappr.any.event", sumCounter)
    expect(counter).to.be.equal(1)

    this.events.trigger("clappr.any.event")
    this.events.trigger("clappr.any.event")
    expect(counter).to.be.equal(3)
  })

  it('restricts to trigger only once', function(){
    var counter = 1
    var sumCounter = function() {
      counter += 1
    }

    this.events.once("clappr.any.event", sumCounter)
    expect(counter).to.be.equal(1)

    this.events.trigger("clappr.any.event")
    this.events.trigger("clappr.any.event")
    expect(counter).to.be.equal(2)
  })

  it('permist to listen events in other objects', function(){
    var counter = 0
    var sumCounter = function() {
      counter += 1
    }
    var myEvents = new Events()
    var myCounter = function() {
      counter += 2
    }

    this.events.on("clappr.any.event", sumCounter)
    myEvents.listenTo(this.events, "clappr.any.event", myCounter)

    expect(counter).to.be.equal(0)

    this.events.trigger("clappr.any.event")
    expect(counter).to.be.equal(3)
  })

  it('permist to listen once events in other objects', function(){
    var counter = 0
    var sumCounter = function() {
      counter += 1
    }
    var myEvents = new Events()
    var myCounter = function() {
      counter += 1
    }

    this.events.on("clappr.any.event", sumCounter)
    myEvents.listenToOnce(this.events, "clappr.any.event", myCounter)

    expect(counter).to.be.equal(0)

    this.events.trigger("clappr.any.event")
    this.events.trigger("clappr.any.event")
    expect(counter).to.be.equal(3)
  })

  it('permist to stop listening events in other objects', function(){
    var counter = 0
    var sumCounter = function() {
      counter += 1
    }
    var myEvents = new Events()
    var myCounter = function() {
      counter += 2
    }

    this.events.on("clappr.any.event", sumCounter)
    myEvents.listenTo(this.events, "clappr.any.event", myCounter)

    expect(counter).to.be.equal(0)

    myEvents.stopListening(this.events, "clappr.any.event", myCounter)
    this.events.trigger("clappr.any.event")
    expect(counter).to.be.equal(1)
  })
})
