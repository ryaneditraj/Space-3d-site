# Contributing to Space 3D Site

Thanks for wanting to improve the scene. The page is a small Three.js demo, and the fun of it is that you can read the whole thing.

## Code of conduct

Be kind. [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) is the Contributor Covenant 2.1.

## What you need

- A current desktop browser with WebGL
- Network access the first time you load the page, because Three.js comes from cdnjs
- Python 3 if you want the local server below

Node.js is not required to view the scene. Continuous integration uses Node to syntax-check `js/scene.js` and validate `index.html`.

## Preview

```bash
git clone https://github.com/ryaneditraj/Space-3d-site.git
cd Space-3d-site
python3 -m http.server 8080
```

Open http://127.0.0.1:8080 and confirm all four shapes are there: the pizza sphere, the magenta wireframe donut, the cyan cube, and the orange cone.

Opening `index.html` directly also shows the scene. That path uses the embedded JPEG in `js/pizza-texture.js`. If you change `assets/textures/pizza.jpg`, update the embedded copy so `scripts/check.sh` still passes. Serving the folder with the command above uses the JPEG file itself.

## Where to edit

| Change | File |
| --- | --- |
| Shapes, colors, speeds, positions | `js/scene.js` |
| Headline, note, meta tags | `index.html` |
| Overlay colors and layout | `css/styles.css` |
| Pizza texture | `assets/textures/pizza.jpg` |

The names `sss`, `ccc`, `rrr`, and `spinnySpin` are the original scene names. New code can use clearer names. Please leave the motion math alone unless the pull request is specifically about that motion.

Paths in the page are relative, so the site still works when GitHub Pages serves it from `/Space-3d-site/`.

## Pull requests

1. Describe what changed and why.
2. Say how you previewed it (browser and viewport).
3. Include a screenshot if the scene or the overlay looks different.
4. Keep secrets out of the diff. There is nothing to put in `.env` today. If you add a real credential, it belongs in a gitignored `.env`, with the variable name only in `.env.example`.

Security reports go through a [private advisory](https://github.com/ryaneditraj/Space-3d-site/security/advisories/new), not a public issue. See [SECURITY.md](SECURITY.md).

## Checks

```bash
bash scripts/check.sh
npx --yes html-validate@11.17.0 index.html
```

GitHub Actions runs both on pull requests.
