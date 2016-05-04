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
    player.on(Events.PLAYER_PLAY, () => {
      expect(player.isPlaying()).to.be.equal(true)
      done()
    })

    player.play()
  })

  it('pauses a video', function(done) {
    player.on(Events.PLAYER_TIMEUPDATE, () => {
      expect(player.isPlaying()).to.be.equal(false)
      done()
    })

    if (!player.isPlaying()) {player.play()}

    player.pause()
  })

})
