const playerElement = document.getElementById("player-wrapper")

const plugins = Object.values(ClapprPlugins.Plugins)

player = new Clappr.Player({
  source: urlParams.src || 'http://clappr.io/highline.mp4',
  poster: urlParams.poster || 'http://clappr.io/poster.png',
  mute: true,
  autoPlay: true,
  height: 360,
  width: 640,
  plugins: plugins,
})

player.attachTo(playerElement)
