/* eslint-disable */

const playerElement = document.getElementById('player-wrapper');

player = new Clappr.Player({
  source: urlParams.src || 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  poster: urlParams.poster || '../i/poster.jpg',
  mute: true,
  autoPlay: false,
  height: 360,
  width: 640,
  playback: {
    controls: true,
  },
  plugins: [HlsjsPlayback],
});

player.attachTo(playerElement);
!player.options.autoPlay && player.core && player.core.activePlayback && player.core.activePlayback.el.addEventListener('play', () => player.play(), { once: true });
