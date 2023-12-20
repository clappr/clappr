---
title: Tutorial
---

# Tutorial

Get started by **creating a new site**.

You can **try Clappr immediately** with **[clappr.io/demo](http://clappr.io/demo/)**.

In your HTML, create an element for your Player instance and add the following script:

```html
<body>
  <div id="player"></div>
  <script type="text/javascript" src="http://cdn.clappr.io/latest/clappr.min.js"></script>
</body>
```

Then, in your project's script, instantiate the Player:
```html
<body>
  <script>
    var player = new Clappr.Player({ source: "http://your.video/here.mp4", parentId: "#player" });
  </script>
</body>
```

To learn more about what options you can pass to a Player instance, check the [[Embed Parameters]] section.
