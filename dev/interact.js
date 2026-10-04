/* Interaction probe. Injected into a page copy by dev/interact.sh.
   Drives the portfolio pie the way a person would and reports what happened,
   so hover/click/keyboard behaviour is verified by execution rather than by
   reading the source.

   Reports to document.title and to <pre id="probe">, same contract as probe.js. */
setTimeout(function () {
  var out = [], fails = 0;

  function ck(cond, msg) {
    out.push((cond ? "  ok   " : "  FAIL ") + msg);
    if (!cond) fails++;
  }
  function q(s) { return document.querySelector(s); }
  function qa(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function fire(el, type, extra) {
    var ev = new MouseEvent(type, Object.assign(
      { bubbles: true, cancelable: true, view: window }, extra || {}));
    el.dispatchEvent(ev);
  }
  function key(el, k) {
    el.dispatchEvent(new KeyboardEvent("keydown",
      { key: k, bubbles: true, cancelable: true }));
  }

  var wedges = qa(".pie .wedge");
  out.push("segments");
  ck(wedges.length >= 15, wedges.length + " wedges rendered");

  // every wedge must be reachable and announced
  var focusable = wedges.filter(function (w) { return w.getAttribute("tabindex") === "0"; });
  ck(focusable.length === wedges.length, "every wedge is keyboard focusable");
  var labelled = wedges.filter(function (w) {
    return (w.getAttribute("aria-label") || "").length > 6;
  });
  ck(labelled.length === wedges.length, "every wedge has an aria-label");
  var roled = wedges.filter(function (w) { return w.getAttribute("role") === "button"; });
  ck(roled.length === wedges.length, "every wedge is role=button");

  // hit area: the transparent hit path must be wider than the painted arc
  out.push("");
  out.push("hit targets");
  var hits = qa(".pie .hit");
  ck(hits.length === wedges.length, "a hit path exists for every wedge");
  var small = wedges.filter(function (w) {
    var r = w.getBoundingClientRect();
    return Math.max(r.width, r.height) < 24;
  });
  ck(small.length === 0, small.length + " wedges under 24px in their largest dimension");

  // hover
  out.push("");
  out.push("hover");
  var target = hits[3] || hits[0];
  var owner = document.getElementById(target.getAttribute("data-for"));
  fire(target, "pointerover");
  fire(target, "mouseover");
  var hovered = owner && owner.classList.contains("is-hot");
  ck(hovered, "hovering a wedge marks it hot");
  var tip = q(".pietip");
  ck(tip && !tip.hasAttribute("hidden"), "a tooltip appears on hover");
  if (tip) {
    var txt = (tip.textContent || "").trim();
    ck(txt.length > 4, "the tooltip has content: " + JSON.stringify(txt.slice(0, 48)));
    ck(/\$/.test(txt), "the tooltip leads with a value");
  }
  fire(target, "mouseout");
  fire(target, "pointerout");
  ck(!owner.classList.contains("is-hot"), "leaving clears the hot state");
  ck(tip.hasAttribute("hidden"), "leaving hides the tooltip");

  // click -> description
  out.push("");
  out.push("click selects and describes");
  var before = q(".detail") ? q(".detail").textContent.trim() : "";
  fire(hits[5] || hits[0], "click");
  var sel = qa(".pie .wedge.is-sel");
  ck(sel.length === 1, "exactly one wedge is selected after a click (" + sel.length + ")");
  var det = q(".detail");
  ck(det && det.textContent.trim().length > 20, "the detail panel filled in");
  ck(det && det.textContent.trim() !== before, "the detail panel actually changed");
  var selName = sel[0] ? sel[0].getAttribute("data-name") : "";
  ck(det && selName && det.textContent.indexOf(selName) >= 0,
     "the panel names the clicked slice (" + selName + ")");

  // clicking a different slice moves the selection
  fire(hits[9] || hits[1], "click");
  var sel2 = qa(".pie .wedge.is-sel");
  ck(sel2.length === 1, "still exactly one selection after a second click");
  ck(sel2[0] !== sel[0], "the selection moved to the new slice");

  // keyboard
  out.push("");
  out.push("keyboard");
  var w0 = wedges[0];
  w0.focus();
  ck(document.activeElement === w0, "a wedge can take focus");
  key(w0, "Enter");
  ck(w0.classList.contains("is-sel"), "Enter selects the focused wedge");
  key(w0, "ArrowRight");
  ck(document.activeElement !== w0 || wedges.length === 1,
     "ArrowRight moves focus along the pie");

  // legend stays in sync
  out.push("");
  out.push("legend and table");
  var keys = qa(".plegend [data-jump]");
  ck(keys.length >= 4, keys.length + " legend entries");
  var rows = qa("table tbody tr");
  ck(rows.length >= 15, rows.length + " table rows — every slice reachable without hovering");

  // the now/later split must not be colour-alone
  out.push("");
  out.push("status encoding");
  var later = qa('.pie .wedge[data-when="later"]');
  ck(later.length > 0, later.length + " wedges marked not-yet");
  var textured = later.filter(function (w) {
    // the fill now comes from a class, so check the computed value
    return /url\(/.test(getComputedStyle(w).fill || "");
  });
  ck(textured.length === later.length,
     "every not-yet wedge carries a texture, so status is not colour-alone");

  out.push("");
  out.push("================================================");
  out.push("  " + (out.filter(function (l) { return /^  (ok|FAIL)/.test(l); }).length) +
           " checks, " + fails + " FAILURES");
  out.push("================================================");

  var pre = document.createElement("pre");
  pre.id = "probe";
  pre.textContent = out.join("\n");
  document.body.appendChild(pre);
  document.title = fails ? "INTERACT FAIL " + fails : "INTERACT OK";
}, 600);
