#!/usr/bin/env bash
# Local mirror of the file and secret checks CI runs.
set -euo pipefail

cd "$(dirname "$0")/.."

required=(
  README.md
  LICENSE
  CONTRIBUTING.md
  CODE_OF_CONDUCT.md
  SECURITY.md
  .gitignore
  .env.example
  index.html
  css/styles.css
  js/scene.js
  robots.txt
  sitemap.xml
  llms.txt
  assets/favicon.svg
  assets/textures/pizza.jpg
  assets/textures/SOURCE.md
  js/pizza-texture.js
  assets/screenshots/scene-desktop.png
  assets/screenshots/scene-mobile.png
  assets/screenshots/scene-demo.gif
)

for f in "${required[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "missing $f" >&2
    exit 1
  fi
done

node --check js/scene.js
node --check js/pizza-texture.js

python3 - << 'PY'
import base64, pathlib, re
jpg = pathlib.Path("assets/textures/pizza.jpg").read_bytes()
js = pathlib.Path("js/pizza-texture.js").read_text()
match = re.search(r"data:image/jpeg;base64,([A-Za-z0-9+/=]+)", js)
if not match:
    raise SystemExit("pizza data URI missing")
if base64.b64decode(match.group(1)) != jpg:
    raise SystemExit("pizza data URI does not match assets/textures/pizza.jpg")
print("pizza texture copies match")
PY

for symbol in SphereGeometry TorusGeometry BoxGeometry ConeGeometry spinnySpin; do
  if ! grep -q "$symbol" js/scene.js; then
    echo "scene is missing $symbol" >&2
    exit 1
  fi
done

if ! grep -q 'integrity="sha384-CI3ELBVUz9XQO+97x6nwMDPosPR5XvsxW2ua7N1Xeygeh1IxtgqtCkGfQY9WWdHu"' index.html; then
  echo "Three.js subresource integrity pin is missing" >&2
  exit 1
fi

if grep -n 'images.unsplash.com' index.html js/scene.js css/styles.css; then
  echo "Unsplash hotlink is back in the page" >&2
  exit 1
fi

if grep -n 'unsafe-inline' index.html; then
  echo "CSP allows unsafe-inline" >&2
  exit 1
fi

# Credential shapes only. The pattern lives in this script, and it does not match itself.
if grep -RInI -E \
  --exclude-dir=.git \
  --exclude-dir=assets \
  --exclude='*.png' \
  --exclude='*.jpg' \
  --exclude='*.jpeg' \
  --exclude='*.gif' \
  --exclude='*.webp' \
  'AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{20,}|sk_live_[A-Za-z0-9]{16,}|xox[baprs]-[A-Za-z0-9-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----' \
  .; then
  echo "Possible secret found" >&2
  exit 1
fi

echo "checks passed"
