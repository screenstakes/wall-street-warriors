/* Interaction probe for vote-result.html. Injected into a page copy by
   dev/interact.sh (pass it as the third argument).

   It does not check that "something highlighted". It re-derives the whole
   result from the embedded ballots and asserts the rendered cards agree —
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

  var D = JSON.parse(q("#vd").textContent);
  var cards = qa(".nc");
  var NEEDS = D.needs;

  out.push("THE BALLOTS -> THE CARDS");

  // ---- 1. the data itself
  ck(D.voters.length === 5, D.voters.length + " ballots in the payload");
  ck(Object.keys(D.names).length === 10, Object.keys(D.names).length + " names on the ballot");
  ck(D.voters.every(function (w) {
    return Object.keys(D.sectors).every(function (k) {
      var p = D.picks[w][k];
      return p && p.why && p.why.length > 10 && /^(A|B|both|neither)$/.test(p.pick);
    });
  }), "every person answered every sector, with a typed reason");

  // ---- 2. recount from scratch, then check each card against the recount
  var mine = {};
  Object.keys(D.names).forEach(function (t) {
    var nd = D.names[t];
    mine[t] = D.voters.filter(function (w) {
      var p = D.picks[w][nd.key].pick;
      return p === nd.side || p === "both";
    });
  });
  var cleared = Object.keys(mine).filter(function (t) { return mine[t].length >= NEEDS; });

  var bad = [];
  ck(cards.length === 10, cards.length + " name cards rendered");
  cards.forEach(function (c) {
    var t = c.getAttribute("data-t"), want = mine[t], inn = want.length >= NEEDS;
    var shown = parseInt(c.querySelector(".cnt").textContent, 10);
    var pill = c.querySelector(".pill").textContent.trim();
    var lit = qa('.nc[data-t="' + t + '"] .chip.y').map(function (ch) { return ch.getAttribute("data-w"); });
    if (shown !== want.length) bad.push(t + " count " + shown + " vs " + want.length);
    if (pill !== (inn ? "IN" : "OUT")) bad.push(t + " pill " + pill);
    if (c.classList.contains("inn") !== inn) bad.push(t + " card state wrong");
    if (c.getAttribute("data-state") !== (inn ? "in" : "out")) bad.push(t + " data-state wrong");
    if (lit.join(",") !== want.join(",")) bad.push(t + " chips [" + lit + "] vs [" + want + "]");
    if (qa('.nc[data-t="' + t + '"] .chip').length !== 5) bad.push(t + " not 5 chips");
  });
  ck(bad.length === 0, bad.length ? "card mismatches: " + bad.slice(0, 4).join("; ")
     : "all 10 cards: count, IN/OUT, card state and the five lit chips agree with the ballots");

  // 9, not 8: Dylan ticked only GEV, wrote "buy both", and confirmed on the
  // Oct 4 call that he meant both. That is what put Eaton in at 3 of 5.
  ck(cleared.length === 9, cleared.length + " names cleared " + NEEDS + " of 5 (recounted here)");
  ck(cleared.indexOf("HOOD") === -1, "Robinhood is the only name that did not clear");
  ck(cleared.indexOf("ETN") !== -1, "Eaton is in, on Dylan's corrected ballot");
  ck(q(".vnum").textContent.indexOf(String(cleared.length)) === 0,
     "the big number is the recount (" + q(".vnum").textContent.trim() + ")");
  var money = qa(".vmoney b").map(function (b) { return b.textContent.trim(); });
  ck(money[0] === "$" + (cleared.length * D.slot).toLocaleString("en-US"),
     "the spend (" + money[0] + ") is " + cleared.length + " x $" + D.slot.toLocaleString("en-US"));
  ck(money[1] === "$" + ((10 - cleared.length) * D.slot).toLocaleString("en-US"),
     "what waits in BIL (" + money[1] + ") is the other " + (10 - cleared.length));

  // ---- 3. a chip never says yes by colour alone
  var noGlyph = qa(".chip").filter(function (ch) {
    var i = ch.querySelector("i");
    return !i || !/[✓×]/.test(i.textContent);
  });
  ck(noGlyph.length === 0, noGlyph.length + " chips rely on colour alone (want 0)");

  out.push("");
  out.push("OPENING A CARD");

  // ---- 4. open every card and check all five reasons are there, verbatim
  var openBad = [];
  cards.forEach(function (c) {
    var t = c.getAttribute("data-t"), key = D.names[t].key;
    var btn = c.querySelector(".more"), panel = c.querySelector(".ncd");
    if (!panel.hidden) openBad.push(t + " started open");
    btn.click();
    if (panel.hidden) openBad.push(t + " did not open");
    if (!c.classList.contains("is-open")) openBad.push(t + " missing is-open");
    if (c.querySelector(".nch").getAttribute("aria-expanded") !== "true") openBad.push(t + " aria-expanded");
    var txt = panel.textContent;
    D.voters.forEach(function (w) {
      var why = D.picks[w][key].why;
      if (txt.indexOf(D.full[w]) === -1) openBad.push(t + "/" + w + " name missing");
      if (txt.indexOf(why.slice(0, 45)) === -1) openBad.push(t + "/" + w + " reason missing");
    });
    // the verdict line per person must agree with that person's chip
    var mismatched = qa('.nc[data-t="' + t + '"] .ncd .r').filter(function (r, i) {
      var w = D.voters[i], p = D.picks[w][key].pick;
      var yes = p === D.names[t].side || p === "both";
      return r.classList.contains("y") !== yes;
    });
    if (mismatched.length) openBad.push(t + " " + mismatched.length + " verdict lines contradict the chips");
    btn.click();
    if (!panel.hidden) openBad.push(t + " did not close again");
  });
  ck(openBad.length === 0, openBad.length ? openBad.slice(0, 4).join("; ") + " (" + openBad.length + ")"
     : "all 10 cards open, show all five people with their verbatim reasons, and close again");

  // tapping the headline works too, not just the button
  var c0 = cards[0];
  c0.querySelector(".nch").click();
  ck(!c0.querySelector(".ncd").hidden, "tapping the name itself opens it");
  c0.querySelector(".nch").click();
  ck(c0.querySelector(".ncd").hidden, "and tapping it again closes it");

  // ---- 5. the three questionable answers are flagged where they matter
  var flags = qa(".ncd .flag");
  ck(flags.length === Object.keys(D.conflicts).length * 2,
     flags.length + " flag notes - " + Object.keys(D.conflicts).length +
     " questionable answers, each shown on both names in its pair");
  var flagText = flags.map(function (f) { return f.textContent; }).join(" | ");
  ck(Object.keys(D.conflicts).every(function (k) {
    return flagText.indexOf(D.conflicts[k].slice(0, 30)) !== -1;
  }), "every flag says what that answer would change");
  var marked = qa(".chip.cf");
  ck(marked.length === Object.keys(D.conflicts).length * 2,
     marked.length + " chips carry the question mark");
  ck(marked.every(function (ch) { return ch.querySelector("em"); }),
     "the mark is a glyph on the chip, not a colour");

  out.push("");
  out.push("THE ONE CONTROL");

  // ---- 6. the filter
  var fb = qa(".filter button");
  ck(fb.length === 3, fb.length + " filter buttons");
  function visible() { return cards.filter(function (c) { return !c.hidden; }); }
  var fbad = [];
  [["all", 10], ["in", cleared.length], ["out", 10 - cleared.length]].forEach(function (pair) {
    var b = fb.filter(function (x) { return x.getAttribute("data-f") === pair[0]; })[0];
    b.click();
    var v = visible();
    if (v.length !== pair[1]) fbad.push(pair[0] + " showed " + v.length + " want " + pair[1]);
    if (pair[0] !== "all" && v.some(function (c) { return c.getAttribute("data-state") !== pair[0]; }))
      fbad.push(pair[0] + " showed a card of the wrong state");
    if (qa('.filter button[aria-pressed="true"]').length !== 1) fbad.push(pair[0] + " pressed state not exclusive");
    // an empty sector must not leave its heading behind
    qa(".sec").forEach(function (s) {
      var any = Array.prototype.slice.call(s.querySelectorAll(".nc")).some(function (c) { return !c.hidden; });
      if (any === !!s.hidden) fbad.push(pair[0] + " sector heading " + s.getAttribute("data-sec") + " wrong");
    });
  });
  ck(fbad.length === 0, fbad.length ? fbad.slice(0, 3).join("; ")
     : "all three filters show exactly the right cards and hide emptied sector headings");
  fb[0].click();

  out.push("");
  out.push("LAYOUT");

  // ---- 7. nothing escapes, nothing is too small to tap
  var w = document.documentElement.clientWidth;
  var over = qa("main *").filter(function (el) {
    var r = el.getBoundingClientRect();
    return r.width > 0 && (r.right > w + 1 || r.left < -1);
  });
  ck(over.length === 0, over.length ? over.length + " elements overflow " + w + "px (" +
     over.slice(0, 3).map(function (e) { return e.className || e.tagName; }).join(", ") + ")"
     : "nothing overflows " + w + "px");
  var small = qa(".more, .nch, .filter button").filter(function (b) {
    return b.getBoundingClientRect().height < 40;
  });
  ck(small.length === 0, small.length + " controls under 40px tall");
  ck(qa("table").length === 0, "no table on this page - that was v1, and he rejected it");

  // ---- 8. the two side questions are complete
  ck(qa(".qcard ul.rows li").length ===
     (new Set(D.voters.map(function (w) { return D.timing[w].a; }))).size +
     (new Set([].concat.apply([], D.voters.map(function (w) { return D.top3[w]; })))).size,
     "the timing and top-three lists hold every distinct answer given");

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
