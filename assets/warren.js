/* Warren — Wall Street Warriors' chat helper. One stylesheet, one script, no libraries.
   Config (optional):  window.WARREN = { endpoint: "https://…", name: "Warren" }
   Transport: POST {endpoint}/chat with { code, page:{title,url}, messages:[{role,content}] } (last 12 turns).
   Reply is text/event-stream, one JSON object per "data:" line: {delta} | {status} | {done} | {error}.
   Without an endpoint, or offline, a small local fallback answers from WSW.data (dates, roster, links, roles). */
(function () {
  "use strict";
  /* config: window.WARREN wins, else the site data (assets/data.js), else nothing */
  var CFG = window.WARREN || (window.WSW && window.WSW.data && window.WSW.data.warren) || {};
  var NAME = CFG.name || "Warren";
  var ENDPOINT = String(CFG.endpoint || "").replace(/\/+$/, "");
  var W = window.WSW || {};
  var D = W.data || null;
  var KEEP = 20, SEND = 12, GAP = 5 * 60000;
  var PHONE = window.matchMedia ? window.matchMedia("(max-width:700px)") : { matches: false, addEventListener: function () {} };
  var STARTERS = ["What's Pile A?", "When is the IPS due?", "How does WInS connect to Laura's money?", "What's my job?"];

  /* ---------- storage (try/catch: private mode, blocked storage) ---------- */
  var store = {
    get: function (k, fb) { try { var v = localStorage.getItem("warren:" + k); return v === null ? fb : JSON.parse(v); } catch (e) { return fb; } },
    set: function (k, v) { try { localStorage.setItem("warren:" + k, JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem("warren:" + k); } catch (e) {} }
  };
  var session = {
    get: function (k) { try { return sessionStorage.getItem("warren:" + k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem("warren:" + k, v); } catch (e) {} }
  };

  /* ---------- mascot + icons ---------- */
  var MASCOT =
    '<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><g class="head">' +
    '<path class="orange" d="M16 21C11 17 9 11 12 5c4 2 8 7 9 13z"/><path class="orange" d="M48 21c5-4 7-10 4-16-4 2-8 7-9 13z"/>' +
    '<ellipse class="blue" cx="9" cy="36" rx="6" ry="4" transform="rotate(-18 9 36)"/><ellipse class="blue" cx="55" cy="36" rx="6" ry="4" transform="rotate(18 55 36)"/>' +
    '<circle class="navy" cx="32" cy="34" r="22"/>' +
    '<path class="blue" d="M26 14c1-4 4-5 6-3 2-2 5-1 6 3-4-2-8-2-12 0z"/>' +
    '<g class="eyes"><circle class="white" cx="24" cy="31" r="6.5"/><circle class="white" cx="40" cy="31" r="6.5"/>' +
    '<g class="pupils"><circle class="dark" cx="25.4" cy="32" r="3.2"/><circle class="dark" cx="38.6" cy="32" r="3.2"/>' +
    '<circle class="white" cx="26.5" cy="30.8" r="1.1"/><circle class="white" cx="39.7" cy="30.8" r="1.1"/></g></g>' +
    '<ellipse class="blue" cx="32" cy="45.5" rx="12" ry="7.5"/><circle class="dark" cx="27.5" cy="45" r="1.8"/><circle class="dark" cx="36.5" cy="45" r="1.8"/>' +
    '<path class="line" d="M27.5 49.5c2.5 2.2 6.5 2.2 9 0"/></g></svg>';
  function mascot(cls) { return '<span class="wn-mascot' + (cls ? " " + cls : "") + '">' + MASCOT + "</span>"; }
  var ICONS = {
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'
  };
  function icon(name) {
    if (W.icon && (name === "x" || name === "arrowUp")) return W.icon(name);
    return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || "") + "</svg>";
  }

  /* ---------- markdown subset: **bold**, *italic*, `code`, lists, [links](https://…). Everything is escaped first. ---------- */
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function inline(s) {
    var codes = [];
    s = s.replace(/`([^`\n]+)`/g, function (m, c) { codes.push("<code>" + c + "</code>"); return "\u0001" + (codes.length - 1) + "\u0001"; });
    /* absolute http(s) links, or a bare site page like calendar.html#e=ips */
    s = s.replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+|[\w-]+\.html(?:[#?][^\s)]*)?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    s = s.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,;:!?]|$)/g, "$1<em>$2</em>");
    return s.replace(/\u0001(\d+)\u0001/g, function (m, i) { return codes[+i]; });
  }
  function md(text) {
    var lines = String(text == null ? "" : text).replace(/\r\n?/g, "\n").split("\n");
    var out = [], para = [], list = null, m;
    function flushPara() { if (para.length) { out.push("<p>" + para.map(inline).join("<br>") + "</p>"); para = []; } }
    function flushList() { if (list) { out.push("<" + list.tag + ">" + list.items.map(function (i) { return "<li>" + inline(i) + "</li>"; }).join("") + "</" + list.tag + ">"); list = null; } }
    for (var i = 0; i < lines.length; i++) {
      var ln = esc(lines[i]);
      if ((m = /^\s*[-*•]\s+(.*)$/.exec(ln))) { flushPara(); if (!list || list.tag !== "ul") { flushList(); list = { tag: "ul", items: [] }; } list.items.push(m[1]); continue; }
      if ((m = /^\s*\d+[.)]\s+(.*)$/.exec(ln))) { flushPara(); if (!list || list.tag !== "ol") { flushList(); list = { tag: "ol", items: [] }; } list.items.push(m[1]); continue; }
      if ((m = /^\s*#{1,4}\s+(.*)$/.exec(ln))) { flushPara(); flushList(); out.push("<p><strong>" + inline(m[1]) + "</strong></p>"); continue; }
      if (!ln.trim()) { flushPara(); flushList(); continue; }
      flushList(); para.push(ln);
    }
    flushPara(); flushList();
    return out.join("");
  }

  /* ---------- dates, via app.js when it's there ---------- */
  function fmtDate(iso) { return W.fmtDate ? W.fmtDate(iso, { weekday: true }) : new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); }
  function fmtWhen(e) {
    var s = fmtDate(e.date);
    if (/T\d\d:\d\d/.test(e.date) && W.fmtTimes) s += ", " + W.fmtTimes(e.date);
    if (W.daysUntil && W.relative) s += " (" + W.relative(W.daysUntil(e.date)) + ")";
    return s;
  }
  function fmtTime(t) { return new Date(t).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).replace(" AM", " a.m.").replace(" PM", " p.m."); }
  function sameDay(a, b) { a = new Date(a); b = new Date(b); return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }

  /* ---------- local fallback: a few honest answers from the site data ---------- */
  var NAMED = [
    [/\broster\b/, "roster"], [/trading notes?|notes analysis/, "notes"], [/\bips\b|investment policy/, "ips"], [/final report|\breport\b/, "report"],
    [/\bpractice\b/, "practice-end"], [/trading (begins|starts|opens)|competition trading|first day of trading/, "trading"], [/\bfinale\b|philadelphia/, "finale"], [/\bmeeting\b/, "meeting"]
  ];
  function local(q) {
    if (!D) return "";
    var s = String(q).toLowerCase(), T = D.team || {}, i;
    var dateish = /\b(due|deadline|when|date|dates|calendar|schedule|next|upcoming|soon)\b/.test(s);
    var named = [];
    for (i = 0; i < NAMED.length; i++) if (NAMED[i][0].test(s)) named.push(NAMED[i][1]);

    if (/\bpile\b|operating reserve|\breserve\b/.test(s) && D.client && D.client.obligations) {
      var op = D.client.obligations[0], res = D.client.math && D.client.math.reserve;
      return "**Pile A is the operating reserve.** " + op.what + " " + (res ? "It costs " + money(res[0].cost) + " if held in cash and " + money(res[2].cost) + " laddered at 4%. " : "") +
        "**Pile B is what's left** in 2033 after the reserve is set aside; we recommend how much of it goes to the residency.\n\nFull story: the Guide and Case pages.";
    }
    if (/\b(job|jobs|role|roles|assign|assigned|owns?)\b/.test(s) && D.roles) {
      var picks = (W.store && W.store.get("roles", {})) || {};
      var lines = D.roles.map(function (r) {
        var id = r.fixed || picks[r.id] || r.suggest || "", mem = id && W.member ? W.member(id) : null;
        return "- **" + r.title + "**: " + (mem ? mem.name : id || "open") + " — " + r.owns;
      });
      return "I can't tell who you are, so here are all the roles:\n\n" + lines.join("\n") + "\n\nPicks are saved per browser on the Team page.";
    }
    if (/\bwins\b|simulator|stocktrak|surveymonkey|portal|\bapply\b|login|\blinks?\b/.test(s) && T.simulator) {
      return "- [" + T.simulator.name + "](" + T.simulator.url + ") — " + T.simulator.note + "\n- [" + T.portal.name + "](" + T.portal.url + ") — " + T.portal.note +
        (D.client && D.client.winsNote ? "\n\n" + D.client.winsNote : "");
    }
    if (dateish || named.length) {
      var evs = [];
      if (named.length && W.eventById) { for (i = 0; i < named.length; i++) { var e = W.eventById(named[i]); if (e) evs.push(e); } }
      if (!evs.length && W.upcoming) evs = W.upcoming(6);
      if (!evs.length) return "";
      return "**Dates from the site:**\n\n" + evs.map(function (e) {
        return "- **" + e.title + "** — " + (e.tbd ? "TBD, " + e.window : fmtWhen(e)) + (e.official === false ? " (internal)" : "");
      }).join("\n") + "\n\nEverything is on the Calendar page.";
    }
    if (/\b(who|team|members?|advisor|coach)\b/.test(s) && T.members) {
      return "**" + T.name + "** — " + T.members.map(function (m) { return m.name + (m.note ? " (" + m.note.replace(/\.$/, "") + ")" : ""); }).join(", ") +
        ". Advisor: " + (T.advisor.name || "") + (T.advisor.fullName ? " (" + T.advisor.fullName + ")" : "") + ".";
    }
    return "";
  }
  function money(n) { return W.money ? W.money(n) : "$" + Math.round(n).toLocaleString("en-US"); }

  /* ---------- DOM ---------- */
  var root, launch, hint, panel, headMascot, statusEl, statusT, log, starters, form, codeBox, codeIn, codeNote, ta, sendBtn, stopBtn;
  var state = { open: false, busy: false, log: store.get("log", []), code: store.get("code", "") || "", pending: null, ctrl: null, typing: null, lastT: 0 };
  if (!(state.log instanceof Array)) state.log = [];

  function build() {
    root = document.createElement("div");
    root.className = "wn"; root.id = "warren";
    root.innerHTML =
      '<button type="button" class="wn-launch" aria-label="Ask ' + esc(NAME) + '" aria-expanded="false" aria-controls="wn-panel" aria-haspopup="dialog">' + mascot() + "</button>" +
      '<div class="wn-hint" aria-hidden="true">Ask ' + esc(NAME) + "</div>" +
      '<section class="wn-panel" id="wn-panel" role="dialog" aria-modal="true" aria-labelledby="wn-title" hidden>' +
        '<div class="wn-head">' + mascot() +
          '<div class="wn-title"><b id="wn-title">' + esc(NAME) + "</b><small>Team site helper</small></div>" +
          '<span class="wn-status" data-state="online" role="status"><i></i><span class="wn-status-t">Online</span></span>' +
          '<button type="button" class="wn-hbtn wn-clear" aria-label="Clear chat" title="Clear chat">' + icon("trash") + "</button>" +
          '<button type="button" class="wn-hbtn wn-close" aria-label="Close" title="Close">' + icon("x") + "</button>" +
        "</div>" +
        '<div class="wn-log" role="log" aria-label="Conversation"></div>' +
        '<form class="wn-form" novalidate>' +
          '<div class="wn-code" hidden><label for="wn-code-in">Team code</label>' +
            '<div class="wn-code-row"><input id="wn-code-in" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" aria-describedby="wn-code-note"><button type="button" class="btn sm wn-code-go">Continue</button></div>' +
            '<small id="wn-code-note">Ask Michael if you don\'t have it. Saved in this browser.</small></div>' +
          '<textarea class="wn-in" rows="1" aria-label="Message ' + esc(NAME) + '" placeholder="Ask about the season…" enterkeyhint="send"></textarea>' +
          '<button type="submit" class="btn wn-send">' + icon("arrowUp") + "Send</button>" +
          '<button type="button" class="btn orange wn-stop" hidden>' + icon("stop") + "Stop</button>" +
        "</form>" +
      "</section>";
    document.body.appendChild(root);
    launch = root.querySelector(".wn-launch"); hint = root.querySelector(".wn-hint"); panel = root.querySelector(".wn-panel");
    headMascot = panel.querySelector(".wn-head .wn-mascot"); statusEl = panel.querySelector(".wn-status"); statusT = panel.querySelector(".wn-status-t");
    log = panel.querySelector(".wn-log"); form = panel.querySelector(".wn-form");
    codeBox = form.querySelector(".wn-code"); codeIn = form.querySelector("#wn-code-in"); codeNote = form.querySelector("#wn-code-note");
    ta = form.querySelector(".wn-in"); sendBtn = form.querySelector(".wn-send"); stopBtn = form.querySelector(".wn-stop");
  }

  /* ---------- rendering ---------- */
  function nearBottom() { return log.scrollHeight - log.scrollTop - log.clientHeight < 48; }
  function scrollLog(force) { if (force || nearBottom()) log.scrollTop = log.scrollHeight; }
  function divider(t) {
    if (state.lastT && t - state.lastT < GAP) return;
    var el = document.createElement("div"); el.className = "wn-when";
    el.textContent = (sameDay(t, Date.now()) ? "" : fmtDate(new Date(t)) + ", ") + fmtTime(t);
    log.appendChild(el);
  }
  function addBubble(role, html, t) {
    if (role !== "sys") { divider(t || Date.now()); state.lastT = t || Date.now(); }
    var el = document.createElement("div");
    el.className = "wn-msg " + (role === "user" ? "user" : role === "sys" ? "sys" : "bot");
    el.innerHTML = (role === "assistant" ? mascot() : "") + '<div class="wn-bubble"></div>';
    var b = el.querySelector(".wn-bubble");
    if (role === "user") b.textContent = html; else b.innerHTML = html;
    if (state.typing && state.typing.parentNode === log) log.insertBefore(el, state.typing); else log.appendChild(el);
    return el;
  }
  function note(text, bad) { var el = addBubble("sys", esc(text)); if (bad) el.classList.add("bad"); scrollLog(true); return el; }
  function renderStarters() {
    if (starters) starters.remove();
    starters = document.createElement("div");
    starters.className = "wn-starters"; starters.setAttribute("role", "group"); starters.setAttribute("aria-label", "Suggested questions");
    starters.innerHTML = STARTERS.map(function (s) { return '<button type="button" class="wn-chip">' + esc(s) + "</button>"; }).join("");
    log.appendChild(starters);
  }
  function renderIntro() {
    addBubble("assistant", md("Hi, I'm " + NAME + ". I know this site: deadlines, the case, the rules, WInS. Ask me anything about the season."));
    renderStarters();
  }
  function renderLog() {
    log.innerHTML = ""; state.lastT = 0; state.typing = null; starters = null;
    log.classList.add("wn-still");
    if (!state.log.length) renderIntro();
    for (var i = 0; i < state.log.length; i++) {
      var m = state.log[i];
      var el = addBubble(m.role, m.role === "user" ? m.content : md(m.content), m.t);
      var b = el && el.querySelector ? el.querySelector(".wn-bubble") : null;
      if (b) b.style.animation = "none"; /* restored turns appear as they were, without popping */
    }
    scrollLog(true);
    log.classList.remove("wn-still");
  }
  function push(role, content, extra) {
    var m = { role: role, content: content, t: Date.now() };
    if (extra) for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) m[k] = extra[k];
    state.log.push(m);
    while (state.log.length > KEEP) state.log.shift();
    store.set("log", state.log);
    return m;
  }

  /* typing indicator: dots plus a status line ("Searching the site…") */
  function showTyping() {
    if (state.typing) return;
    var el = document.createElement("div");
    el.className = "wn-typing";
    el.innerHTML = mascot("is-thinking") + '<div><div class="wn-dots" aria-label="' + esc(NAME) + ' is typing"><i></i><i></i><i></i></div><span class="wn-state"></span></div>';
    log.appendChild(el); state.typing = el; scrollLog(true);
  }
  function typingState(s) {
    if (!state.typing) return;
    var t = s === "searching" ? "Searching the site…" : s === "thinking" ? "Thinking…" : String(s || "");
    state.typing.querySelector(".wn-state").textContent = t;
    scrollLog();
  }
  function hideTyping() { if (state.typing) { state.typing.remove(); state.typing = null; } }

  /* the streaming bubble: re-rendered from the full text on each frame, caret at the end */
  var caret = document.createElement("span"); caret.className = "wn-caret"; caret.setAttribute("aria-hidden", "true");
  function paint(bubble, text, streaming) {
    /* mid-stream, an unclosed ** or ` would show raw; close it until the rest arrives */
    if (streaming) {
      if ((text.split("**").length - 1) % 2) text += "**";
      if ((text.split("`").length - 1) % 2) text += "`";
    }
    bubble.innerHTML = md(text);
    if (streaming) {
      var last = bubble.lastElementChild;
      while (last && /^(UL|OL)$/.test(last.tagName) && last.lastElementChild) last = last.lastElementChild;
      (last || bubble).appendChild(caret);
    }
    scrollLog();
  }

  /* ---------- status + mascot moods ---------- */
  function setStatus(s, label) {
    statusEl.setAttribute("data-state", s);
    statusT.textContent = label || (s === "thinking" ? "Thinking" : s === "offline" ? "Offline" : "Online");
  }
  /* relay: null = not checked yet, "up", "down" (unreachable or no key), "resting" (daily budget used) */
  var relay = ENDPOINT ? null : "down", relayAt = 0;
  function idleStatus() {
    if (navigator.onLine === false) return setStatus("offline");
    if (relay === "down") return setStatus("offline", "Unavailable");
    if (relay === "resting") return setStatus("offline", "Resting");
    setStatus("online");
  }
  function checkRelay(force) {
    if (!ENDPOINT || state.busy || navigator.onLine === false) return;
    if (!force && Date.now() - relayAt < 60000) return;
    relayAt = Date.now();
    var ctrl = window.AbortController ? new AbortController() : null;
    var t = setTimeout(function () { if (ctrl) ctrl.abort(); }, 6000);
    fetch(ENDPOINT + "/health", { cache: "no-store", signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (h) {
        relay = !h || !h.ok || h.keyConfigured === false ? "down"
          : h.budget && h.budget.usedUsd >= h.budget.capUsd ? "resting" : "up";
      })
      .catch(function () { relay = "down"; })
      .then(function () { clearTimeout(t); if (!state.busy) idleStatus(); });
  }
  function nod(el) {
    if (!el) return;
    el.classList.remove("is-nod"); void el.offsetWidth; el.classList.add("is-nod");
    setTimeout(function () { el.classList.remove("is-nod"); }, 800);
  }
  function think(on) { headMascot.classList.toggle("is-thinking", !!on); launch.querySelector(".wn-mascot").classList.toggle("is-thinking", !!on); }
  function setBusy(on) {
    if (!on && document.activeElement === stopBtn) ta.focus({ preventScroll: true });
    state.busy = on;
    sendBtn.disabled = on; sendBtn.hidden = on; stopBtn.hidden = !on;
    ta.readOnly = on;
    if (on) setStatus("thinking"); else idleStatus();
    think(on);
  }

  /* ---------- open / close ---------- */
  function focusables() {
    return Array.prototype.filter.call(panel.querySelectorAll("button,input,textarea,a[href],[tabindex]:not([tabindex='-1'])"), function (el) {
      return !el.disabled && !el.hidden && !el.closest("[hidden]") && el.offsetParent !== null;
    });
  }
  function fitViewport() {
    if (!state.open || !PHONE.matches || !window.visualViewport) { panel.style.height = ""; panel.style.top = ""; return; }
    var vv = window.visualViewport;
    panel.style.height = Math.round(vv.height) + "px";
    panel.style.top = Math.round(vv.offsetTop) + "px";
  }
  function setOpen(open, quiet) {
    state.open = open; store.set("open", open && !(window.matchMedia && window.matchMedia("(max-width:700px)").matches)); /* phones: never reopen the full-screen sheet on the next page */
    panel.hidden = !open;
    panel.setAttribute("aria-modal", PHONE.matches ? "true" : "false");
    launch.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("wn-lock", open && PHONE.matches);
    if (open) {
      hideHint(); fitViewport(); scrollLog(true); nod(headMascot); checkRelay(false);
      if (!quiet) (codeBox.hidden ? ta : codeIn).focus({ preventScroll: true });
    } else {
      fitViewport();
      if (!quiet) launch.focus({ preventScroll: true });
    }
  }
  function showHint() { hint.classList.add("is-on"); }
  function hideHint() { hint.classList.remove("is-on"); }

  /* ---------- team code ---------- */
  function showCodeForm(msg) {
    codeBox.hidden = false; codeIn.value = "";
    codeBox.classList.toggle("is-bad", !!msg);
    codeNote.textContent = msg || "Ask Michael if you don't have it. Saved in this browser.";
    if (state.open) codeIn.focus({ preventScroll: true });
  }
  function submitCode() {
    var v = codeIn.value.trim();
    if (!v) { codeIn.focus(); return; }
    state.code = v; codeBox.hidden = true; codeBox.classList.remove("is-bad");
    if (state.pending) { var t = state.pending; state.pending = null; push("user", t); addBubble("user", t); }
    request();
    ta.focus({ preventScroll: true });
  }

  /* ---------- send / stream ---------- */
  function ask(text) {
    text = String(text || "").trim();
    if (!text || state.busy) return;
    if (starters) { if (starters.contains(document.activeElement)) ta.focus({ preventScroll: true }); starters.remove(); starters = null; }
    if (!state.code) { state.pending = text; ta.value = ""; grow(); showCodeForm(""); return; }
    push("user", text); addBubble("user", text); scrollLog(true);
    ta.value = ""; grow();
    request();
  }
  function request() {
    var lastUser = "";
    for (var i = state.log.length - 1; i >= 0; i--) if (state.log[i].role === "user") { lastUser = state.log[i].content; break; }
    setBusy(true); showTyping();
    if (!ENDPOINT) { hideTyping(); return offline("I'm not connected to a server yet", lastUser); }
    if (navigator.onLine === false) { hideTyping(); return offline("Looks like you're offline", lastUser); }
    var ctrl = window.AbortController ? new AbortController() : null;
    state.ctrl = ctrl;
    var msgs = [];
    state.log.forEach(function (m) {
      if (m.local || (m.role !== "user" && m.role !== "assistant") || !m.content) return;
      var last = msgs[msgs.length - 1];
      if (last && last.role === m.role) last.content += "\n\n" + m.content; else msgs.push({ role: m.role, content: m.content });
    });
    msgs = msgs.slice(-SEND);
    while (msgs.length && msgs[0].role !== "user") msgs.shift();
    var body = { code: state.code, page: { title: document.title, url: location.href }, messages: msgs };
    var bubble = null, buf = "", gotError = false;
    function startBubble() { if (!bubble) { hideTyping(); var el = addBubble("assistant", ""); el.setAttribute("aria-busy", "true"); bubble = el.querySelector(".wn-bubble"); } return bubble; }
    function onEvent(ev) {
      if (!ev || typeof ev !== "object") return;
      if (typeof ev.delta === "string") { buf += ev.delta; paint(startBubble(), buf, true); }
      else if (ev.status) typingState(ev.status);
      else if (ev.error) { gotError = true; note(String(ev.error), true); }
    }
    function finish(aborted) {
      if (!state.log.length) { hideTyping(); state.ctrl = null; setBusy(false); return; } /* cleared mid-request */
      hideTyping(); state.ctrl = null;
      if (bubble) {
        var wrap = bubble.parentNode; wrap.removeAttribute("aria-busy");
        if (buf.trim()) { paint(bubble, buf, false); push("assistant", buf); }
        else wrap.remove();
      }
      if (aborted) note("Stopped.");
      else if (!buf.trim() && !gotError) note(NAME + " didn't answer. Try again.", true);
      setBusy(false);
      if (buf.trim()) { nod(headMascot); nod(launch.querySelector(".wn-mascot")); }
      scrollLog(true);
    }
    fetch(ENDPOINT + "/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: ctrl ? ctrl.signal : undefined })
      .then(function (res) {
        relay = res.status === 402 ? "resting" : res.status >= 500 ? "down" : "up"; relayAt = Date.now();
        if (res.status === 401) { hideTyping(); state.code = ""; store.del("code"); setBusy(false); showCodeForm("That code didn't work. Try again."); return; }
        if (res.status === 429) return fail(NAME + " is busy, try again in a minute.");
        if (res.status === 402) return fail(NAME + " has used today's budget. Try again tomorrow.");
        if (!res.ok) return fail(NAME + " hit a problem (HTTP " + res.status + "). Try again in a bit.");
        store.set("code", state.code);
        if (!res.body || !res.body.getReader) return res.text().then(function (t) { t.split("\n").forEach(handleLine); finish(false); });
        var reader = res.body.getReader(), dec = new TextDecoder(), rest = "";
        function pump() {
          return reader.read().then(function (r) {
            if (r.done) { if (rest) handleLine(rest); finish(false); return; }
            rest += dec.decode(r.value, { stream: true });
            var idx;
            while ((idx = rest.indexOf("\n")) >= 0) { handleLine(rest.slice(0, idx)); rest = rest.slice(idx + 1); }
            return pump();
          });
        }
        return pump();
      })
      .catch(function (err) {
        if (err && err.name === "AbortError") { finish(true); return; }
        hideTyping();
        relay = "down"; relayAt = Date.now();
        if (bubble) { finish(false); return; }
        offline("I can't reach " + NAME + "'s server right now", lastUser);
      });
    function handleLine(line) {
      line = line.replace(/\r$/, "");
      if (line.indexOf("data:") !== 0) return;
      var j = line.slice(5).trim();
      if (!j || j === "[DONE]") return;
      try { onEvent(JSON.parse(j)); } catch (e) {}
    }
    function fail(msg) { hideTyping(); note(msg, true); setBusy(false); state.ctrl = null; }
  }
  /* offline / unreachable: say so, then answer from the site if the question is one of the obvious ones */
  function offline(why, q) {
    var ans = local(q);
    if (ans) {
      var text = why + ", but here's what the site says:\n\n" + ans;
      addBubble("assistant", md(text)); push("assistant", text, { local: true });
    } else {
      note(why + ", and that's not something the site data answers. Try again in a bit.", true);
    }
    setBusy(false); state.ctrl = null; nod(headMascot); scrollLog(true);
  }
  function stop() { if (state.ctrl) state.ctrl.abort(); }
  function clear() {
    stop();
    state.log = []; store.del("log"); state.pending = null;
    codeBox.hidden = true;
    renderLog();
    if (W.toast) W.toast("Chat cleared");
  }

  /* ---------- composer ---------- */
  var taMax = 0;
  function grow() {
    if (!taMax) { var cs = getComputedStyle(ta); taMax = (parseFloat(cs.lineHeight) || 21) * 5 + (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0) + 2; }
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, taMax) + "px";
  }

  /* ---------- wiring ---------- */
  function init() {
    if (document.getElementById("warren")) return;
    build();
    renderLog();
    idleStatus();

    launch.addEventListener("click", function () { setOpen(!state.open); });
    panel.querySelector(".wn-close").addEventListener("click", function () { setOpen(false); });
    panel.querySelector(".wn-clear").addEventListener("click", clear);
    log.addEventListener("click", function (e) { var c = e.target.closest(".wn-chip"); if (c) ask(c.textContent); });
    form.addEventListener("submit", function (e) { e.preventDefault(); ask(ta.value); });
    stopBtn.addEventListener("click", stop);
    form.querySelector(".wn-code-go").addEventListener("click", submitCode);
    codeIn.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); submitCode(); } });
    ta.addEventListener("input", grow);
    ta.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); ask(ta.value); }
    });

    /* Esc closes; Tab wraps inside the dialog */
    panel.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); setOpen(false); return; }
      if (e.key !== "Tab") return;
      var f = focusables(); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && state.open && !e.defaultPrevented) setOpen(false); });

    window.addEventListener("online", function () { idleStatus(); if (state.open) checkRelay(true); }); window.addEventListener("offline", idleStatus);
    if (window.visualViewport) { window.visualViewport.addEventListener("resize", fitViewport); window.visualViewport.addEventListener("scroll", fitViewport); }
    window.addEventListener("resize", fitViewport);
    if (PHONE.addEventListener) PHONE.addEventListener("change", function () { document.body.classList.toggle("wn-lock", state.open && PHONE.matches); fitViewport(); });

    /* restore: open state comes back without stealing focus; the hint shows once per visit, only while closed */
    if (store.get("open", false) && !PHONE.matches) setOpen(true, true);
    else if (!session.get("hinted")) {
      session.set("hinted", "1");
      setTimeout(function () { if (!state.open) showHint(); }, 1200);
      setTimeout(hideHint, 7500);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();

  /* small public surface, for pages and for the demo's self-test */
  window.Warren = {
    open: function () { setOpen(true); }, close: function () { setOpen(false); }, toggle: function () { setOpen(!state.open); },
    isOpen: function () { return state.open; }, ask: ask, stop: stop, clear: clear, md: md, local: local
  };
})();
