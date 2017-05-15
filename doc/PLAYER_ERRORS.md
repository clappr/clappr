# Player errors

Player fatal errors can be handled using `onError` [API event](API_EVENTS.md).

```javascript
var player = new Clappr.Player({
  parent: '#myplayer',
  source: 'http://path.to/my/video.mp4',
  events: {
    onError: function(e) {
      // Here the code to handle the error
    }
  }
});
```

Note: the type of error event object depends on the type of the [playback component](../src/playbacks) resolved to play the video.

## Example

This is a simple example using the `no_op` playback to display error messages.

You can try the following Javascript code on [Clappr demo page](http://clappr.io/demo/) :

```javascript
var playerElement = document.getElementById("player-wrapper");

var r = 3; // Retry attempts

var player = new Clappr.Player({
  // source: 'http://clappr.io/highline.mp4',
  source: 'http://clappr.io/bad_highline.mp4',
  height: 360,
  width: 640,
  events: {
    onError: function(e) {
      r--;
      var s = player.options.source;
      // Replace previous line by the following line to simulate successful recovery
      // var s = (r > 2) ? player.options.source : 'http://clappr.io/highline.mp4';
      var t = 10;
      var retry = function() {
        if (t === 0) {
          player.configure({source: s});
          return;
        }
        Clappr.$('#retryCounter').text(t);
        t--;
        setTimeout(retry, 1000);
      };
      player.configure({
        autoPlay: true,
        source: 'playback.error',
        playbackNotSupportedMessage: 'Network fatal error.' + ((r > 0)
            ? ' Retrying in <span id="retryCounter"></span> seconds ...'
            : ' All retry attempts failed'),
      });
      if (r > 0) {
        retry();
      }
    }
  }
});

player.attachTo(playerElement);
```
