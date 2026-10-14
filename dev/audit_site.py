#!/usr/bin/env python3
"""Audit the whole team site as a new reader would hit it, not as a diff.

Written 2026-10-14 after a pass that verified its own edits carefully and still
shipped a meeting agenda that nothing linked to. Checking what you changed cannot
find what is missing. Run this before telling Michael anything is done.

    python3 dev/audit_site.py            # from the repo root
    python3 dev/audit_site.py --quiet    # failures only
"""
import os, re, sys, html, html.parser, datetime, glob, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TODAY = datetime.date(2026, 10, 14)
QUIET = "--quiet" in sys.argv

FAILS, WARNS, OKS = [], [], []
def fail(c, m): FAILS.append((c, m))
def warn(c, m): WARNS.append((c, m))
def ok(c, m): OKS.append((c, m))

pages = sorted(os.path.basename(p) for p in glob.glob(os.path.join(ROOT, "*.html")))
TEXT = {p: open(os.path.join(ROOT, p), encoding="utf-8").read() for p in pages}
def strip(s): return " ".join(re.sub(r"<[^>]*>", " ", s).split())
def no_script(s):
    """Drop <script> bodies. Their string concatenation looks like markup and like hrefs."""
    return re.sub(r"<script\b[^>]*>.*?</script>", " ", s, flags=re.S | re.I)

# Pages that are deliberately not linked from anywhere: personal run-of-show pages and
# Michael-only reports. They are reached by a link handed straight to him.
PERSONAL = {p for p in pages if p.endswith("-me.html")} | {"oct14-report.html"}
# Retrospective pages whose whole job is to quote what used to be wrong. Exempt from the
# bad-figure and tense checks, because naming the old error IS the content.
RETRO = {"oct14-report.html", "oct14-numbers.html"}

# Pages deliberately left unlinked. library.html states the rule out loud: "a page is in this
# library only if it is the current version and somebody still needs it... a link to a stale
# page is worse than no link." Each one is named here so the decision is visible and a page
# that falls out of the nav by ACCIDENT still fails this audit.
RETIRED = {
    "caleb-meetings.html": "a redirect stub to minutes.html",
    "fixes.html":          "Google Sheets repair steps; the sheets are retired",
    "portalfix.html":      "Google Sheets repair steps; the sheets are retired",
    "plan.html":           "the plan to Sep 28, superseded by the orders that filled",
    "warren-check.html":   "a one-off school-network test for Warren's hostnames",
}

# ---------------------------------------------------------------- 1. every internal link resolves
for p, s in TEXT.items():
    for href in set(re.findall(r'href="([^"#?][^"]*)"', no_script(s))):
        if href.startswith(("http://", "https://", "mailto:", "tel:", "//", "#", "data:", "javascript:")):
            continue
        target = href.split("#")[0].split("?")[0]
        if not target:
            continue
        if not os.path.exists(os.path.join(ROOT, target)):
            fail("dead link", f"{p} -> {target}")
if not [f for f in FAILS if f[0] == "dead link"]:
    ok("links", f"every internal link on {len(pages)} pages resolves")

# ---------------------------------------------------------------- 2. orphans: reachable from anywhere?
inbound = {p: 0 for p in pages}
for p, s in TEXT.items():
    for href in set(re.findall(r'href="([^"#?][^"]*)"', no_script(s))):
        t = href.split("#")[0]
        if t in inbound and t != p:
            inbound[t] += 1
for p, n in sorted(inbound.items()):
    if n == 0 and p not in PERSONAL and p not in RETIRED and p != "index.html":
        fail("orphan", f"{p} is not linked from any other page — library.html is the index of record")
if not [f for f in FAILS if f[0] == "orphan"]:
    ok("orphans", f"every shared page is reachable ({len(RETIRED)} retired + {len(PERSONAL)} personal "
                  "are unlinked on purpose and named in this script)")

# ---------------------------------------------------------------- 3. countdowns pointing at the past
dj = open(os.path.join(ROOT, "assets", "data.js"), encoding="utf-8").read()
events = dict(re.findall(r'id:\s*"([^"]+)",\s*date:\s*"(\d{4}-\d{2}-\d{2})', dj))
for p, s in TEXT.items():
    for m in re.finditer(r'daysUntil\(\s*W\.eventById\("([^"]+)"\)', s):
        eid = m.group(1)
        d = events.get(eid)
        if d and datetime.date.fromisoformat(d) < TODAY:
            fail("stale countdown", f"{p} counts down to '{eid}' ({d}), which is in the past")
if not [f for f in FAILS if f[0] == "stale countdown"]:
    ok("countdowns", "no page counts down to a date that has passed")

