# Introduction

Welcome to Clappr's documentation!

![Docusaurus Slash Introduction](/img/clappr_logo_black.png)

⏯ Clappr will help you create an **amazing video experience in your web application**.

⏩ Building a media player is costly. Instead, **focus on delivering your content**.

⏭ Do you want to go further? Build **new plugins** for Clappr. Find out how in [How to Build Plugins](guides/plugins/building) section. Check out our Clappr plugin showcase for inspiration.

⏺ Clappr is an **extensible, open-source, plugin-oriented, HTML5-first media player for web applications**. It can play, among other formats: MP4, WEBM, HLS, DASH, OGG, RTMP, both live content and on demand. For more information on media formats, check out the [Supported Media Formats](/docs/supported_formats) section.

## How to use

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
```

To learn more about what parameters you can use when instantiating Clappr, check the [Configuration](/docs/configuration) section.

:::tip

Use https://clappr.io/demo to test Clappr immediately in your browser!

:::

## Design principles

- **Easy to use.** Clappr's quite simple. Just import it, plug it in your page and it's ready to play.

- **Multiplatform.** Clappr uses HTMLVideoElement by default, which guarantees support to many platforms.

- **Extensible.** You have the possibility to extend the default HTML5 playback or the playback interface to create a new media support, just like a plugin!

## Want to contribute?

Clappr is under heavy development but production-ready.

If you find problems concerning Clappr's documentation or have any suggestions on how to improve it or the project in general, feel free to [open issues](https://github.com/clappr/clappr/issues) or [contribute to the project].