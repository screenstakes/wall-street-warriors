#!/bin/bash
# Mobile check for one page at a true 390px phone width (headless Chrome won't size a window below 500px,
# so the page renders inside a 390px iframe).
#
#   bash dev/mobile-check.sh index.html               # probe report + screenshots
#   bash dev/mobile-check.sh calendar.html e=roster   # open with a hash (e.g. a drawer deep link)
#
# Writes to dev/out/:
#   NAME-screen.png   the first screen exactly as a phone shows it (390×844, fixed bars in place), at 2x
#   NAME-seg-NN.png   the whole page cut into 1100px slices at 1x, to read every section at real size
# Prints the probe: RESULT OK|FAIL with overflow / zoom (fail) and tap / tiny (warn) counts, then details.
set -u
cd "$(dirname "$0")/.." || exit 1
PAGE="${1:-index.html}"; HASH="${2:-}"
OUT="dev/out"; mkdir -p "$OUT/pages"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TAG=""; [ -n "$HASH" ] && TAG="-$(printf '%s' "$HASH" | tr -c 'A-Za-z0-9' '_')"
NAME="${PAGE%.html}$TAG"

sed 's#</body>#<script src="dev/probe.js"></script></body>#' "$PAGE" > "$OUT/pages/$PAGE"
[ -e "$OUT/pages/assets" ] || ln -s ../../../assets "$OUT/pages/assets" 2>/dev/null
[ -e "$OUT/pages/dev" ] || ln -s ../.. "$OUT/pages/dev" 2>/dev/null
# one host file per run name, so parallel checks on different pages never share a file
sed 's#"../" + page#"pages/" + page#' dev/mobile-host.html > "$OUT/host-$NAME.html"
BASE="file://$PWD/$OUT/host-$NAME.html?page=$PAGE${HASH:+&hash=$HASH}"

run() { nice -n 10 "$CHROME" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=4000 "$@" 2>/dev/null; }

# 1) probe
REPORT=$(run --window-size=410,900 --dump-dom "$BASE&h=844&mode=full" | awk '/<pre id="probe">/,/<\/pre>/' | sed 's/.*<pre id="probe">//; s#</pre>.*##; s/&lt;/</g; s/&gt;/>/g; s/&quot;/"/g; s/&amp;/\&/g')
echo "$REPORT"
H=$(printf '%s\n' "$REPORT" | sed -n 's/.* height=\([0-9][0-9]*\).*/\1/p' | head -1)
[ -z "$H" ] && H=4000
[ "$H" -gt 24000 ] && H=24000

# 2) first screen, as a phone sees it
run --force-device-scale-factor=2 --window-size=410,864 --screenshot="$OUT/$NAME-screen.png" "$BASE&h=844&mode=screen" >/dev/null

# 3) whole page, sliced
FULL="$OUT/$NAME-full.png"
run --window-size=410,$((H + 20)) --screenshot="$FULL" "$BASE&h=$H&mode=full" >/dev/null
rm -f "$OUT/$NAME"-seg-*.png
TOTAL=$((H + 20)); SEG=1100; y=20; i=1
while [ "$y" -lt "$TOTAL" ]; do
  # sips silently skips a crop that ends exactly on the image's bottom edge, so stop 1px short
  h=$SEG; [ $((y + h)) -ge "$TOTAL" ] && h=$((TOTAL - y - 1))
  [ "$h" -lt 40 ] && break
  sips -c "$h" 410 --cropOffset "$y" 0 "$FULL" --out "$OUT/$NAME-seg-$(printf '%02d' $i).png" >/dev/null 2>&1
  y=$((y + SEG)); i=$((i + 1))
done
rm -f "$FULL"
echo "files: $OUT/$NAME-screen.png + $((i - 1)) slices $OUT/$NAME-seg-01..$(printf '%02d' $((i - 1))).png (page height ${H}px)"
