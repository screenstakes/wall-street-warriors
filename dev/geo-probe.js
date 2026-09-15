/* Desktop geometry probe: records the position and size of every visible text-bearing element once animations
   have settled, keyed by tag + text + occurrence. Two runs (old vs new) are compared with dev/geo-compare.js to prove
   a change didn't move anything on desktop. The ticker strip is skipped because it animates. */
setTimeout(function () {
  var out = {}, count = {};
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  var seen = new Set();
  while (walker.nextNode()) {
    var p = walker.currentNode.parentElement;
    if (!p || seen.has(p) || !walker.currentNode.textContent.trim()) continue;
    seen.add(p);
    if (p.closest("script,style,.strip,#geo")) continue;
    var cs = getComputedStyle(p), r = p.getBoundingClientRect();
    if (cs.display === "none" || cs.visibility === "hidden" || r.width === 0 || r.height === 0) continue;
    var text = p.textContent.trim().replace(/\s+/g, " ").slice(0, 60);
    var base = p.tagName.toLowerCase() + "|" + text;
    count[base] = (count[base] || 0) + 1;
    out[base + "|" + count[base]] = [Math.round(r.left), Math.round(r.top + window.scrollY), Math.round(r.width), Math.round(r.height)];
  }
  var pre = document.createElement("pre"); pre.id = "geo"; pre.style.display = "none";
  pre.textContent = JSON.stringify(out);
  document.body.appendChild(pre);
}, 4000);
