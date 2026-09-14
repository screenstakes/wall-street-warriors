/* Mobile probe. Injected into a page copy by dev/mobile-check.sh.
   FAIL  overflow  : a visible element sticks out past the viewport (intentional scrollers are measured as containers only)
   FAIL  zoom      : a text input/select/textarea under 16px (iOS Safari zooms the page when it's focused)
   WARN  tap       : a button/control shorter than 36px (hard to hit with a thumb)
   WARN  tiny      : text rendered under 10px
   Reports to the host through postMessage and to document.title. */
setTimeout(function () {
  var de = document.documentElement, vw = de.clientWidth;
  var SCROLLERS = ".strip, .table-wrap, .tabs, .nav";
  function shown(e) {
    if (e.closest('.drawer:not(.is-open), .msheet:not(.is-open), [hidden]')) return false;
    var cs = getComputedStyle(e);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    var r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }
  function name(e) {
    var cls = (typeof e.className === "string" && e.className.trim()) ? "." + e.className.trim().split(/\s+/).slice(0, 3).join(".") : "";
    var txt = (e.textContent || "").trim().replace(/\s+/g, " ").slice(0, 32);
    return e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") + cls + (txt ? ' "' + txt + '"' : "");
  }
  var over = [], zoom = [], tap = [], tiny = [];

  Array.prototype.forEach.call(document.querySelectorAll("body *"), function (e) {
    if (e.parentElement && e.parentElement.closest(SCROLLERS)) return; /* inside a deliberate scroller */
    if (e.closest("#dbg")) return;
    if (!shown(e)) return;
    var r = e.getBoundingClientRect();
    if (r.right > vw + 1 || r.left < -1) over.push("right=" + Math.round(r.right) + " " + name(e));
  });

  Array.prototype.forEach.call(document.querySelectorAll('input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=hidden]), select, textarea'), function (e) {
    if (!shown(e)) return;
    var fs = parseFloat(getComputedStyle(e).fontSize);
    if (fs < 16) zoom.push(fs + "px " + name(e));
  });

  Array.prototype.forEach.call(document.querySelectorAll('button, .btn, select, .tab, input[type=checkbox], input[type=radio]'), function (e) {
    if (e.closest(".strip")) return;
    var target = (e.type === "checkbox" || e.type === "radio") ? (e.closest("label") || e) : e;
    if (!shown(target)) return;
    var r = target.getBoundingClientRect();
    if (r.height < 36) tap.push(Math.round(r.height) + "px tall " + name(e));
  });

  var seen = new Set();
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  while (walker.nextNode()) {
    var t = walker.currentNode, p = t.parentElement;
    if (!p || !t.textContent.trim() || seen.has(p)) continue;
    seen.add(p);
    if (p.closest("script, style, #dbg") || !shown(p)) continue;
    var fs = parseFloat(getComputedStyle(p).fontSize);
    if (fs < 10) tiny.push(fs + "px " + name(p));
  }

  var fail = over.length + zoom.length;
  var out = [
    "RESULT " + (fail ? "FAIL" : "OK") + " overflow=" + over.length + " zoom=" + zoom.length + " tap<36=" + tap.length + " tiny<10=" + tiny.length,
    "viewport=" + vw + " scrollWidth=" + de.scrollWidth + " height=" + de.scrollHeight
  ];
  function block(title, arr) { if (arr.length) { out.push("-- " + title + " (" + arr.length + ")"); arr.slice(0, 14).forEach(function (s) { out.push("   " + s); }); } }
  block("OVERFLOW", over); block("ZOOM", zoom); block("TAP", tap); block("TINY", tiny);
  var msg = out.join("\n");
  try { window.parent.postMessage({ wswProbe: msg }, "*"); } catch (err) {}
  document.title = "PROBE " + (fail ? "FAIL" : "OK");
}, 1800);
