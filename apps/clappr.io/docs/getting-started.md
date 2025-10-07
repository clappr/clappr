# Getting Started with Clappr

This guide will walk you through setting up Clappr, configuring the Player and Playbacks, installing it in your project, and running it locally for development.

## Installation

In your project's HTML, import Clappr's latest version by adding the following script:

```html
<head>
  <script type="text/javascript" src="http://cdn.clappr.io/latest/clappr.min.js"></script>
</head>
```

Now, create an element for Clappr's Player and instantiate it:

```html
<body>
  <div id="player"></div>
  <script>
    const player = new Clappr.Player({
      source: 'http://your.video/here.mp4',
      parentId: '#player' 
    })
  </script>
</body>
```

## Development

Ensure you have [Yarn](https://yarnpkg.com/) installed.

### Local Development

Clone the project:

```bash
git clone git@github.com:clappr/clappr.git
cd clappr
yarn install
```

Start the development server:

```bash
yarn start
```

Visit [http://localhost:8080](http://localhost:8080). Changes are reflected live without restarting the server.

### Build

Run tests:

```bash
yarn test
```

Build a custom version:

```bash
yarn build
```

The newly built Player will be in the `dist/` directory.

## Configuration

### Player Config

When instantiating Clappr in your web application, there are a variety of options you can use to configure the Player.

| Name                                 | Type    | Default                  | Description                                                                                                                            |
| ------------------------------------ | ------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `parent`                             | String  | –                        | Specify where the player should be attached using the DOM element.                                                                     |
| `parentId`                           | String  | –                        | Specify where the player should be attached using the ID of a DOM element.                                                             |
| `source`                             | String  | –                        | Sets the media source URL to play.                                                                                                     |
| `sources`                            | Array   | –                        | An array of sources. If a media is invalid, the next source is played.                                                                 |
| `mimeType`                           | String  | –                        | Set the media source format when using a URL without an extension.                                                                     |
| `events`                             | Object  | –                        | Add callback functions for mapped events. See [Events](../guides/events).                                                              |
| `plugins`                            | Object  | –                        | Configure external plugin instances. See [Plugins].                                                                                    |
| `plugins.loadExternalPluginsFirst`   | Boolean | `true`                   | Load external plugins before default Clappr plugins.                                                                                   |
| `plugins.loadExternalPlaybacksFirst` | Boolean | `true`                   | Load external playbacks before default Clappr playbacks.                                                                               |
| `mediacontrol`                       | Object  | –                        | Customize control bar colors. Example: `{ seekbar: '#E113D3', buttons: '#66B2FF' }`                                                    |
| `hideMediaControl`                   | Boolean | `true`                   | Disable Media Control auto-hide.                                                                                                       |
| `height`                             | String  | `360px`                  | Set player height (px or %).                                                                                                           |
| `width`                              | String  | `640px`                  | Set player width (px or %).                                                                                                            |
| `autoPlay`                           | Boolean | `false`                  | Play media automatically when ready.                                                                                                   |
| `autoPlayVisible`                    | String  | –                        | `partial` or `full` for automatic play based on visibility.                                                                            |
| `mute`                               | Boolean | `false`                  | Set volume to zero using `<video>` muted attribute.                                                                                    |
| `hideVolumeBar`                      | Boolean | `false`                  | Hide the volume bar.                                                                                                                   |
| `loop`                               | Boolean | `false`                  | Loop the video.                                                                                                                        |
| `language`                           | String  | `en-US`                  | Set supported language. See [Strings plugin](https://github.com/clappr/clappr-core/blob/master/src/plugins/strings/strings.js#L35-93). |
| `persistConfig`                      | Boolean | `true`                   | Persist Player volume across multiple videos using localStorage.                                                                       |
| `playbackNotSupportedMessage`        | String  | `playback_not_supported` | Custom message when playback isn't supported.                                                                                          |
| `useCodePrefix`                      | Boolean | `true`                   | Prefix error codes with the component name.                                                                                            |
| `autoSeekFromUrl`                    | Boolean | `true`                   | Seek to timestamp if present in URL. Example: `example.com?t=100`.                                                                     |
| `includeResetStyle`                  | Boolean | `true`                   | Enable/disable Clappr's `_resets.scss` style reset.                                                                                    |

## Playback Config

Options specific to Playbacks (compatible with `HTML5Playback` and derived playbacks):

| Name                 | Type    | Default           | Description                                                                                                      |
| -------------------- | ------- | ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| `preload`            | String  | `metadata`        | Define how the video is preloaded. [More info](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video). |
| `disableContextMenu` | Boolean | `false`           | Disable context menu activation.                                                                                 |
| `controls`           | Boolean | `true`            | Enable/disable HTML5 video tag controls.                                                                         |
| `crossOrigin`        | String  | `use-credentials` | Set `<video>` tag's `crossOrigin` attribute.                                                                     |
| `playInline`         | Boolean | `true`            | Enable `<video>` `playInline` attribute.                                                                         |
| `minimumDvrSize`     | Integer | –                 | Minimum value to activate DVR for live media.                                                                    |
| `externalTracks`     | Array   | –                 | Array of track objects with `src`, `lang`, `label` (optional `kind`).                                            |
| `hlsjsConfig`        | Object  | –                 | Settings for [hls.js](https://github.com/video-dev/hls.js/blob/master/docs/API.md).                              |
| `shakaConfiguration` | Object  | –                 | Settings for [shaka-player](https://shaka-player-demo.appspot.com/docs/api/tutorial-config.html).                |

## Playground

You can test Clappr directly in your browser via [Clappr Playground](https://clappr.io/demo).

![Clappr Playground Interface](../static/img/clappr_playground.png)

### Features

* **Shareable:** Generate a shareable link for your current configuration using the **Run** button.
* **External Plugins:** Test external plugins by adding their JavaScript file links alongside Clappr.
