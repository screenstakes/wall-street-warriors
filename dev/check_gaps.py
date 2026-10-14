#!/usr/bin/env python3
"""Find top-level page sections that sit flush against each other.

Written 2026-10-14. A performance card was added to the dashboard with no bottom
margin, so the grid beneath it touched it with a zero-pixel gap. It looked wrong
immediately to a person and was invisible to every other check in dev/audit_site.py,
which reads markup and never measures layout.

    python3 dev/check_gaps.py                # every page with a <main class="shell">
    python3 dev/check_gaps.py index.html     # one page
"""
import glob, json, os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
WIDTHS = (1280, 1440, 1600)
MIN_GAP = 8          # visual gap, content edge to content edge, below which it reads as stuck

JS = """<script>
addEventListener('load', function(){ setTimeout(function(){
  var main = document.querySelector('main.shell');
  if (!main) { document.title = 'GAPS=[]'; return; }
  var kids = [].filter.call(main.children, function(e){
    var cs = getComputedStyle(e);
    return cs.display !== 'none' && e.getBoundingClientRect().height > 0;
  });
  var out = [], prev = null, prevLabel = null, prevPadBottom = 0;
  kids.forEach(function(e){
    var r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    var label = e.tagName.toLowerCase() + (e.className ? '.' + String(e.className).split(' ').slice(0,2).join('.') : '');
    if (prev !== null){
      // What the eye sees is content edge to content edge. A section whose own padding
      // does the separating is NOT flush, even though its border boxes touch -- that is
      // how calendar.html's legend (14px padding-top, 0px box gap) read as a false alarm.
      var visual = (r.top - prev) + parseFloat(cs.paddingTop || 0) + prevPadBottom;
      out.push({a: prevLabel, b: label, gap: Math.round(visual), box: Math.round(r.top - prev)});
    }
    prev = r.bottom; prevLabel = label; prevPadBottom = parseFloat(cs.paddingBottom || 0);
  });
  document.title = 'GAPS=' + JSON.stringify(out);
}, 2500); });
</script>"""
CSS = "<style>.reveal{animation:none!important;opacity:1!important;transform:none!important}</style>"

pages = sys.argv[1:] or sorted(os.path.basename(p) for p in glob.glob(os.path.join(ROOT, "*.html")))
fails = 0
for page in pages:
    src = os.path.join(ROOT, page)
    if not os.path.exists(src):
        continue
    body = open(src, encoding="utf-8").read()
    if 'class="shell"' not in body and "main class=" not in body:
        pass
    probe = os.path.join(ROOT, "_gapprobe.html")
    open(probe, "w", encoding="utf-8").write(
        body.replace("</head>", CSS + "</head>").replace("</body>", JS + "</body>"))
    try:
        worst = {}
        for w in WIDTHS:
            dom = subprocess.run(
                [CH, "--headless", "--disable-gpu", f"--window-size={w},1200",
                 "--virtual-time-budget=6000", "--dump-dom", f"file://{probe}"],
                capture_output=True, text=True).stdout
            m = re.search(r"<title>GAPS=(.*?)</title>", dom, re.S)
            if not m:
                continue
            for item in json.loads(m.group(1)):
                key = (item["a"], item["b"])
                if key not in worst or item["gap"] < worst[key][0]:
                    worst[key] = (item["gap"], w)
    finally:
        if os.path.exists(probe):
            os.remove(probe)
    bad = {k: v for k, v in worst.items() if v[0] < MIN_GAP}
    if not worst:
        continue
    if bad:
        fails += len(bad)
        print(f"  FAIL  {page}")
        for (a, b), (gap, w) in sorted(bad.items(), key=lambda x: x[1][0]):
            print(f"          {gap:>3}px between {a}  and  {b}   (at {w}px)")
    else:
        print(f"  ok    {page}  ({len(worst)} section gaps, min "
              f"{min(v[0] for v in worst.values())}px)")

print(f"\n  {fails} flush section pair(s)")
sys.exit(1 if fails else 0)
