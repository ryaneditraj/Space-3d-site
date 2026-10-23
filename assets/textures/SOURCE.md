# Pizza texture

`pizza.jpg` is the same 100×67 JPEG the original page loaded from:

https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=100&auto=format&fit=crop

It was saved into the repository on 2026-10-23 so the page no longer sends visitors to `images.unsplash.com`.

License: [Unsplash License](https://unsplash.com/license). Attribution is not required. The file is a compressed crop for a WebGL texture, not a standalone photo for resale.

`js/pizza-texture.js` repeats this JPEG as a data URI. WebGL cannot read a `file://` image, so opening `index.html` directly uses that copy. A local web server uses `pizza.jpg`. `scripts/check.sh` checks that the two copies match.
