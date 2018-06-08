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
  disableErrorScreen: true, // Disable the internal error screen plugin
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
          var o = player.options;
          o.source = s;
          player.configure(o);
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

## Another example

This example use a custom error container plugin to display error messages.

You can try the following Javascript code on [Clappr demo page](http://clappr.io/demo/) :

```javascript
var playerElement = document.getElementById("player-wrapper");

var ErrorPlugin = Clappr.ContainerPlugin.extend({
  name: 'error_plugin',
  background: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAFoBAMAAAA1HFdiAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAG1BMVEX5+fn//wAA//8A/wD/AP//AAAAAP8XFxf///8H5gWfAAAAAWJLR0QIht6VegAAAAd0SU1FB98IBRIsAXmGk48AAAI5SURBVHja7dJBDYBADADBs4AFLGABC1iohbOPhv1BMvu+NLlp10odqTN1pe7Uk5pQ8wMIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECDA/wKWxzM71T7ZZrfltNnppgACBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAL8B+ALjSfYzPnmdzgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNS0wOC0wNVQxODo0NDowMSswMTowMCL95a4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTUtMDgtMDVUMTg6NDQ6MDErMDE6MDBToF0SAAAAAElFTkSuQmCC',
  bindEvents: function() { this.listenTo(this.container, Clappr.Events.CONTAINER_ERROR, this.onError) },
  hide: function() { this._err && this._err.remove() },
  show: function() {
    var $ = Clappr.$
    this.hide();
    var txt = (this.options.errorPlugin && this.options.errorPlugin.text) ? this.options.errorPlugin.text : 'A fatal error occured.';
    this._err = $('<div>')
      .css({
        'position': 'absolute',
        'z-index': '999',
        'width': '100%',
        'height': '100%',
        'background-image': 'url(' + this.background + ')',
        'background-size': 'contain',
        'background-repeat': 'no-repeat',
        'padding-top': '15%',
        'text-align': 'center',
        'font-weight': 'bold',
        'text-shadow': '1px 1px #fff',
      })
      .append($('<h2>')
        .text(txt)
        .css({
          'font-size': '200%',
        }))
      .append($('<p>').html('Retrying in <span class="retry-counter">10</span> seconds ...')
        .css({
          'font-size': '120%',
          'margin': '15px',
        }));
    this.container && this.container.$el.prepend(this._err);
  },
  onError: function(e) {
    if (!this.container) return;
    this.show();
    this.container.getPlugin('click_to_pause').disable();
    var tid, t = 10, retry = function() {
      clearTimeout(tid);
      if (t === 0) {
        this.container.getPlugin('click_to_pause').enable();
        if (this.options.errorPlugin && this.options.errorPlugin.onRetry) {
          this.options.errorPlugin.onRetry(e);
          return;
        } else {
          this.container.stop();
          this.container.play();
          return;
        }
      }
      $('.retry-counter').text(t);
      t--;
      tid = setTimeout(retry, 1000);
    }.bind(this);
    retry();
  }
});

var player = new Clappr.Player({
  disableErrorScreen: true, // Disable the internal error screen plugin
  source: 'http://clappr.io/bad_highline.mp4',
  plugins: [ErrorPlugin],
  errorPlugin: {
    // text: 'My custom error message.',
    onRetry: function(e) {
      // simulate successful recovery
      // or decide here what to do between each retry
      player.configure({
        source: 'http://clappr.io/highline.mp4',
        autoPlay: true,
      });
    }
  },
  height: 360,
  width: 640
});

player.attachTo(playerElement);
```
