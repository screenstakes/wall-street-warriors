#!/usr/bin/env bash
# Render a page at the widths Michael actually uses, and crop a band so the result is
# quick to look at. Written 2026-10-14: the dashboard was silently truncating a tile
# subtitle at ordinary desktop widths and NO automated check caught it. scrollWidth
# equalled clientWidth, the audit passed, and it was only visible to an eye.
#
#   dev/render_widths.sh index.html            # whole page, 3 widths
#   dev/render_widths.sh index.html 120 275    # crop a 120px band starting 275px down
#
# LOOK AT THE OUTPUT. That is the entire point of this script.
set -euo pipefail
PAGE="${1:-index.html}"; BAND="${2:-}"; TOP="${3:-0}"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="${TMPDIR:-/tmp}/render_widths"; mkdir -p "$OUT"; rm -f "$OUT"/*.png
cd "$(dirname "$0")/.."
for W in 1280 1440 1600; do
  "$CH" --headless --disable-gpu --screenshot="$OUT/w$W.png" --window-size="$W,1000" \
        --hide-scrollbars --virtual-time-budget=4000 "file://$PWD/$PAGE" 2>/dev/null
  if [ -n "$BAND" ]; then
    ffmpeg -loglevel error -y -i "$OUT/w$W.png" -vf "crop=$((W-280)):$BAND:140:$TOP" "$OUT/band$W.png"
  fi
done
if [ -n "$BAND" ]; then
  ffmpeg -loglevel error -y -i "$OUT/band1280.png" -i "$OUT/band1440.png" -i "$OUT/band1600.png" \
    -filter_complex "[0]pad=1320:$BAND:0:0:white[a];[1]pad=1320:$BAND:0:0:white[b];[a][b][2]vstack=3" \
    "$OUT/stack.png"
  echo "$OUT/stack.png   (1280 / 1440 / 1600, top to bottom)"
else
  ls "$OUT"/w*.png
fi
