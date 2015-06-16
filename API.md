<div align=center>
<img src="https://cloud.githubusercontent.com/assets/244265/6373134/a845eb50-bce7-11e4-80f2-592ba29972ab.png">
</div>
## Player API

Create an instance:

```javascript
var player = new Clappr.Player({source: "http://your.video/here.mp4", parentId: "#player"});
```

## <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.attachTo(element);

You can use this method to attach the player to a given `element`. You don't need to do this when you specify it during the player instantiation passing the `parentId` param.

## <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.play();

Plays the current source.


## <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.pause();

Pauses the current source.

## <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.stop();
Stops the current source.

## <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.seek(value);
The `value` should be a number between 0 and 100. For example, `player.seek(50)` will seek to the middle of the current source.

## <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.setVolume(value);
The `value` should be a number between 0 and 100, 0 being mute and 100 the max volume.

## <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.mute();
Mute the current source.

## <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.unmute();
Unmute the current source.

## <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.isPlaying();
Returns `true` if the current source is playing, otherwise returns `false`.

## <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.getPlugin(pluginName);
Returns the plugin instance. Example:
```javascript
var poster = player.getPlugin('poster');
poster.hidePlayButton();
```
This search the `Core` and `Container` plugins by name, and returns the first one found.

## <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.getCurrentTime();
Returns the current time(in seconds) of the current source.

## <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.getDuration();
Returns the duration(in seconds) of the current source.

## <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.resize(size);
Resizes the current player canvas. The `size` parameter should be a literal object with `height` and `width`. Example:
```javascript
player.resize({height: 360, width: 640});
```

## <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.destroy();
Destroy the current player and removes it from the DOM.

## <img src="https://cldup.com/V4mJE_EtiV-3000x3000.png"> player.load(source);
Loads a new source.
