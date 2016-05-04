import Player from 'components/player'
import Events from 'base/events'

describe('integration', function() {
  this.timeout(15 * 1000)

  var player

  before(function(done){
    var containerPlayer = document.createElement('div')
    containerPlayer.id = "player"
    document.body.appendChild(containerPlayer)

    player = new Player({
      source: '/base/test/fixtures/SampleVideo_360x240_1mb.mp4',
      parentId: "#player",
      events: {onReady: done}
    })
  })

  it('plays a video', function(done) {
    player.once(Events.PLAYER_PLAY, function() {
      expect(player.isPlaying()).to.be.equal(true)
      done()
    }.bind(this))

    player.play()
  })

  it('pauses a video', function(done) {
    player.once(Events.PLAYER_PAUSE, function() {
      expect(player.isPlaying()).to.be.equal(false)
      done()
    }.bind(this))
    player.once(Events.PLAYER_PLAY, function () { player.pause() }.bind(this))

    player.play()
  })
})
