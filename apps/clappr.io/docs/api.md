---
sidebar_position: 6
---

# Player API

Create an instance:

```javascript
var player = new Clappr.Player({ source: 'http://your.video/here.mp4', parentId: '#player' })
```

## player.attachTo(element)

You can use this method to attach the player to a given `element`. You don't need to do this when you specify it during the player instantiation passing the `parentId` param.

## player.play()

Plays the current source.

## player.pause()

Pauses the current source.

## player.stop()

Stops the current source.

## player.seek(value)

The `value` should be a number between 0 and the video duration in seconds. For example, `player.seek(120)` will seek to second 120 (2 minutes) of the current source.

## player.seekPercentage(percentage)

The `percentage` should be a number between 0 and 100. For example, `player.seekPercentage(50)` will seek to the middle of the current source.

## player.setVolume(value)

The `value` should be a number between 0 and 100, 0 being mute and 100 the max volume.

## player.mute()

Mute the current source.

## player.unmute()

Unmute the current source.

## player.isPlaying()

Returns `true` if the current source is playing, otherwise returns `false`.

## player.getPlugin(pluginName)

Returns the plugin instance. Example:

```javascript
var poster = player.getPlugin('poster')
poster.hidePlayButton()
```

This search the `Core` and `Container` plugins by name, and returns the first one found.

## player.getCurrentTime()

Returns the current time(in seconds) of the current source.

## player.getDuration()

Returns the duration(in seconds) of the current source.

## player.resize(size)

Resizes the current player canvas. The `size` parameter should be a literal object with `height` and `width`. Example:

```javascript
player.resize({ height: 360, width: 640 })
```

## player.destroy()

Destroy the current player and removes it from the DOM.

## player.load(source)

Loads a new source.

## player.consent(callback)

Gives user consent to playback. Required by mobile devices after a click event before Player.load(). Example:

```javascript
player.consent(function () {
  doSomethingNext()
})
```

## player.isDvrEnabled()

Returns `true` if DVR is enabled, otherwise returns `false`.

## player.configure(options)

Enables to configure a player after its creation. The `options` parameter should be a javascript object with the options to change. Example:

```javascript
player.configure({ autoPlay: true, mute: false })
```

