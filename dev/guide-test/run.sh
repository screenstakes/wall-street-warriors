#!/bin/bash
# usage: run.sh <html file>   runs the probe at 390px (iframe host) and 1280px, transitions off
set -u
S="$(cd "$(dirname "$0")" && pwd)"; SRC="$1"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
python3 - "$SRC" "$S" <<'PY'
import io,sys
src,S=sys.argv[1],sys.argv[2]
h=io.open(src,encoding="utf-8").read()
inj='<style>*{transition:none !important;animation:none !important}</style><script src="probe.js"></script></body>'
io.open(S+"/page.html","w",encoding="utf-8").write(h.replace("</body>",inj,1))
import os
srcdir=os.path.dirname(os.path.abspath(src))
for d in ("assets",):
    l=os.path.join(S,d)
    if os.path.islink(l) or os.path.exists(l): os.remove(l) if os.path.islink(l) else None
    if os.path.isdir(os.path.join(srcdir,d)): os.symlink(os.path.join(srcdir,d), l)
PY
cat > "$S/host.html" <<'H'
<!doctype html><meta charset=utf-8><body style="margin:0"><iframe src="page.html" style="width:390px;height:900px;border:0"></iframe><pre id="r">waiting</pre>
<script>addEventListener("message",function(e){if(e.data&&e.data.siteProbe)document.getElementById("r").textContent=e.data.siteProbe})</script>
H
extract() { python3 -c "import sys,re,html;t=sys.stdin.read();m=re.findall(r'<pre id=\"(?:r|probe-result)\">(.*?)</pre>',t,re.S);print(html.unescape(m[-1]) if m else 'NO RESULT')"; }
echo "---- phone 390px ----"
"$CHROME" --headless --disable-gpu --allow-file-access-from-files --virtual-time-budget=30000 --window-size=500,1000 --dump-dom "file://$S/host.html" 2>/dev/null | extract
echo "---- small phone 320px ----"
sed 's/width:390px/width:320px/' "$S/host.html" > "$S/host320.html"
"$CHROME" --headless --disable-gpu --allow-file-access-from-files --virtual-time-budget=30000 --window-size=500,1000 --dump-dom "file://$S/host320.html" 2>/dev/null | extract | head -1
echo "---- desktop 1280px ----"
"$CHROME" --headless --disable-gpu --virtual-time-budget=30000 --window-size=1280,1000 --dump-dom "file://$S/page.html" 2>/dev/null | extract
