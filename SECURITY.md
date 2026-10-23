# Security policy

## Supported versions

| Version | Supported |
| --- | --- |
| `main` | Yes |
| Older commits | No |

Space 3D Site is a static page. It has no accounts, no server, and no secret configuration.

## Reporting a vulnerability

Please use [private vulnerability reporting](https://github.com/ryaneditraj/Space-3d-site/security/advisories/new).

Do not open a public issue for a security report. There is no bug bounty. Reports are reviewed by the maintainer, Ryan Editraj ([@ryaneditraj](https://github.com/ryaneditraj)).

## Secrets

No API keys, tokens, passwords, or private keys are required to run this project.

A review of the tree and of git history on 2026-10-23 found none. The history is two commits, `eac82cd` (`index.html`) and `b1c5b2f` (`README.md`). History was not rewritten. There is nothing to rotate.

`.env` is gitignored. [.env.example](.env.example) documents that the page does not read environment variables. If a future change needs a credential, put the real value in `.env` and the name only in `.env.example`.

The original page hotlinked a public Unsplash image URL. That URL is not a credential. The JPEG now lives at `assets/textures/pizza.jpg`. `js/pizza-texture.js` is that same JPEG written as a `data:` URL so WebGL can show it when someone opens `index.html` from disk. It is not a key.

## Dependency review (2026-10-23)

There is no `package.json` and no lockfile. The only third-party runtime script is Three.js r128, which is npm package `three@0.128.0`, loaded from cdnjs.

| Item | Result |
| --- | --- |
| [OSV.dev](https://osv.dev) for `npm/three` `0.128.0` | No vulnerabilities returned |
| CVE-2020-28496 / GHSA-fq6p-x6j3-cmmq | Affects `three` before `0.125.0` only. r128 is not affected. This page also does not parse untrusted color strings. |
| CVE-2022-0177 | Withdrawn by the advisory database. This page does not load models or iframes from visitors. |
| Subresource Integrity | `index.html` pins the cdnjs file with `sha384-CI3ELBVUz9XQO+97x6nwMDPosPR5XvsxW2ua7N1Xeygeh1IxtgqtCkGfQY9WWdHu` |
| File checked | 603,445 bytes, `last-modified` Fri, 23 Apr 2021, `cdnjs` path `three.js/r128/three.min.js` |

The pin means a changed file at that URL will not run. The site will fail closed until the hash is updated on purpose. Upgrading Three.js is a visual change, so it is listed in the roadmap rather than done in place.

## Page hardening

- Charset, viewport, and a referrer policy are set.
- Content-Security-Policy is delivered in a meta tag: scripts from this origin and `https://cdnjs.cloudflare.com`, styles from this origin, images from this origin. The inline JSON-LD block is allowed by hash. The page has no `unsafe-inline` script source.
- Error text is assigned with `textContent`. The page does not read user input and does not build HTML from data.
- `frame-ancestors`, `X-Content-Type-Options`, and `Permissions-Policy` are ignored or unavailable in meta tags. GitHub Pages does not let this repository set those response headers.

If you host the folder yourself, send:

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com 'sha256-<json-ld hash from index.html>'; style-src 'self'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; media-src 'none'; object-src 'none'; worker-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Copy the current `sha256-` value from the meta tag in `index.html` into that header when you deploy it. The hash changes if the JSON-LD block changes.

## Residual notes

- Three.js r128 is a 2021 build. No listed advisory applies. A major upgrade still deserves a side-by-side screenshot check.
- The cdnjs request is the remaining third-party script. Integrity checking limits tampering. It does not make the page work offline.
- Anyone who forks the scene and later adds loaders for untrusted models (`ObjectLoader`, `GLTFLoader`, and similar) should treat those files as untrusted input.
