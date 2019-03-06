# Events API

You can listen to several [events from Clappr](http://clappr.github.io/classes/Events.html).

```javascript
// You can either listen to events fired from the player layer this way
var player = new Clappr.Player({
  events: {
    onReady: function() { ... }, //Fired when the player is ready on startup
    onResize: function() { ... },//Fired when player resizes
    onPlay: function() { ... },//Fired when player starts to play
    onPause: function() { ... },//Fired when player pauses
    onStop: function() { ... },//Fired when player stops
    onEnded: function() { ... },//Fired when player ends the video
    onSeek: function() { ... },//Fired when player seeks the video
    onError: function() { ... },//Fired when player receives an error
    onTimeUpdate: function() { ... },//Fired when the time is updated on player
    onVolumeUpdate: function() { ... },//Fired when player updates its volume
  }
})
// or this way
player.on(Clappr.Events.PLAYER_PLAY, function() { ... })
```

If you want to listen for events from other layers, you need to add the bind for the specific scope.

For example, the `CONTAINER_STATE_BUFFERING` event is triggered by the container, so if you want to listen for events from the container layer on your code, here is how:

```javascript
player.core.activeContainer.on(Clappr.Events.CONTAINER_STATE_BUFFERING, function() { ... })
```
