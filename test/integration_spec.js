import Player from 'components/player'
import Events from 'base/events'

describe('integration', function() {
  var player

  before(function(done){

    var containerPlayer = document.createElement('div')
    containerPlayer.id = "player"
    document.body.appendChild(containerPlayer)

    player = new Player({
      source: '//www.sample-videos.com/video/mp4/240/big_buck_bunny_240p_5mb.mp4',
      parentId: "#player",
      events: {onReady: done}
    })
  })

  it('plays a video', function() {
    player.play()

    expect(player.isPlaying()).to.be.equal(true)
  })

  it('pauses a video', function() {
    player.pause()

    expect(player.isPlaying()).to.be.equal(false)
  })

})
