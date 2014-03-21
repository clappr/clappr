## Player 3

[![Build Status](https://drone.io/github.com/globocom/player/status.png?a)](https://drone.io/github.com/globocom/player/latest)
[![Dependency Status](https://gemnasium.com/globocom/player.png)](https://gemnasium.com/globocom/player)


### Installing for development

Clone the project and install gulp:

`npm install -g gulp`

Then enter the project directory and install the dependencies:

`npm install`


### Embedding the player

Put this on your HTML:

```html
  <body>
    <div id="player-wrapper"></div>
    <script>
      var playerElement = document.getElementById("player-wrapper");
      var player = new WP3.Player({sources: ["http://video.globo.com/video.mp4"]});
      player.attachTo(playerElement);
    </script>
  </body>
```