# ---------------------------------------------------------------- 4. figures that are known wrong
BAD = {
    "1,017.58": "price-improvement figure that subtracts two differently-defined totals (real: $488.90)",
    "BIL 492": "BIL was keyed at 450, not 492",
    "7,774.89": "superseded cash figure — must only appear while explaining the $8,267.06 settle",
}
for p, s in TEXT.items():
    if p in RETRO: continue
    plain = strip(s)
    for bad, why in BAD.items():
        if bad in plain:
            if bad == "7,774.89" and ("8,267.06" in plain or "492.17" in plain):
                continue                                   # explained, not asserted
            if bad == "BIL 492" and "450" in plain:
                continue                                   # historical, with the correction beside it
            fail("bad figure", f"{p} contains '{bad}' — {why}")
if not [f for f in FAILS if f[0] == "bad figure"]:
    ok("figures", "no page asserts a figure known to be wrong")

# ---------------------------------------------------------------- 4b. claims superseded by new evidence
# Each entry is a claim the site used to make that is now known to be false. Michael's
# screenshot of the team thread on 2026-10-14 settled the first one: the Oct 11 call was
# cancelled at 7:56pm with 4 of 5 unable to attend, so it was never held rather than held
# and unrecorded. Pages had said nobody knew.
SUPERSEDED = [
    (r"Pile C moves on (three )?triggers|(a|the) (rule|trigger) we already wrote|"
     r"we wrote (a|the) rule|rule we wrote|our own trigger says",
     "the Pile C trigger was DRAFTED on Oct 5 and never voted on — no page may present it as "
     "settled, agreed, or something the team wrote"),
    (r"Oct 11 call,? which nobody wrote up|nobody wrote up the (Sunday )?Oct 11|"
     r"Oct 11 call (that )?was never written up|Oct 11.{0,40}no record anywhere",
     "the Oct 11 call was CANCELLED (4 of 5 out, 7:56pm) — it was never held, not unrecorded"),
]
# Some patterns describe a claim only when it is ABOUT the thing in question. "your own
# trigger says" on oct4-me is a personal deadline, not Pile C; "a rule we wrote turning out
# to be one we cannot follow" on answers.html is generic prose. Require the Pile C / VOO
# trigger patterns to sit near their subject before failing.
NEEDS_CONTEXT = {0: ("pile c", "voo", "641.09")}   # index 0 is the Pile C trigger rule
for p, s_ in TEXT.items():
    if p in RETRO: continue
    plain = strip(s_)
    for idx, (pat, why) in enumerate(SUPERSEDED):
        for m in re.finditer(pat, plain, re.I):
            near = plain[max(0, m.start() - 300): m.end() + 300].lower()
            words = NEEDS_CONTEXT.get(idx)
            if words and not any(w in near for w in words):
                continue
            fail("superseded claim", f"{p}: {why}")
            break
if not [f for f in FAILS if f[0] == "superseded claim"]:
    ok("claims", "no page repeats a claim later evidence disproved")

# ---------------------------------------------------------------- 5. future tense about things that happened
PAST = [
    (r"fills? at Thursday'?s? open", "the orders filled Oct 8"),
    (r"filling Thursday", "the orders filled Oct 8"),
    (r"sit queued until", "the orders filled Oct 8"),
    (r"Keying is Wed", "keying happened Oct 7"),
    (r"This week Oct 5", "that week is over"),
]
for p, s in TEXT.items():
    if p in RETRO: continue
    plain = strip(s)
    for pat, why in PAST:
        if re.search(pat, plain, re.I):
            fail("future tense", f"{p}: /{pat}/ — {why}")
if not [f for f in FAILS if f[0] == "future tense"]:
    ok("tense", "no page describes a past event as upcoming")

# ---------------------------------------------------------------- 6. dated agenda pages carry a banner
# Only MEETING AGENDA pages need a status banner: they narrate an event, so they rot the
# moment it happens. A name is an agenda if it is a bare date, optionally with "-me".
# Minutes are records and do not rot. Reference pages (-plan, -numbers, -build, -report)
# are dated by their content, not by an event, and carry their own "written Oct 14" footer.
dated = [p for p in pages if re.match(r"(sep|oct)\d+(-me)?\.html$", p)]
for p in dated:
    if 'class="superseded"' not in TEXT[p]:
        warn("no banner", f"{p} is a dated page with no status banner")
if not [w for w in WARNS if w[0] == "no banner"]:
    ok("banners", f"all {len(dated)} dated pages carry a status banner")

