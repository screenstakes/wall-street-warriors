/* Wall Street Warriors — shared behavior: dates, countdowns, ticker, icons, storage, calendar export. */
/* If data.js did not load, every render below throws and the page still paints a complete-looking
   shell with no navigation on a phone. Fail loudly instead. */
if (!window.WSW || !window.WSW.data) {
  window.WSW = window.WSW || {};
  window.WSW.data = window.WSW.data || {};
  document.addEventListener("DOMContentLoaded", function () {
    var b = document.createElement("div");
    b.setAttribute("role", "alert");
    b.style.cssText = "position:fixed;inset:0 0 auto 0;z-index:9999;background:#8C2F1E;color:#fff;" +
      "font:600 14px/1.45 system-ui,sans-serif;padding:12px 16px;text-align:center";
    b.textContent = "This page could not load its data, so most of it is missing. Reload, and tell Michael if it keeps happening.";
    document.body.insertBefore(b, document.body.firstChild);
  });
}

(function (W) {
  "use strict";
  var D = W.data;
  var DAY = 86400000;

  /* ---------- dates ---------- */
  W.now = function () { return new Date(); };
  function dayKey(d) { return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()); }
  W.dayKey = dayKey;
  /* a bare YYYY-MM-DD is a local calendar day, not UTC midnight (which would show as the previous day in Texas) */
  function parse(iso) { return iso instanceof Date ? iso : /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(iso + "T12:00:00") : new Date(iso); }
  W.parse = parse;
  W.daysUntil = function (iso) { return Math.round((dayKey(parse(iso)) - dayKey(W.now())) / DAY); };
  W.fmtDate = function (iso, o) {
    o = o || {};
    var d = parse(iso);
    var opts = { month: "short", day: "numeric" };
    if (o.weekday) opts.weekday = "short";
    if (o.year) opts.year = "numeric";
    return d.toLocaleDateString("en-US", opts);
  };
  W.fmtTimes = function (iso) {
    var d = parse(iso);
    function part(tz, label) {
      var s = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz });
      return s.replace(" AM", " a.m.").replace(" PM", " p.m.") + " " + label;
    }
    return part("America/New_York", "ET") + " · " + part("America/Chicago", "CT");
  };
  W.relative = function (n) {
    if (n === 0) return "today";
    if (n === 1) return "tomorrow";
    if (n === -1) return "yesterday";
    if (n > 1) return "in " + n + " days";
    return Math.abs(n) + " days ago";
  };
  W.phase = function () {
    var k = dayKey(W.now());
    for (var i = 0; i < D.phases.length; i++) {
      var p = D.phases[i];
      if (k >= dayKey(new Date(p.start + "T00:00:00")) && k <= dayKey(new Date(p.end + "T00:00:00"))) return p;
    }
    return k < dayKey(new Date(D.phases[0].start + "T00:00:00")) ? D.phases[0] : D.phases[D.phases.length - 1];
  };
  W.dated = function () { return D.events.filter(function (e) { return !e.tbd; }).sort(function (a, b) { return new Date(a.date) - new Date(b.date); }); };
  W.upcoming = function (n, opts) {
    opts = opts || {};
    var list = W.dated().filter(function (e) { return W.daysUntil(e.date) >= 0 && (opts.internal !== false || e.kind !== "internal"); });
    return n ? list.slice(0, n) : list;
  };
  W.eventById = function (id) { for (var i = 0; i < D.events.length; i++) if (D.events[i].id === id) return D.events[i]; return null; };
  W.member = function (id) { for (var i = 0; i < D.team.members.length; i++) if (D.team.members[i].id === id) return D.team.members[i]; return null; };

  /* ---------- storage (per browser) ---------- */
  W.store = {
    get: function (k, fb) { try { var v = localStorage.getItem("wsw:" + k); return v === null ? fb : JSON.parse(v); } catch (e) { return fb; } },
    set: function (k, v) { try { localStorage.setItem("wsw:" + k, JSON.stringify(v)); } catch (e) {} }
  };
  W.bindChecks = function (root, key) {
    var saved = W.store.get(key, {});
    var boxes = root.querySelectorAll("input[type=checkbox][id]");
    Array.prototype.forEach.call(boxes, function (b) {
      if (saved[b.id]) b.checked = true;
      b.addEventListener("change", function () { saved[b.id] = b.checked; W.store.set(key, saved); });
    });
  };

  /* ---------- icons (stroke glyphs, 24 grid) ---------- */
  var ICONS = {
    calendar: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/>',
    flag: '<path d="M5 21V4h11l-1.5 4L16 12H5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
    chart: '<path d="M3 20h18"/><path d="M5 16l4-5 4 3 6-8"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.5c3 0 5.5 2 5.5 5.5"/>',
    book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
    news: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9h10M7 13h10M7 17h6"/>',
    check: '<path d="M4 12.5l5 5L20 6.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><circle cx="17" cy="14.5" r="1.2"/>',
    trophy: '<path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 6H4v1a4 4 0 0 0 3 4M17 6h3v1a4 4 0 0 1-3 4"/><path d="M12 13v4M8 21h8M9 17h6"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    arrowDown: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    edit: '<path d="M4 20h4l10-10-4-4L4 16z"/><path d="M12 8l4 4"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    star: '<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1.1 6.3L12 17.5 6.4 20.4l1.1-6.3L3 9.7l6.2-.9z"/>',
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/>',
    more: '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>'
  };
  W.icon = function (name) { return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || "") + "</svg>"; };
  function fillIcons(root) {
    Array.prototype.forEach.call((root || document).querySelectorAll("[data-icon]"), function (el) {
      if (!el.firstElementChild) el.innerHTML = W.icon(el.getAttribute("data-icon"));
    });
  }
  W.fillIcons = fillIcons;

  /* ---------- numbers ---------- */
  W.countUp = function (el, to, ms) {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !to) { el.textContent = to; return; }
    var start = performance.now();
    function tick(t) {
      var p = Math.min(1, (t - start) / (ms || 700));
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };
  W.money = function (n) { return "$" + Math.round(n).toLocaleString("en-US"); };
  W.pct = function (r, d) { return (r * 100).toFixed(d === undefined ? 1 : d) + "%"; };

  /* ---------- ticker strip ---------- */
  var STRIP_IDS = ["release", "practice-end", "trading", "roster", "notes", "ips", "report", "finale"];
  var STRIP_LABELS = { release: "Case study", "practice-end": "Practice wiped", trading: "Trading begins", roster: "Roster due", notes: "Trading notes", ips: "IPS · trading ends", report: "Final report", finale: "Global Finale" };
  function stripItems() {
    return STRIP_IDS.map(function (id) {
      var e = W.eventById(id); if (!e) return "";
      var n = W.daysUntil(e.date);
      var cls = n < 0 ? "past" : n <= 7 ? "soon" : "later";
      var ic = n < 0 ? "" : W.icon(n <= 7 ? "arrowDown" : "arrowUp");
      var txt = n < 0 ? "done" : n === 0 ? "today" : n === 1 ? "1 day" : n + " days";
      return "<li><span class=\"k\">" + STRIP_LABELS[id] + "</span><span class=\"v\">" + W.fmtDate(e.date).toUpperCase() + "</span><span class=\"d " + cls + "\">" + ic + txt + "</span></li>";
    }).join("");
  }
  function renderStrip() {
    var el = document.querySelector(".strip"); if (!el) return;
    var items = stripItems();
    el.innerHTML = '<div class="track" aria-label="Countdowns"><ul>' + items + "</ul><ul aria-hidden=\"true\">" + items + "</ul></div>";
  }

  /* ---------- calendar export ---------- */
  function icsDate(d) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
  function esc(s) { return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n"); }
  W.ics = function (events) {
    var out = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wall Street Warriors//Season//EN", "CALSCALE:GREGORIAN", "X-WR-CALNAME:Wall Street Warriors 2026-27"];
    events.forEach(function (e) {
      var s = new Date(e.date), en = e.end ? new Date(e.end) : new Date(s.getTime() + 3600000);
      out.push("BEGIN:VEVENT", "UID:wsw-" + e.id + "@wallstreetwarriors", "DTSTAMP:" + icsDate(new Date()), "DTSTART:" + icsDate(s), "DTEND:" + icsDate(en),
        "SUMMARY:" + esc((e.kind === "internal" ? "[Team] " : "") + e.title), "DESCRIPTION:" + esc(e.detail || ""), "END:VEVENT");
    });
    out.push("END:VCALENDAR");
    return out.join("\r\n");
  };
  W.downloadICS = function (events, name) {
    var blob = new Blob([W.ics(events)], { type: "text/calendar" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name || "wall-street-warriors-season.ics";
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  };

  /* ---------- toast + clipboard ---------- */
  W.toast = function (msg) {
    var t = document.querySelector(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 1800);
  };
  W.copy = function (text, msg) {
    function done() { W.toast(msg || "Copied"); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    else fallback();
    function fallback() { var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); done(); } catch (e) {} ta.remove(); }
  };

  /* ---------- mobile shell: bottom tab bar, "More" sheet, compact date + phase in the header ---------- */
  function mobileShell(here) {
    var tabs = [["index.html", "Home", "home"], ["calendar.html", "Calendar", "calendar"], ["case.html", "Case", "book"], ["rules.html", "Rules", "shield"]];
    var more = [["card.html", "Trade card", "Write the card before you trade", "edit"], ["guide.html", "The Guide", "The case in 21 plain steps", "book"], ["playbook.html", "Playbook", "How teams advance, trade notes", "star"], ["team.html", "Team", "Roster, sheets, team rules", "users"], ["news.html", "Newsroom", "Champions, reading list, links", "news"]];
    if (here === "") here = "index.html";
    var inMore = more.some(function (m) { return m[0] === here; });

    var bar = document.createElement("nav");
    bar.className = "mbar"; bar.setAttribute("aria-label", "Pages");
    bar.innerHTML = tabs.map(function (t) {
      var on = t[0] === here;
      return '<a href="' + t[0] + '"' + (on ? ' class="is-active" aria-current="page"' : "") + ">" + W.icon(t[2]) + "<span>" + t[1] + "</span></a>";
    }).join("") + '<button type="button" class="mbar-more' + (inMore ? " is-active" : "") + '" aria-expanded="false" aria-controls="msheet">' + W.icon("more") + "<span>More</span></button>";

    var sheet = document.createElement("div");
    sheet.className = "msheet"; sheet.id = "msheet";
    sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-modal", "true"); sheet.setAttribute("aria-label", "More pages");
    function row(href, title, sub, icon, ext, on) {
      return '<a class="msheet-row' + (on ? " is-active" : "") + '" href="' + href + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + (on ? ' aria-current="page"' : "") +
        '><span class="msheet-ic">' + W.icon(icon) + "</span><span><b>" + title + "</b><small>" + sub + "</small></span></a>";
    }
    sheet.innerHTML = '<div class="msheet-grab" aria-hidden="true"></div><div class="msheet-k">More pages</div>' +
      more.map(function (m) { return row(m[0], m[1], m[2], m[3], false, m[0] === here); }).join("") +
      '<div class="msheet-k">Quick links</div>' +
      row(D.team.simulator.url, "Open WInS", "The simulator, one shared team login", "chart", true) +
      row(D.team.portal.url, "SurveyMonkey Apply", "Case study and every submission", "link", true);

    var scrim = document.createElement("div");
    scrim.className = "mscrim";
    document.body.appendChild(scrim); document.body.appendChild(sheet); document.body.appendChild(bar);

    var btn = bar.querySelector(".mbar-more");
    function setOpen(open) {
      sheet.classList.toggle("is-open", open); scrim.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) { var first = sheet.querySelector("a"); if (first) first.focus({ preventScroll: true }); }
      else if (sheet.contains(document.activeElement)) btn.focus({ preventScroll: true });
    }
    btn.addEventListener("click", function () { setOpen(!sheet.classList.contains("is-open")); });
    scrim.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && sheet.classList.contains("is-open")) setOpen(false); });

    var head = document.querySelector(".brandbar .shell");
    if (head) {
      var mp = document.createElement("span");
      mp.className = "mphase";
      mp.innerHTML = "<b>" + W.now().toLocaleDateString("en-US", { month: "short", day: "numeric" }) + "</b><i>" + W.phase().label + "</i>";
      head.appendChild(mp);
    }
  }

  /* ---------- shell ---------- */
  function initShell() {
    var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    Array.prototype.forEach.call(document.querySelectorAll(".nav a"), function (a) {
      var href = (a.getAttribute("href") || "").toLowerCase();
      if (href === here || (here === "" && href === "index.html")) { a.classList.add("is-active"); a.setAttribute("aria-current", "page"); }
    });
    var today = document.querySelector("[data-today]");
    if (today) today.textContent = W.now().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    var ph = document.querySelector("[data-phase]");
    if (ph) ph.textContent = W.phase().label;
    renderStrip();
    mobileShell(here);
    fillIcons(document);
    Array.prototype.forEach.call(document.querySelectorAll(".reveal"), function (el, i) { if (!el.style.getPropertyValue("--i")) el.style.setProperty("--i", Math.min(i, 8)); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initShell); else initShell();

  /* In-page anchors (#notes, #sources): the browser jumps before page scripts render the sections above
     the target, so the jump lands short. Re-scroll once everything has rendered. Parameter hashes like
     #tab=… and #e=… are handled by their own pages and never match an id. */
  function settleAnchor() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id || id.indexOf("=") !== -1) return;
    var el = document.getElementById(id);
    if (el && W.unfoldFor) W.unfoldFor(el);
    /* "instant" overrides html{scroll-behavior:smooth}, which otherwise turns this into an animation that
       the load-time layout shifts interrupt */
    if (el) el.scrollIntoView({ block: "start", behavior: "instant" });
  }
  /* ---------- phone folding (≤700px only; desktop never sees any of this) ----------
     <section class="card" data-fold="closed|open"> : the card collapses to its header on phones. A toggle button is
       added to the card head; the choice is remembered per page and card. A link to anything inside opens it.
     <ul|ol|tbody|div data-m-limit="3">              : on phones only the first N children show, plus a "Show all" button.
     Content is hidden with CSS classes inside the phone media query, so the desktop layout is untouched. */
  var PHONE = window.matchMedia ? window.matchMedia("(max-width:700px)") : { matches: false, addEventListener: function () {} };
  var pageKey = (location.pathname.split("/").pop() || "index.html").replace(".html", "") || "index";
  /* open/closed state lasts for the browser session (GOV.UK accordion behavior), so a fresh visit starts tidy */
  var session = {
    get: function (k, fb) { try { var v = sessionStorage.getItem("wsw:" + k); return v === null ? fb : JSON.parse(v); } catch (e) { return fb; } },
    set: function (k, v) { try { sessionStorage.setItem("wsw:" + k, JSON.stringify(v)); } catch (e) {} }
  };
  function foldKey(card, i) { return "fold:" + pageKey + ":" + (card.id || card.getAttribute("aria-labelledby") || i); }
  function setFold(card, folded, save) {
    card.classList.toggle("is-folded", folded);
    var btn = card.querySelector(":scope > .card-head .fold-btn");
    if (btn) btn.setAttribute("aria-expanded", folded ? "false" : "true");
    if (save) { var s = session.get("folds", {}); s[card._foldKey] = folded; session.set("folds", s); }
  }
  W.unfoldFor = function (el) {
    var card = el && el.closest && el.closest(".card[data-fold]");
    if (card && card.classList.contains("is-folded")) setFold(card, false, true);
  };
  function initFolds() {
    var saved = session.get("folds", {});
    Array.prototype.forEach.call(document.querySelectorAll(".card[data-fold]"), function (card, i) {
      var head = card.querySelector(":scope > .card-head");
      if (!head || card._foldInit) return;
      card._foldInit = true; card._foldKey = foldKey(card, i);
      /* one caret button on the right; the whole header row toggles too (NN/g: caret is the safest icon) */
      var btn = document.createElement("button");
      btn.type = "button"; btn.className = "fold-btn";
      btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
      var label = head.querySelector("h2,h3");
      btn.setAttribute("aria-label", label ? label.textContent.trim() : "Section");
      head.appendChild(btn);
      btn.addEventListener("click", function (e) { e.stopPropagation(); setFold(card, !card.classList.contains("is-folded"), true); });
      /* tapping the title area toggles too, but never hijacks links or other buttons in the head */
      head.addEventListener("click", function (e) {
        if (!PHONE.matches || e.target.closest("a,button,select,input,label")) return;
        setFold(card, !card.classList.contains("is-folded"), true);
      });
      var def = card.getAttribute("data-fold") === "closed";
      setFold(card, Object.prototype.hasOwnProperty.call(saved, card._foldKey) ? saved[card._foldKey] : def, false);
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-m-limit]"), function (list) {
      if (list._limitInit) return;
      var n = parseInt(list.getAttribute("data-m-limit"), 10) || 3;
      var items = Array.prototype.filter.call(list.children, function (c) { return !c.classList.contains("m-more-row"); });
      /* never hide a single item behind a button (Baymard) */
      if (items.length <= n + 1) return;
      list._limitInit = true;
      items.forEach(function (c, k) { c.classList.toggle("m-extra", k >= n); });
      list.classList.add("m-limited");
      var more = document.createElement(list.tagName === "TBODY" ? "tr" : list.tagName === "UL" || list.tagName === "OL" ? "li" : "div");
      more.className = "m-more-row";
      var inner = '<button type="button" class="m-more" aria-expanded="false">Show all ' + items.length + "</button>";
      more.innerHTML = list.tagName === "TBODY" ? '<td colspan="99">' + inner + "</td>" : inner;
      list.appendChild(more);
      more.querySelector("button").addEventListener("click", function () {
        var limited = list.classList.toggle("m-limited");
        this.setAttribute("aria-expanded", limited ? "false" : "true");
        this.textContent = limited ? "Show all " + items.length : "Show fewer";
        /* after expanding, move focus to the first newly shown item (BBC GEL load-more pattern), without jumping the page */
        if (!limited && items[n]) { items[n].setAttribute("tabindex", "-1"); items[n].focus({ preventScroll: true }); }
      });
    });
  }
  /* pages render cards with JS after app.js loads, so fold once the page script has run */
  if (document.readyState === "complete") initFolds(); else window.addEventListener("load", initFolds);
  W.initFolds = initFolds;

  window.addEventListener("load", function () {
    requestAnimationFrame(function () { setTimeout(settleAnchor, 50); });
    /* web fonts change line wrapping and page height; settle again once they're in */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(settleAnchor, 50); });
  });
})(window.WSW);
