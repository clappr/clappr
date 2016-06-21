[![npm version](https://badge.fury.io/js/clappr.svg)](http://badge.fury.io/js/clappr)
[![Build Status](https://travis-ci.org/clappr/clappr.svg?branch=master)](https://travis-ci.org/clappr/clappr)
[![Dependency Status](https://gemnasium.com/clappr/clappr.svg)](https://gemnasium.com/clappr/clappr)
[![Coverage Status](https://coveralls.io/repos/clappr/clappr/badge.svg?branch=master&service=github)](https://coveralls.io/github/clappr/clappr?branch=master)
[![Code Climate](https://codeclimate.com/github/clappr/clappr/badges/gpa.svg)](https://codeclimate.com/github/clappr/clappr)
[![License](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)
<div align=center>
<img src="https://cloud.githubusercontent.com/assets/244265/6373134/a845eb50-bce7-11e4-80f2-592ba29972ab.png"><br><br>
<img src="https://i.cloudup.com/GSbXxvCsBK.png">
</div>

## Using the Player

[![Join the chat at https://gitter.im/clappr/clappr](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/clappr/clappr?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Add the following script on your HTML:
```html
<head>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/clappr/latest/clappr.min.js"></script>
</head>
```
Now, create the player:
```html
<body>
  <div id="player"></div>
  <script>
    var player = new Clappr.Player({source: "http://your.video/here.mp4", parentId: "#player"});
  </script>
</body>
```

## CDN

You can use the latest published version at `https://cdn.jsdelivr.net/clappr/latest/clappr.min.js`

## Vendors

You can re-use some vendors used internally, for instance you can use `Kibo` through `Clappr.Vendor.Kibo`.

## Status

Clappr is under heavy development but production-ready. Feel free to open issues and send us pull requests.

## [Supported Formats](doc/SUPPORTED_FORMATS.md)

## [External Plugins](doc/EXTERNAL_PLUGINS.md)

<a href="https://github.com/tjenkinson/clappr-thumbnails-plugin/">
  <img src='https://github.com/tjenkinson/clappr-thumbnails-plugin/raw/master/screenshot.jpg' width="280px"></img>
</a> <a href="https://github.com/tjenkinson/clappr-markers-plugin/">
  <img src='https://github.com/tjenkinson/clappr-markers-plugin/blob/master/screenshot.jpg' width="280px"></img>
</a> <a href="https://github.com/clappr/dash-shaka-playback">
  <img src='http://influxis.com/app/uploads/2012/03/cropped-mpeg-dashpg_logo_light_rgb-5.jpeg' width="280px"></img>
</a> <a href="https://github.com/clappr/clappr-chromecast-plugin">
  <img src='http://www.googlechromecastsetup.com/wp-content/uploads/2015/11/chromecast-banner.png' width="280px"></img>
</a> <a href="https://github.com/clappr/clappr-level-selector-plugin">
  <img src='https://raw.githubusercontent.com/lucasmundim/clappr-level-selector-plugin/master/screenshot.png' width="280px"></img>
</a> <a href="https://raw.githubusercontent.com/bikegriffith/clappr-playback-rate-plugin/">
  <img src='https://raw.githubusercontent.com/bikegriffith/clappr-playback-rate-plugin/master/screenshot.png' width="280px"></img>
</a>

## [Built-in Plugins & Embed Parameters](doc/BUILTIN_PLUGINS.md)

## [API Documentation](http://clappr.github.io/)

## [Installing](doc/INSTALLING.md)

## [Troubleshooting](doc/TROUBLESHOOTING.md)

## [Read this before open an issue](doc/BEFORE_OPEN_AN_ISSUE.md)

## [Contributors](https://github.com/globocom/clappr/graphs/contributors)

## [Contributing](doc/CONTRIBUTING.md)

## Sponsor

[![image](https://cloud.githubusercontent.com/assets/244265/5900100/ef156258-a54b-11e4-9862-7e5851ed9b81.png)](http://globo.com)
