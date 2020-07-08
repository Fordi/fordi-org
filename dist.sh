#!/bin/bash
rm -rf dist
npx microbundle \
  -i src/index.js \
  -o dist/index.js \
  --compress \
  -f modern
mv dist/index.modern.js dist/index.js
gzip -9k dist/index.js
gzip -9k dist/index.modern.js.map
FMT="--format %s" && stat $FMT .git/config > /dev/null 2>&1 || FMT="-f %z"
while read file; do
  mkdir -p "dist/$(dirname "$file")"
  cp "src/$file" "dist/$file"
  gzip -9k "dist/$file"
  if [[ "$(stat $FMT "dist/$file")" -lt "$(stat $FMT "dist/$file.gz")" ]]; then
    rm "dist/$file.gz"
  fi
done < <(find src -type f -not -iname *.js | cut -d / -f 2-)