# ---------------------------------------------------------------- 7. markup is well formed
VOID = {"meta", "br", "img", "link", "hr", "input", "source", "col", "area", "base", "embed", "param", "track", "wbr"}
class P(html.parser.HTMLParser):
    def __init__(self): super().__init__(); self.st = []; self.bad = []
    def handle_starttag(self, t, a):
        if t not in VOID: self.st.append(t)
    def handle_endtag(self, t):
        if self.st and self.st[-1] == t: self.st.pop()
        elif t in self.st:
            while self.st and self.st.pop() != t: pass
            self.bad.append(t)
        else: self.bad.append(t)
for p, s in TEXT.items():
    q = P()
    try: q.feed(s)
    except Exception as e: fail("markup", f"{p}: parser error {e}"); continue
    if q.st or q.bad:
        fail("markup", f"{p}: unclosed={q.st[:4]} mismatched={q.bad[:4]}")
if not [f for f in FAILS if f[0] == "markup"]:
    ok("markup", f"all {len(pages)} pages are well formed")

# ---------------------------------------------------------------- 7b. CSS that truncates silently
# `.tile .sub` carried white-space:nowrap + text-overflow:ellipsis. At ordinary desktop
# widths that cut "Trading Notes Analysis next, Oct 23" down to "...next, O" with no visible
# ellipsis, and no automated check noticed because the element reported no scroll overflow.
# The only reliable guard is the policy itself: those subtitles wrap, they do not truncate.
CSS_PATH = os.path.join(ROOT, "assets", "site.css")
if os.path.exists(CSS_PATH):
    css = open(CSS_PATH, encoding="utf-8").read()
    m = re.search(r"\.tile\s+\.sub\s*\{([^}]*)\}", css)
    if not m:
        fail("css policy", "assets/site.css has no `.tile .sub` rule to check")
    elif "white-space:nowrap" in m.group(1).replace(" ", ""):
        fail("css policy", "`.tile .sub` uses white-space:nowrap — tile subtitles must wrap, "
                           "not truncate; this silently cut text on the dashboard")
    else:
        ok("css policy", "tile subtitles wrap rather than truncate")

# ---------------------------------------------------------------- 8. the questions a reader arrives with
MUST = [
    ("index.html", "How the portfolio is doing", "the dashboard says how the portfolio is doing"),
    ("index.html", 'href="oct15.html"', "the dashboard links the next meeting"),
    ("now.html", 'href="oct15.html"', "the status page links the next meeting"),
]
for p, needle, why in MUST:
    if p in TEXT and needle in TEXT[p]: ok("content", why)
    else: fail("content", f"{p} is missing: {why}")

# ---------------------------------------------------------------- 9. generated pages match their builders
GEN = os.path.join(os.path.dirname(ROOT), "agentic-os", "projects", "wharton-team-docs")
if os.path.isdir(GEN):
    import subprocess, tempfile, shutil
    with tempfile.TemporaryDirectory() as td:
        for f in glob.glob(os.path.join(ROOT, "*.html")): shutil.copy(f, td)
        shutil.copytree(os.path.join(ROOT, "assets"), os.path.join(td, "assets"), dirs_exist_ok=True)
        r = True
        for mod in ("portfolio", "keying"):
            r &= subprocess.run([sys.executable, os.path.join(GEN, mod, "build.py"), "--out", td],
                                capture_output=True).returncode == 0
        subprocess.run([sys.executable, os.path.join(GEN, "nav", "build_nav.py"), "--out", td],
                       capture_output=True)
        for mod in ("portfolio", "keying"):
            a, b = os.path.join(td, mod + ".html"), os.path.join(ROOT, mod + ".html")
            if open(a, encoding="utf-8").read() != open(b, encoding="utf-8").read():
                fail("generator drift", f"{mod}.html differs from what its builder produces — "
                                        "someone edited the HTML instead of the data (see BUILD-ORDER.md)")
            else:
                ok("generator", f"{mod}.html is exactly what its builder produces")
else:
    warn("generator", "agentic-os not found beside this repo; skipped the builder check")

# ---------------------------------------------------------------- report
W = 13
if not QUIET:
    for c, m in OKS: print(f"  \033[32mok\033[0m   {c:<{W}} {m}")
for c, m in WARNS: print(f"  \033[33mwarn\033[0m {c:<{W}} {m}")
for c, m in FAILS: print(f"  \033[31mFAIL\033[0m {c:<{W}} {m}")
print(f"\n  {len(pages)} pages · {len(OKS)} ok · {len(WARNS)} warnings · {len(FAILS)} FAILURES")
sys.exit(1 if FAILS else 0)
