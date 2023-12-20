# Events

Clappr uses an event-based system to allow communication between components. This design allows the development of decoupled plugins that use listeners for the desired events alongside callback functions that are activated upon the triggering of events.

All available events can be checked in the [Events section in Clappr's API docummentation](http://clappr.github.io/classes/Events.html).

## Mapped Events

When instantiating the Player, [Clappr's configuration](../getting-started/configuration) allows the customizing of callback functions based on mapped events through the use of an `events` option.

| Option | Event | Description |
| ------ | ----- | ----------- |
| `onReady` | `PLAYER_READY` | Activated when the Player instance is ready to start up. |
| `onResize` | `PLAYER_RESIZE` | Activated when the Player instance is resized. |
| `onPlay` | `PLAYER_PLAY` | Activated when the Player instance starts to play |
| `onPause` | `PLAYER_PAUSE` | Activated when the Player instance is paused. |
| `onStop` | `PLAYER_STOP` | Activated when the Player instance stops the video. |
| `onEnded` | `PLAYER_ENDED` | Activated when the Player instance ends the video. |
| `onSeek` | `PLAYER_SEEK` | Activated when the Player instance seeks to a timepoint in the video.  |
| `onError` | `PLAYER_ERROR` | Activated when the Player instance receives an error. |
| `onTimeUpdate` | `PLAYER_TIMEUPDATE` | Activated when the Player instance's timestamp is updated.  |
| `onVolumeUpdate` | `PLAYER_VOLUMEUPDATE` | Activated when the Player instance's volume is updated. |
| `onSubtitleAvailable` | `PLAYER_SUBTITLE_AVAILABLE` | Activated when the Player instance's subtitles are made available. |

### Example

```javascript
const player = new Clappr.Player({
  source: "http://your.video/here.mp4",
  events: {
    onReady: function() { ... },
    onResize: function() { ... }, 
    onPlay: function() { ... }, 
    onPause: function() { ... },
    onStop: function() { ... },
    onEnded: function() { ... },
    onSeek: function() { ... },
    onError: function() { ... },
    onTimeUpdate: function() { ... },
    onVolumeUpdate: function() { ... },
    onSubtitleAvailable: function() { ... },
  }
})
```

## Unmapped Events

In order to listen to arrange callbacks for events that aren't mapped through Clappr's configuration, you need to use a bind for the event's specific scope.

### Example

The `CONTAINER_STATE_BUFFERING` event is triggered by the Player's Container. If you want to listen to events from the container layer on your code, you can bind events like the example below:

```javascript
player.core.activeContainer.on(Clappr.Events.CONTAINER_STATE_BUFFERING, function() { ... })
```
