#!/bin/bash
# Interaction check: drives the page with real hover/click/keyboard events in
# headless Chrome and prints what happened. Companion to mobile-check.sh, which
# only measures layout.
#
#   bash dev/interact.sh portfolio.html            # desktop width
#   bash dev/interact.sh portfolio.html 390        # phone width
#
# Exits non-zero if any check fails.
set -u
cd "$(dirname "$0")/.." || exit 1
PAGE="${1:-portfolio.html}"
WIDTH="${2:-1200}"
OUT="dev/out"; mkdir -p "$OUT/pages"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

[ -f "$PAGE" ] || { echo "no such page: $PAGE"; exit 1; }

sed 's#</body>#<script src="dev/interact.js"></script></body>#' "$PAGE" \
  > "$OUT/pages/_i-$PAGE"
[ -e "$OUT/pages/assets" ] || ln -s ../../../assets "$OUT/pages/assets" 2>/dev/null
[ -e "$OUT/pages/dev" ] || ln -s ../.. "$OUT/pages/dev" 2>/dev/null

REPORT=$(nice -n 10 "$CHROME" --headless --disable-gpu --hide-scrollbars \
  --virtual-time-budget=6000 --window-size="$WIDTH",900 \
  --dump-dom "file://$PWD/$OUT/pages/_i-$PAGE" 2>/dev/null \
  | awk '/<pre id="probe">/,/<\/pre>/' \
  | sed 's/.*<pre id="probe">//; s#</pre>.*##; s/&lt;/</g; s/&gt;/>/g; s/&quot;/"/g; s/&amp;/\&/g')

if [ -z "$REPORT" ]; then
  echo "interact: no report — the page threw before the probe ran, or the"
  echo "          selectors found nothing. Width=$WIDTH Page=$PAGE"
  exit 1
fi

echo "$REPORT"
echo "$REPORT" | grep -q "0 FAILURES" || exit 1
