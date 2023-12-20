
# FAQ

## How do I create a Plugin?

Check out the documentation's [How to Build a Plugin section](/guides/plugins/building).

## How can I disable a Plugin?

Plugin classes have a `disable` method.

```javascript
const player = new Clappr.Player({ ... });
player.getPlugin('spinner').disable();
```

## How can I override a Plugin?

```javascript
export default class NoSpinner extends UIContainerPlugin {
  get name() { return 'spinner' }
}

new Clappr.Player({ plugins: [NoSpinner]})
```

## How can I handle fatal errors on the Player?

Player fatal errors can be handled using the [`onError` callback option](/guides/events).

## How can I use Clappr with ReactJS?

Check out Mike Griffith's article [Using Clappr with ReactJS](https://medium.com/@bikegriffith/using-clappr-with-reactjs-14a338e3451f#.9a36w0dpj).

## How can I log messages with Clappr?

Add this snippet before you instantiate the Player:

```javascript
Clappr.Log.setLevel(0)
```

## Why is the `autoPlay` option not working?

Clappr has no control over web browsers' autoplay policy. Therefore, we're not able to execute play and unmute actions sequentially in every situation. 

Each browser has their own different set of restrictions, and the usual behavior is to activate a video's sound only after the user interacts with the Player. 

For more information on AutoPlay video policies, check out the following docummentation:

* [Chrome Autoplay Policy](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes)
* [WebKit Autoplay Policy](https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/)