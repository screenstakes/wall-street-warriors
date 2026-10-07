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
  // the card clips overflow, so the tooltip must stay inside the stage for
  // EVERY wedge, not just the one we happened to hover
  out.push("");
  out.push("tooltip stays inside the card");
  var stage = q(".piestage"), sb = stage.getBoundingClientRect();
  var escaped = [], tested = 0;
  // Sweep the pointer right across the stage for every wedge. Firing at each
  // wedge's bounding-box centre never reaches the edges, which is exactly
  // where the clamp fails — an earlier version of this check passed against
  // the known-broken build because of that.
  hits.forEach(function (hh, i) {
    for (var f = 0; f <= 1.0001; f += 0.125) {
      var px = sb.left + sb.width * f;
      var py = sb.top + sb.height * (f < 0.5 ? 0.12 : 0.88);
      fire(hh, "pointerover", { clientX: px, clientY: py });
      fire(hh, "pointermove", { clientX: px, clientY: py });
      var t = tip.getBoundingClientRect();
      tested++;
      if (t.left < sb.left - 1 || t.right > sb.right + 1 ||
          t.top < sb.top - 1 || t.bottom > sb.bottom + 1) {
        escaped.push("w" + i + "@" + f.toFixed(3) +
          " L" + Math.round(t.left - sb.left) + " R" + Math.round(t.right - sb.right) +
          " T" + Math.round(t.top - sb.top) + " B" + Math.round(t.bottom - sb.bottom));
      }
    }
    fire(hh, "pointerout");
  });
  ck(escaped.length === 0,
     escaped.length ? escaped.length + "/" + tested + " positions escape the card -> " +
                      escaped.slice(0, 3).join(" | ")
                    : "tooltip stays inside at all " + tested + " pointer positions");

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
  out.push("hover vs focus ownership");
  // focusing one wedge and hovering another must not pop two slices, and the
  // mouse must not destroy a keyboard user's tooltip
  wedges[0].focus();
  var hA = hits[8], rA = hA.getBoundingClientRect();
  fire(hA, "pointerover", { clientX: rA.left + rA.width/2, clientY: rA.top + rA.height/2 });
  var popped = qa(".pie .wedge.is-hot");
  ck(popped.length === 1, popped.length + " wedge(s) popped while one is focused (want 1)");
  ck(popped[0] === wedges[8], "the popped one is the hovered wedge, not the focused one");
  ck(!tip.hasAttribute("hidden"), "tooltip is showing while hovering");
  fire(hA, "pointerout");
  ck(document.activeElement === wedges[0], "focus survived the hover");
  ck(!tip.hasAttribute("hidden"),
     "tooltip falls back to the focused wedge instead of vanishing");
  ck(qa(".pie .wedge.is-hot").length === 0, "nothing is popped once the mouse leaves");
  wedges[0].blur();

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

  // status must not be colour-alone
  out.push("");
  out.push("status encoding");
  // hatch meant "Pile B money not in stocks yet". After the Oct 4 vote only the
  // five parked slots carried it; on Oct 6 the room dropped those slots and put
  // the money into the nine names, so nothing is hatched any more. Status
  // (Wednesday / last / left over) rides on the legend groups, the table's
  // When column and each wedge's aria-label instead.
  var named = qa('.pie .wedge.t-s');
  ck(named.length === 9, named.length + " named company wedges, each with its own budget");
  ck(named.every(function (w) { return !/url\(/.test(getComputedStyle(w).fill || ""); }),
     "the nine named wedges are solid - they go in on Wednesday");
  var later = qa('.pie .wedge.t-p');
  ck(later.length === 0, later.length + " hatched wedges (the parked slots are gone since Oct 6)");
  var whens = {};
  wedges.forEach(function (w) {
    var k = w.getAttribute("data-when") || "";
    whens[k] = (whens[k] || 0) + 1;
  });
  ck(whens.wednesday === 13 && whens.last === 1 && whens.rest === 1,
     "status is carried in data-when: " + JSON.stringify(whens));
  ck(wedges.every(function (w) { return /Filling Thursday|Left over/.test(w.getAttribute("aria-label") || ""); }),
     "every wedge announces its status in its aria-label, so status is not colour-alone");

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
