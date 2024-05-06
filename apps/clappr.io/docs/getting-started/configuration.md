---
description: How to configure Clappr's Player, and more.
---

# Configuration

## Player Config

When instantiating Clappr in your web application, there's a share of options you can use to configure the Player.

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `parent` | String | – | Used to specify where the player should be attached using the DOM element. |
| `parentId` | String | – | Used to specify where the player should be attached using an ID of a DOM element. |
| `source` | String | – | Sets media source URL to play. You can set the media source accordingly to existing playbacks. |
| `sources` | Array | – | An array of sources. If a media is invalid, next media source in the array will be played. |
| `mimeType` | String | – | Sets the media source format used on the source option. Use if you need to use a media URL without extension. |
| `events` | Object | – | Object to add callback functions based on mapped events. For more information on events, check the [Events](../guides/events) section. |
| `plugins` | Object | – | An object used to configure external plugin instances and behaviors related to Clappr. For more information on plugins, check the [Plugins] section. |
| `plugins.loadExternalPluginsFirst` | Boolean | `true` | Force external plugins to be loaded before default Clappr plugins. |
| `plugins.loadExternalPlaybacksFirst` | Boolean | `true` | Force external playbacks to be loaded before default Clappr playbacks. |
| `mediacontrol` | Object | – | Customize control bar colors adding RGB hashes. Example: `{ seekbar: '#E113D3', buttons: '#66B2FF' }` |
| `hideMediaControl` | Boolean | `true` | Disables the Media Control's automatic hiding. |
| `height` | String | `360px` | Sets player height. You can set it using px (`500px`) or percentage (`100%`). |
| `width` | String | `640px` | Sets player width. You can set using px (500px) or percentage (`100%`). |
| `autoPlay` | Boolean | `false` | Configure Clappr to play media after the player is ready to play. |
| `autoPlayVisible` | String | – | `partial` if video should play automatically when it is partially appearing on the screen, `full` to autoPlay only when it is fully visible. |
| `mute` | Boolean | `false` | Set volume to zero enabling the [`<video>` tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) muted attribute. |
| `hideVolumeBar` | Boolean | `false` | Hide volume bar from Clappr's media control. |
| `loop` | Boolean | `false` | Restart video after the video ends enabling the [`<video>` tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) loop attribute. |
| `language` | String | `en-US` | Sets one of the current languages supported on Clappr. You can check all supported languages on the [Strings plugin](https://github.com/clappr/clappr-core/blob/master/src/plugins/strings/strings.js#L35-93). |
| `persistConfig` | Boolean | `true` | Makes it so that the Player's volume persists throughout multiple videos. This configuration is saved in the user's browser through [localStorage](http://diveintohtml5.info/storage.html). |
| `playbackNotSupportedMessage` | String | `playback_not_supported` string defined in [Strings plugin](https://github.com/clappr/clappr-core/blob/master/src/plugins/strings/strings.js#L35-93). | Define a custom message to be displayed when playback is not supported. |
| `useCodePrefix` | Boolean | `true` | Clappr has a built-in pattern to create the `code` attribute on the `Error` object using the name of the component where the error occured as a prefix alongside the original error code. Example: `hls:networkError_manifestLoadError (component_name:error_code)` |
| `autoSeekFromUrl` | Boolean | `true` | If the URL contains a timestamp, the media will seek to that point. Example: `example.com?t=100` would start the media at 100 seconds. |
| `includeResetStyle` | Boolean | `true` | Clappr periodically resets styles that may impact your own. With this option, it's possible to enable/disable the use of [_resets.scss](https://github.com/clappr/clappr-core/blob/master/src/base/scss/_reset.scss). |

:::tip

Even if not mapped, any parameters used with `Clappr.Player` or with the `configure` method are added to the Player's instance.

```javascript
const player = new Clappr.Player({
  source: "http://your.video/here.mp4",
  parameter1: "value1",
  parameter2: "value2",
});

player.configure({
  parameter3: "value3",
  parameter4: "value4",
})
```

:::

## Playback Config

Clappr also has a specific set of options for playbacks. 

:::note

The options listed below are only compatible with Clappr's native HTML5 playback and derived playbacks.

:::

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `preload` | String | `metadata` | When loading an on-demand video (Example: MP4), it's possible to define the way the video will be preloaded according to preload attribute options. For more information, check [documentation related to the `<video>` tag `preload` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video). |
| `disableContextMenu` | Boolean | `false` | Disables possibility to activate the context menu. |
| `controls` | Boolean | `true` | Use to enable or disable the [HTML5 video tag controls](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video). |
| `crossOrigin` | String | `use-credentials` | Use to set one of the possible values supported on the HTML5 video tag. For more information, check [documentation on `<video>` tag's `crossOrigin` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video). |
| `playInline` | Boolean | `true` | Enables the `HTML5` [`<video>` tag playInline attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video). |
| `minimumDvrSize` | Integer | – | Used to set the minimum value to active DVR for live media. This option is only used for `HTML5Playback` at this moment. |
| `externalTracks` | Array | – | An array of tracks. Each track must have the attributes `src`, `lang` and `label`. The attribute kind on track object is optional because of the default value subtitles. For more information, check [documentation related to tracks on the `<video>` tag element](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video). |
| `hlsjsConfig` | Object | – | Any specific settings for [hls.js](https://github.com/video-dev/hls.js/blob/master/docs/API.md) should be in this option. |
| `shakaConfiguration` | Object | – | Any specific settings for [shaka-player](https://shaka-player-demo.appspot.com/docs/api/tutorial-config.html) should be in this option. |
