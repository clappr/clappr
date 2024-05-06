var playerElement = document.getElementById("player-wrapper");

player = new Clappr.Player({
  source: urlParams.src || 'http://clappr.io/highline.mp4',
  poster: urlParams.poster || 'http://clappr.io/poster.png',
  mute: true,
  autoPlay: true,
  height: 360,
  width: 640,
  playback: {
    controls: true,
  },
});

player.attachTo(playerElement);
