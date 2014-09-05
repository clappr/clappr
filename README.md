## Clappr

[![Build Status](https://drone.io/github.com/globocom/clappr/status.png)](https://drone.io/github.com/globocom/clappr/latest)
[![Dependency Status](https://gemnasium.com/globocom/clappr.svg)](https://gemnasium.com/globocom/clappr)

<img src="https://i.cloudup.com/31N4YEbFO--1200x1200.png">

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
      var player = new Clappr.Player({sources: ["http://video.globo.com/video.mp4"]});
      player.attachTo(playerElement);
    </script>
  </body>
```
