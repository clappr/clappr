## FAQ & Troubleshooting

### How can I use clappr with ReactJS?

https://medium.com/@bikegriffith/using-clappr-with-reactjs-14a338e3451f#.9a36w0dpj

### How can I use clappr with ionic/angular?

https://github.com/clappr/clappr/issues/933#issuecomment-228540381

### How can I Log messages with Clappr?

Add this snipet before you instantiate the player `Clappr.Log.setLevel(0)`

### Common steps to verify issues

Very often people open issues related to: **stream not working, freezing, glitching, stopping and so on.** You can try the steps bellow, taking notes about the results:

* try to run the same example at [cdn](cdn.clappr.io)
* check the [cors headers at your servers](https://github.com/clappr/clappr/issues/703)
* try to run it on [hls.js demo page](http://dailymotion.github.io/hls.js/demo/)
* try to run it on [flashls. demo page](http://www.flashls.org/latest/examples/chromeless/)
* try to run on your page the following source: `http://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8`
* try different browsers/OS's to see if the problems remain
* try to use a tool to check the health of your stream (both input, ie: RTMP, and segmentation, ie: DASH or HLS): like `mediainfo` (for instance you could: ` mediainfo http://www.example.com/my.m3u8`, `mediastreamvalidator`, [`hls-analyzer`](https://github.com/epiclabs-io/hls-analyzer) and etc.

##### HLS-Analyzer usage example
```bash
pip install m3u8
git clone https://github.com/epiclabs-io/hls-analyzer.git
cd hls-analyzer
python hls-analyzer.py http://www.streambox.fr/playlists/x36xhzz/x36xhzz.m3u8
```
