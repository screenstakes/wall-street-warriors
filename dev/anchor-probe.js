/* Anchor probe: reports where an in-page #id link actually landed, via the harness's postMessage channel. */
setTimeout(function () {
  var id = decodeURIComponent(location.hash.slice(1));
  var el = id && document.getElementById(id);
  var msg = "RESULT " + (el && Math.abs(el.getBoundingClientRect().top) < 40 ? "OK" : "FAIL") +
    " hash=#" + id + " found=" + !!el + " scrollY=" + Math.round(window.scrollY) +
    " targetTop=" + (el ? Math.round(el.getBoundingClientRect().top) : "n/a") +
    " targetDocY=" + (el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : "n/a") +
    " pageHeight=" + document.documentElement.scrollHeight + " viewport=" + window.innerHeight;
  try { window.parent.postMessage({ wswProbe: msg }, "*"); } catch (e) {}
}, 3000);
