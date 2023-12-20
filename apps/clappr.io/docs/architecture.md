
# Architecture

Clappr is an extensible, open-source, plugin-oriented, HTML5-first media player for web applications. It was designed around these main components:  

* [Player](https://github.com/clappr/clappr-core/blob/master/src/components/player/player.js): Clappr's Public API and entry point for clients.
* [Core](https://github.com/clappr/clappr-core/blob/master/src/components/core/core.js): The Player's Core. Almost all components are created and managed here. The Player usually communicates with other components through the Core.
* [MediaControl](https://github.com/clappr/clappr-plugins/blob/master/src/plugins/media_control/media_control.js): The Media Control is the UI interface so the user can interact with the Player's Playback. It should work with any Playback (MP4, hls.js, shaka-player, etc.)
* [Container](https://github.com/clappr/clappr-core/blob/master/src/components/container/container.js): A wrapper around the Playback. It can be seen as just a delegator, but it's also used to build plugins that are agnostic of the Playback's kind.
* [Playback](https://github.com/clappr/clappr-core/blob/master/src/base/playback/playback.js): An abstraction that actually plays the media. It might use: [`<video>` tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video).

![alt](https://raw.githubusercontent.com/wiki/clappr/clappr-docs/main_classes_picture.png)

You can create plugins around these abstractions. Here's the kinds of available plugins:

* **CorePlugin**: Accesses all the components of the Player (Ex: Getting User Statistics).
* **UICorePlugin** - Same as **CorePlugin**, but it's able to render UI elements. (Ex.: [Chromecast](https://github.com/clappr/clappr-chromecast-plugin) and [Thumbnails](https://github.com/tjenkinson/clappr-thumbnails-plugin) plugins)
* **ContainerPlugin**: Accesses Playback info and is able to control it or change its behavior (Ex.: [Speech Control](https://github.com/clappr/clappr-speech-control-plugin) plugin).
* **UIContainerPlugin**: Same as **ContainerPlugin**, but it's able to render UI elements. (Ex.: [Watermark](https://github.com/clappr/watermark) plugin).
* **Playback**: Although more of module than a plugin, you can provide a Playback for the Player (Ex.: [360-degrees playback](https://github.com/thiagopnts/video-360), [shaka-player playback](https://github.com/clappr/dash-shaka-playback)).
* **MediaControl**: Provides controls to the Player.


To summarize Clappr is aiming to:

 * **Keep extensibility open:** You can create an entire plugin in a different repository, you can disable it, you can create a new playback that is able to work with the old media control and existent plugins.
 * **Use mainly events to communicate with components:** which makes your program less coupling in your plugin level... you don't need to call a function, you can listen to events and trigger events.
 * **Have a minimal footprint:** You can add the plugins you need, for instance you don't need to load [Chromecast](https://github.com/clappr/clappr-chromecast-plugin) when you don't need it.
