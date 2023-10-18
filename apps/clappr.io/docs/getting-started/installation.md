---
description: How to import Clappr, and use it in your site in no time.
---

# Installation

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
