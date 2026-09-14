/* Wall Street Warriors — shared behavior: dates, countdowns, ticker, icons, storage, calendar export. */
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
    star: '<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1.1 6.3L12 17.5 6.4 20.4l1.1-6.3L3 9.7l6.2-.9z"/>'
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
    fillIcons(document);
    Array.prototype.forEach.call(document.querySelectorAll(".reveal"), function (el, i) { if (!el.style.getPropertyValue("--i")) el.style.setProperty("--i", Math.min(i, 8)); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initShell); else initShell();
})(window.WSW);
