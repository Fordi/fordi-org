#!/bin/bash
rm -rf dist
mkdir 'vendor'
wget 'https://unpkg.com/@fordi-org/buildless@1.0.2/dist/buildless.modern.js' -qO 'vendor/buildless.js'
npx microbundle \
  -i src/index.js \
  -o dist/index.js \
  --alias 'https://unpkg.com/@fordi-org/buildless@1.0.2/dist/buildless.modern.js'='../vendor/buildless.js' \
  --raw --compress \
  -f modern
rm -rf 'vendor';
mv dist/index.modern.js dist/index.js
gzip -9k dist/index.js
gzip -9k dist/index.modern.js.map
while read file; do
  mkdir -p "dist/$(dirname "$file")"
  cp "src/$file" "dist/$file"
  gzip -9k "dist/$file"
  if [[ "$(stat -f %z "dist/$file")" -lt "$(stat -f %z "dist/$file.gz")" ]]; then
    rm "dist/$file.gz"
  fi
done < <(find src -type f -not -iname *.js | cut -d / -f 2-)
