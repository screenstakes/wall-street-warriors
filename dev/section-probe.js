/* Section probe: lists every top-level card/section on the page with its rendered height, so we can see what makes
   a phone page long. Reports through the harness's postMessage channel. */
setTimeout(function () {
  var main = document.querySelector("main") || document.body;
  var rows = [];
  var seen = new Set();
  Array.prototype.forEach.call(main.querySelectorAll(".card, section, .tiles, .page-title, .season, details"), function (el) {
    if (seen.has(el)) return;
    /* only outermost: skip anything inside an already-listed element */
    for (var p = el.parentElement; p && p !== main; p = p.parentElement) { if (seen.has(p)) return; }
    var r = el.getBoundingClientRect();
    if (r.height < 20 || getComputedStyle(el).display === "none") return;
    seen.add(el);
    var h = el.querySelector("h1,h2,h3,summary,.k") || el;
    var label = (h.textContent || "").trim().replace(/\s+/g, " ").slice(0, 42);
    rows.push({ y: Math.round(r.top + window.scrollY), h: Math.round(r.height), label: label, cls: (el.className || "").toString().split(/\s+/).slice(0, 2).join(".") });
  });
  rows.sort(function (a, b) { return a.y - b.y; });
  var total = document.documentElement.scrollHeight, vh = 844;
  var out = ["PAGE height=" + total + "px screens=" + (total / vh).toFixed(1)];
  rows.forEach(function (r) { out.push(String(r.h).padStart(5) + "px  " + (r.h / vh).toFixed(1) + "scr  y=" + String(r.y).padStart(5) + "  " + r.label + "  [" + r.cls + "]"); });
  try { window.parent.postMessage({ wswProbe: out.join("\n") }, "*"); } catch (e) {}
}, 2200);
