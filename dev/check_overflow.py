#!/usr/bin/env python3
"""Does any element stick out past the viewport at phone width?

    python3 dev/check_overflow.py oct15.html oct14-report.html

Forces the document to 390px and reports every element whose right edge passes
it. Chrome headless clamps its own viewport to 500px, so forcing the width is
the only way to test a real phone size.

Run this from the repo root. A copy in a scratch directory cannot resolve
assets/site.css and renders an unstyled page that looks broken for no reason.
"""
import subprocess, sys, re
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
S="/private/tmp/claude-501/-Users-fitz-4k-Downloads-VSC-Folder/856ab4b1-bc83-4fd3-a644-d885cc572995/scratchpad"
JS = """
<script>
var over=[];
document.querySelectorAll('*').forEach(function(e){
  var r=e.getBoundingClientRect();
  if(r.right > 390+1.5 && r.width>0){
    over.push(e.tagName+'.'+(typeof e.className==='string'?e.className:'')+'@'+Math.round(r.right));
  }
});
document.title='SCROLLW='+document.documentElement.scrollWidth+' VIEW='+390+' NOVER='+over.length+' :: '+over.slice(0,8).join(' | ');
</script>
"""
for f in sys.argv[1:]:
    src=open(f).read()
    out=f"{S}/m_{f}"
    open(out,"w").write(src.replace("</head>", "<style>html,body{width:390px!important;max-width:390px!important}</style></head>").replace("</body>", JS+"</body>"))
    dom=subprocess.run([CH,"--headless","--disable-gpu","--window-size=500,900",
                        "--virtual-time-budget=3000","--dump-dom",f"file://{out}"],
                       capture_output=True,text=True).stdout
    m=re.search(r"<title>(.*?)</title>", dom, re.S)
    print(f"{f:<14} {m.group(1).strip() if m else 'NO TITLE'}")
