
# Frequently Asked Questions (FAQ)

## How do I create a plugin?

Check out the documentation’s [How to Build a Plugin](./guides/how_to_build_plugins.md) section for a step-by-step guide.

## How can I disable a plugin?

Plugin classes include a `disable()` method that you can call directly:

```javascript
const player = new Clappr.Player({ ... });
player.getPlugin('spinner').disable();
```

## How can I override a plugin?

To override an existing plugin, define a new class using the same plugin name and pass it in the `plugins` array:

```javascript
export default class NoSpinner extends UIContainerPlugin {
  get name() { return 'spinner' }
}

new Clappr.Player({ 
  plugins: {
    container: [NoSpinner]
  }
})
```

## How can I handle fatal errors in the player?

Player fatal errors can be handled using the [`onError` callback option](/guides/events).

## How can I use Clappr with React?

You can integrate Clappr in React applications using refs or effect hooks.  
For an example, check out Mike Griffith’s article:  [Using Clappr with ReactJS](https://medium.com/@bikegriffith/using-clappr-with-reactjs-14a338e3451f#.9a36w0dpj)

> ⚠️ Note: this article was written in 2016 and may be partially outdated, but the concepts remain useful.

## How can I enable logging in Clappr?

The Clappr Log system provides multiple levels of verbosity, from detailed debug information to critical errors only. You can enable detailed logging before instantiating the player:

```javascript
Clappr.Log.setLevel(Clappr.Log.LEVEL_DEBUG) // or Clappr.Log.setLevel(0)
```

### Log levels

| Level Constant       | Numeric Value | Description                                  |
| -------------------- | ------------- | -------------------------------------------- |
| `Log.LEVEL_DEBUG`    | 0             | Verbose debug output |
| `Log.LEVEL_INFO`     | 1             | General information and lifecycle messages   |
| `Log.LEVEL_WARN`     | 2             | Warnings and recoverable issues              |
| `Log.LEVEL_ERROR`    | 3             | Critical or fatal errors                     |
| `Log.LEVEL_DISABLED` | 3             | Disables all logging                         |

## Which formats are supported by Clappr?

Format         |HLS|MP4|MP3|WEBM| DASH | RTMP | FLV |
---------------|---|---|---|----|------|------|-----|
Microsoft Edge | ✅ | ✅ | ✅ | ✅ | [🔌](/packages/dash-shaka-playback) | [🔌](https://github.com/clappr/clappr-rtmp-plugin) | [🔌](https://github.com/andrefilimono/clappr-flvjs-playback)
Mozilla Firefox| ✅ | ✅ | ✅ | ✅ | [🔌](/packages/dash-shaka-playback) | [🔌](https://github.com/clappr/clappr-rtmp-plugin) | [🔌](https://github.com/andrefilimono/clappr-flvjs-playback)
Google Chrome  | ✅ | ✅ | ✅ | ✅ | [🔌](/packages/dash-shaka-playback) | [🔌](https://github.com/clappr/clappr-rtmp-plugin) | [🔌](https://github.com/andrefilimono/clappr-flvjs-playback)
Android        | ✅ | ✅ | ✅ | ❌ | [🔌](/packages/dash-shaka-playback) | [🔌](https://github.com/clappr/clappr-rtmp-plugin) | [🔌](https://github.com/andrefilimono/clappr-flvjs-playback)
Safari         | ✅ | ✅ | ✅ | ❌ | [🔌](/packages/dash-shaka-playback) | [🔌](https://github.com/clappr/clappr-rtmp-plugin) | [🔌](https://github.com/andrefilimono/clappr-flvjs-playback)
iPhone         | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌
iPad           | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌

> The 🔌 icon indicates that support is provided by an **external plugin** (linked for convenience).

## Why is the `autoPlay` option not working?

Clappr cannot override browsers’ autoplay policies. Modern browsers restrict autoplay behavior, especially for videos with sound.  

Typically, playback will only start **muted**, or after a **user interaction** with the player.  

For more details on browser autoplay policies, see:

* [Chrome Autoplay Policy](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes)
* [WebKit Autoplay Policy](https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/)