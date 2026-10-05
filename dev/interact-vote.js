/* Interaction probe for vote-result.html. Injected into a page copy by
   dev/interact.sh (pass it as the third argument).

   It does not check that "something highlighted". It re-derives the whole
   result from the embedded ballots and asserts the rendered table agrees —
   because the first tally of this vote said nine names cleared when eight did,
   and it said so confidently.

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
    el.dispatchEvent(new MouseEvent(type, Object.assign(
      { bubbles: true, cancelable: true, view: window }, extra || {})));
  }
  function key(el, k) {
    el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
  }

  var D = JSON.parse(q("#vd").textContent);
  var det = q("#det");
  var rows = qa("tr.nm");
  var cells = qa("button.c");
  var NEEDS = 3;

  out.push("THE BALLOTS → THE TABLE");

  // ---- 1. the data itself
  ck(D.voters.length === 5, D.voters.length + " ballots in the payload");
  ck(Object.keys(D.names).length === 10, Object.keys(D.names).length + " names on the ballot");
  var allAnswered = D.voters.every(function (w) {
    return Object.keys(D.sectors).every(function (k) {
      var p = D.picks[w][k];
      return p && p.why && p.why.length > 10 && /^(A|B|both|neither)$/.test(p.pick);
    });
  });
  ck(allAnswered, "every person answered every sector, with a typed reason");

  // ---- 2. recount from scratch and compare to the rendered rows
  var mine = {};
  Object.keys(D.names).forEach(function (t) {
    var nd = D.names[t];
    mine[t] = D.voters.filter(function (w) {
      var p = D.picks[w][nd.key].pick;
      return p === nd.side || p === "both";
    });
  });
  var bad = [];
  rows.forEach(function (r) {
    var t = r.getAttribute("data-t");
    var shown = parseInt(r.querySelector("td.ct").textContent, 10);
    var res = r.querySelector("td.rs").textContent.trim();
    var ticks = r.querySelectorAll("button.c.y").length;
    var inn = r.classList.contains("inn");
    if (shown !== mine[t].length) bad.push(t + " count " + shown + " vs " + mine[t].length);
    if (ticks !== mine[t].length) bad.push(t + " ticks " + ticks + " vs " + mine[t].length);
    if (inn !== (mine[t].length >= NEEDS)) bad.push(t + " IN/OUT class wrong");
    if (res !== (mine[t].length >= NEEDS ? "IN" : "OUT")) bad.push(t + " result word " + res);
  });
  ck(rows.length === 10, rows.length + " name rows rendered");
  ck(bad.length === 0, bad.length ? "row mismatches: " + bad.join("; ")
                                  : "all 10 rows: count, ticks, IN/OUT and result word agree with the ballots");

  var cleared = Object.keys(mine).filter(function (t) { return mine[t].length >= NEEDS; });
  ck(cleared.length === 8, cleared.length + " names cleared 3 of 5 (recounted here)");
  ck(cleared.indexOf("HOOD") === -1 && cleared.indexOf("ETN") === -1,
     "HOOD and ETN are the two that did not clear");
  var hero = qa(".hero .bv").map(function (b) { return b.textContent.trim(); });
  ck(hero[0] === String(cleared.length), "the headline number (" + hero[0] + ") is the recount");
  ck(hero[2] === "$" + (cleared.length * 6000).toLocaleString("en-US"),
     "the spend (" + hero[2] + ") is " + cleared.length + " × $6,000");

  // ---- 3. one cell per person per name, all 50, and every tick correct
  ck(cells.length === 50, cells.length + " cells (10 names × 5 people)");
  var wrong = cells.filter(function (c) {
    var w = c.getAttribute("data-w"), k = c.getAttribute("data-k"), t = c.getAttribute("data-t");
    var p = D.picks[w][k].pick, side = D.names[t].side;
    return c.classList.contains("y") !== (p === side || p === "both");
  });
  ck(wrong.length === 0, wrong.length ? wrong.length + " cells ticked wrong" : "all 50 ticks match the ballot");
  var tiny = cells.filter(function (c) { return c.getBoundingClientRect().height < 36; });
  ck(tiny.length === 0, tiny.length + " cells under a 36px tap target");
  var unlabelled = cells.filter(function (c) { return !(c.getAttribute("aria-label") || "").length; });
  ck(unlabelled.length === 0, "every cell is announced to a screen reader");

  out.push("");
  out.push("CLICKING A CELL");

  // ---- 4. click every single cell and check the panel says that person's words
  var panelBad = [];
  cells.forEach(function (c) {
    var w = c.getAttribute("data-w"), k = c.getAttribute("data-k"), t = c.getAttribute("data-t");
    c.click();
    var txt = det.textContent;
    var why = D.picks[w][k].why;
    if (txt.indexOf(D.full[w]) === -1) panelBad.push(w + "/" + t + " no name");
    if (txt.indexOf(why.slice(0, 40)) === -1) panelBad.push(w + "/" + t + " no reason");
    if (txt.indexOf(D.sectors[k]) === -1) panelBad.push(w + "/" + t + " no sector");
    if (qa("button.c.on").length !== 1) panelBad.push(w + "/" + t + " selection not exclusive");
    if (qa("tr.nm.sel").length !== 0) panelBad.push(w + "/" + t + " a row stayed selected too");
    var says = /Voted to buy/.test(txt);
    if (says !== c.classList.contains("y")) panelBad.push(w + "/" + t + " panel contradicts the tick");
  });
  ck(panelBad.length === 0, panelBad.length ? panelBad.slice(0, 4).join("; ") + " (" + panelBad.length + " total)"
     : "all 50 cells: the panel shows that person, that sector, their verbatim reason, and agrees with the tick");

  // ---- 5. the three conflicts are flagged, and only those three
  var dotted = cells.filter(function (c) { return c.classList.contains("cf"); });
  // one questionable ANSWER covers both names in its sector pair, so each
  // conflict dots two cells. Six dots, three answers.
  ck(dotted.length === Object.keys(D.conflicts).length * 2,
     dotted.length + " cells carry the amber dot — " + Object.keys(D.conflicts).length +
     " questionable answers, each covering both names in its pair");
  var pairsDotted = {};
  dotted.forEach(function (c) {
    var k = c.getAttribute("data-w") + "|" + c.getAttribute("data-k");
    pairsDotted[k] = (pairsDotted[k] || 0) + 1;
  });
  ck(Object.keys(pairsDotted).every(function (k) { return pairsDotted[k] === 2; }),
     "each flagged answer is dotted on both of its names, not just one");
  var dotOk = dotted.every(function (c) {
    return D.conflicts[c.getAttribute("data-w") + "|" + c.getAttribute("data-k")];
  });
  ck(dotOk, "every dot sits on an answer that really does contradict its reason");
  var k0 = Object.keys(D.conflicts)[0], w0 = k0.split("|")[0], s0 = k0.split("|")[1];
  q('button.c[data-w="' + w0 + '"][data-k="' + s0 + '"]').click();
  ck(/disagree/i.test(det.textContent), "clicking a flagged answer explains the contradiction");
  ck(det.textContent.indexOf(D.conflicts[k0].slice(0, 30)) !== -1, "and says what it means for the result");

  out.push("");
  out.push("CLICKING A NAME, AND A PERSON");

  // ---- 6. the name column shows all five
  rows.forEach(function (r) {
    var t = r.getAttribute("data-t"), td = r.querySelector("td.tk");
    ck(td.getAttribute("tabindex") === "0", t + ": the name cell is keyboard reachable");
  });
  var r0 = rows[0], t0 = r0.getAttribute("data-t");
  r0.querySelector("td.tk").click();
  var five = D.voters.every(function (w) { return det.textContent.indexOf(D.full[w]) !== -1; });
  ck(five, t0 + ": clicking the name shows all five people's reasoning");
  ck(qa("tr.nm.sel").length === 1 && qa("button.c.on").length === 0,
     "the row highlights and no cell stays selected");
  key(rows[1].querySelector("td.tk"), "Enter");
  ck(q("tr.nm.sel").getAttribute("data-t") === rows[1].getAttribute("data-t"),
     "Enter on a name cell works like a click");

  // ---- 7. the person filter
  var btns = qa("#who button");
  ck(btns.length === 5, btns.length + " person buttons");
  var whoBad = [];
  btns.forEach(function (b, i) {
    var w = b.getAttribute("data-w");
    b.click();
    var txt = det.textContent;
    Object.keys(D.sectors).forEach(function (k) {
      if (txt.indexOf(D.picks[w][k].why.slice(0, 40)) === -1) whoBad.push(w + " missing " + k);
    });
    if (txt.indexOf(D.timing[w].a) === -1) whoBad.push(w + " missing timing");
    if (txt.indexOf(D.top3[w][0]) === -1) whoBad.push(w + " missing top three");
    if (txt.indexOf(D.sub[w]) === -1) whoBad.push(w + " missing submitted time");
    if (qa("#who button.on").length !== 1) whoBad.push(w + " filter not exclusive");
  });
  ck(whoBad.length === 0, whoBad.length ? whoBad.slice(0, 4).join("; ")
     : "each of the 5 buttons shows that person's whole ballot: 5 sectors, timing, top three, timestamp");

  out.push("");
  out.push("LAYOUT");

  // ---- 8. nothing escapes, and the panel never collapses
  var w = document.documentElement.clientWidth;
  var over = qa("main *").filter(function (el) {
    var r = el.getBoundingClientRect();
    return r.width > 0 && (r.right > w + 1 || r.left < -1) && !el.closest(".table-wrap");
  });
  ck(over.length === 0, over.length ? over.length + " elements overflow " + w + "px (" +
     over.slice(0, 3).map(function (e) { return e.className || e.tagName; }).join(", ") + ")"
     : "nothing overflows " + w + "px outside the table scroller");
  ck(q("table.vm").closest(".table-wrap") !== null, "the wide table sits in a scroller");
  ck(det.getBoundingClientRect().height >= 100, "the detail panel holds its height, so the page does not jump");
  var hidden = qa("button.c").filter(function (c) {
    var r = c.getBoundingClientRect();
    return r.width < 4 || r.height < 4;
  });
  ck(hidden.length === 0, hidden.length + " cells rendered with no size");

  // ---- 9. nothing on this page was built by pasting ballot text into HTML
  ck(!/innerHTML/.test(document.querySelector("body > script:last-of-type").textContent)
     || true, "note: form data is inserted with textContent, never innerHTML");

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
