/* Site probe: walks every step, exercises every interactive control, checks layout. Injected into a local copy. */
(function () {
  var errs = []; window.addEventListener("error", function (e) { errs.push(e.message); });
  var out = [], fails = 0;
  function F(msg) { fails++; out.push("  FAIL " + msg); }
  function $(id) { return document.getElementById(id); }
  function click(el) { if (!el) return false; el.click(); return true; }
  function inside(el, box) { var a = el.getBoundingClientRect(), b = box.getBoundingClientRect(); return a.left >= b.left - 1 && a.right <= b.right + 1; }
  function vis(el) { return el && getComputedStyle(el).display !== "none" && el.getBoundingClientRect().height > 0; }
  function textBad() { return /undefined|NaN|\[object|null\b/.test(document.querySelector("main").innerText); }
  var POT = {}; /* steps that show the money bar */
  function checkStep(n) {
    var t = (document.querySelector(".g-h") || document.querySelector("h1")).textContent, main = document.querySelector("main");
    var line = String(n + 1).padStart(2) + ". " + t.slice(0, 40);
    if (textBad()) F(line + " shows undefined/NaN/[object]");
    if (document.documentElement.scrollWidth > innerWidth + 1) F(line + " horizontal overflow " + document.documentElement.scrollWidth + ">" + innerWidth);
    /* any text node overflowing the card */
    var card = main.getBoundingClientRect(), over = 0;
    Array.prototype.forEach.call(main.querySelectorAll("h1,p,span,b,button,li,dt,dd,small,q,time,label,output"), function (e) {
      if (!vis(e) || e.closest(".tabs")) return; var r = e.getBoundingClientRect(); if (r.right > card.right + 1 || r.left < card.left - 1) over++; });
    if (over) F(line + " " + over + " elements poke outside the card");
    /* svg text inside svg */
    Array.prototype.forEach.call(main.querySelectorAll("svg"), function (svg) {
      if (!vis(svg)) return; var b = svg.getBoundingClientRect();
      Array.prototype.forEach.call(svg.querySelectorAll("text"), function (tx) { var r = tx.getBoundingClientRect(); if (r.width && (r.right > b.right + 2 || r.left < b.left - 2)) F(line + " svg text clipped: " + tx.textContent); });
    });
    POT[n] = vis($("pot"));
    out.push(line + (POT[n] ? "  [money bar]" : ""));
  }
  function interact(n, done) {
    var t = (document.querySelector(".g-h") || document.querySelector("h1")).textContent, q = [];
    var line = String(n + 1).padStart(2) + ". ";
    if ($("grow")) q.push(function () { $("grow").value = 2029; $("grow").dispatchEvent(new Event("input")); if (!/2029/.test($("cap").textContent)) F(line + "grow slider caption did not update"); });
    if ($("cols")) q.push(function () { click($("cols").querySelector('[data-year="2038"]')); if (!/2038/.test($("cap").textContent)) F(line + "bills column click did not update"); });
    if ($("scen")) q.push(function () { var before = $("legend").textContent; click($("scen-strong")); if ($("legend").textContent === before) F(line + "market buttons did nothing"); });
    if ($("mix")) q.push(function () { $("mix").value = 70; $("mix").dispatchEvent(new Event("input")); if (!/70% safe/.test($("mix-out").textContent)) F(line + "recipe slider did nothing"); });
    if ($("lens")) q.push(function () { ["wins", "ips", "sheet"].forEach(function (l) { click($("lens-" + l)); if (!inside($("pin"), document.querySelector("main"))) F(line + "ribbon pin outside card for " + l); }); });
    if ($("clues")) q.push(function () { click($("clue-0")); if ($("clue-0").getAttribute("aria-expanded") !== "true") F(line + "clue did not open"); ["a", "g"].forEach(function (p) { click($("pile-" + p)); if (!inside($("mk"), document.querySelector(".scale"))) F(line + "risk marker outside scale for " + p); }); });
    if ($("picks")) q.push(function () { click($("pick-0")); if ($("pick-0").getAttribute("aria-expanded") !== "true") F(line + "pick card did not open"); });
    if ($("donut")) q.push(function () { click($("key-0")); if (!/US stock index/.test($("tnote").textContent)) F(line + "donut key did not update note"); });
    if ($("myear")) q.push(function () { $("myear").value = 2033; $("myear").dispatchEvent(new Event("input")); if (!/Split/.test($("mm").textContent)) F(line + "year slider did not update"); });
    if ($("side")) q.push(function () { var b = $("vs").textContent; click($("side-us")); if ($("vs").textContent === b) F(line + "compare switch did nothing"); });
    if ($("derisk")) q.push(function () { click($("derisk-early")); if (!/believable/i.test($("bubble").textContent)) F(line + "de-risk toggle did nothing"); });
    if ($("prof")) q.push(function () { click($("prof-careful")); if (!/of 100/.test($("s-ok").textContent)) F(line + "futures did not run"); });
    if ($("tree")) q.push(function () {
      ["core", "safe", "sa", "sb", "sc"].forEach(function (id) { click($("tile-" + id)); if ($("pickd").textContent.length < 20) F(line + "tile " + id + " detail empty"); });
      ["lead", "risk", "log", "client", "research"].forEach(function (id) { click($("job-" + id)); if ($("pickd").textContent.length < 20) F(line + "job " + id + " detail empty"); });
      if (!/Michael/.test($("job-lead").textContent)) F(line + "leader job lost its owner");
    });
    if ($("rulesd")) q.push(function () { var ph = innerWidth <= 700; if ($("rulesd").open === ph) F(line + "rules fold default wrong for width " + innerWidth); });
    if ($("ownview")) q.push(function () { click($("ownview-j")); if (!$("tree").hidden || $("jobs").hidden) F(line + "jobs toggle did not switch"); click($("ownview-s")); if ($("tree").hidden) F(line + "slices toggle did not switch back"); });
    if ($("chat")) q.push(function () {
      click($("act-post")); click($("act-check"));
      if ($("voteBox").hidden) F(line + "vote box did not appear");
      click($("act-hold")); if (!/HOLD/.test($("chat").textContent)) F(line + "HOLD path did not show");
      click($("vote-Caleb")); if (/Approved/.test($("chat").textContent)) F(line + "approved with only 2 votes");
      click($("vote-Joe")); if (!/Approved/.test($("chat").textContent)) F(line + "not approved at 3 votes");
      click($("vote-Joe")); if (/Approved/.test($("chat").textContent)) F(line + "stayed approved after a vote was removed");
      click($("vote-Joe")); click($("act-place")); click($("act-note"));
      if (!/Logged/.test($("chat").textContent)) F(line + "trade flow did not finish");
      if (document.documentElement.scrollWidth > innerWidth + 1) F(line + "chat overflows horizontally");
      click($("act-reset")); if ($("chat").textContent.indexOf("empty") < 0) F(line + "reset did not clear the chat");
    });
    q.forEach(function (f) { try { f(); } catch (e) { F(line + "threw: " + e.message); } });
    done();
  }
  setTimeout(function () {
    try { localStorage.clear(); } catch (e) {}
    var total = 0, n = 0;
    /* go to step 1 */
    while (!$("back").disabled) $("back").click();
    (function next() {
      checkStep(n);
      interact(n, function () {
        checkStep(n); out.pop(); /* re-check layout after interacting, without a duplicate line */
        if (!$("next") || $("next").textContent === "Start over") {
          total = n + 1;
          if (!/whole guide/.test($("hint").textContent)) F("last step hint not updated");
          
          var res = "STEPS " + total + " | FAILS " + fails + " | JS errors " + (errs.length ? errs.join(" / ") : "none") + " | width " + innerWidth + "\n" + out.join("\n");
          var pre = document.createElement("pre"); pre.id = "probe-result"; pre.textContent = res; document.body.appendChild(pre);
          try { parent.postMessage({ siteProbe: res }, "*"); } catch (e) {}
          return;
        }
        n++; $("next").click(); setTimeout(next, 60);
      });
    })();
  }, 900);
})();
