#!/usr/bin/env python3
"""Text clipped by an ancestor with overflow:hidden.

    python3 dev/check_clipping.py index.html 1280 1440 1600

KNOWN LIMITATION, AND THE REASON THIS FILE IS KEPT: on 2026-10-14 the dashboard
was visibly cutting a tile subtitle to "Trading Notes Analysis next, O" and THIS
SCRIPT REPORTED ZERO. The element sized itself to its own text, so scrollWidth
equalled clientWidth and nothing looked overflowing from the DOM's point of view.

So do not trust a clean run here as proof that nothing is cut. It catches the
easy case. For the hard case the only reliable guards are a CSS policy check in
audit_site.py (tile subtitles must wrap, never nowrap+ellipsis) and looking at
dev/render_widths.sh output with your eyes.
"""
import subprocess, sys, re, json
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
S="/private/tmp/claude-501/-Users-fitz-4k-Downloads-VSC-Folder/856ab4b1-bc83-4fd3-a644-d885cc572995/scratchpad"
JS = r"""
<script>
addEventListener('load', function(){ setTimeout(function(){
  function clipper(el){
    for (var p = el.parentElement; p; p = p.parentElement){
      var o = getComputedStyle(p);
      if (o.overflowX === 'hidden' || o.overflowX === 'clip' || o.overflow === 'hidden') return p;
    }
    return null;
  }
  var out = [];
  document.querySelectorAll('*').forEach(function(e){
    if (e.children.length) return;
    var t = (e.textContent||'').trim(); if (!t) return;
    var cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    var r = e.getBoundingClientRect(); if (!r.width) return;
    var anc = clipper(e); if (!anc) return;
    var ar = anc.getBoundingClientRect();
    var over = r.right - ar.right;
    // ellipsis engaged = element is clipped BY ITSELF and shows a cue; that is fine.
    if (cs.textOverflow === 'ellipsis' && e.scrollWidth > e.clientWidth + 1) return;
    if (over > 1.5){
      out.push({cls:(typeof e.className==='string'?e.className:e.tagName),
                over:Math.round(over), txt:t.slice(0,44)});
    }
  });
  document.title = 'CLIP2=' + JSON.stringify(out).slice(0,1500);
}, 500); });
</script>"""
page = sys.argv[1]
open(f"{S}/c2_{page}","w").write(open(page).read().replace("</body>", JS+"</body>"))
bad = 0
for w in [int(x) for x in sys.argv[2:]]:
    dom = subprocess.run([CH,"--headless","--disable-gpu",f"--window-size={w},1300",
                          "--virtual-time-budget=4500","--dump-dom",f"file://{S}/c2_{page}"],
                         capture_output=True, text=True).stdout
    m = re.search(r"<title>CLIP2=(.*?)</title>", dom, re.S)
    items = json.loads(m.group(1)) if m else []
    bad += len(items)
    print(f"  {w:>5}px  {len(items)} clipped" + ("" if items else "  ok"))
    for it in items[:5]:
        print(f"          .{str(it['cls'])[:26]:<26} +{it['over']}px  \"{it['txt']}\"")
sys.exit(1 if bad else 0)
