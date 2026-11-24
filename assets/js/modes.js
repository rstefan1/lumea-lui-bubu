/* =====================================================================
   assets/js/modes.js – turns on the MODE of the village chosen in data/modes.js (one for every month: december, january ...).

   It runs in <head>, before the page is drawn:
     - chooses the mode: ?mode=<name> in the address, else MODE, else (with "auto") MODE_CALENDAR;
     - marks the page with the class "mode-<name>" and loads modes/<name>/mode.css,
       which shows the hidden seasonal shapes of the drawings and changes the colors;
     - when that file asks for it (--falling-count), lets snowflakes (or petals, leaves ...) fall over the page.

   The falling things are cheap for old phones and laptops:
     - a few dozen small elements, made once; after that no JavaScript runs at all;
     - they move only with CSS animations of "transform", which the graphics card does by itself;
     - fewer of them on small screens, on weak devices and with "Data Saver", none with "reduce motion";
     - the browser stops them while the page is not seen.
   ===================================================================== */
(function () {
  "use strict";

  var MONTHS = ["january", "february", "march", "april", "may", "june", "july",
    "august", "september", "october", "november", "december"];

  // "1 December" -> 1201 (month * 100 + day), or -1 if it cannot be read
  function dayOfYear(text) {
    var m = String(text || "").trim().toLowerCase().match(/^(\d{1,2})\s+([a-z]+)$/);
    var month = m ? MONTHS.indexOf(m[2]) : -1;
    return month < 0 ? -1 : (month + 1) * 100 + Number(m[1]);
  }

  function fromCalendar(now) {
    var today = (now.getMonth() + 1) * 100 + now.getDate();
    var list = window.MODE_CALENDAR || [];
    for (var i = 0; i < list.length; i++) {
      var from = dayOfYear(list[i].from), to = dayOfYear(list[i].to);
      if (from < 0 || to < 0) { continue; }
      // a period may go over the new year (1 December – 7 January)
      if (from <= to ? today >= from && today <= to : today >= from || today <= to) { return list[i].mode; }
    }
    return "normal";
  }

  var asked = (window.location.search.match(/[?&]mode=([a-z0-9-]+)/) || [])[1];
  var mode = asked || window.MODE || "auto";
  if (mode === "auto") { mode = fromCalendar(new Date()); }
  if (mode === "normal" || !/^[a-z0-9-]+$/.test(mode)) { return; }

  // the folder of the site, from the address of this script (the 404 page can be served at any address)
  var self = document.currentScript && document.currentScript.src;
  var base = self ? self.replace(/assets\/js\/modes\.js(\?.*)?$/, "") : "";

  var root = document.documentElement;
  root.classList.add("mode-" + mode);
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = base + "modes/" + mode + "/mode.css";
  link.setAttribute("blocking", "render");   // the village is not shown green first (where browsers know it)

  var cssReady = false, domReady = document.readyState !== "loading";
  link.onload = function () {
    cssReady = true;
    start();
    // the village draws again with the patches of the mode (assets/js/road.js and scenery.js)
    window.dispatchEvent(new Event("village-mode"));
  };
  document.head.appendChild(link);
  if (!domReady) { document.addEventListener("DOMContentLoaded", function () { domReady = true; start(); }); }

  /* ---------- The things falling over the page ---------- */
  function start() {
    if (!cssReady || !domReady || document.querySelector(".falling")) { return; }
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { return; }
    var style = getComputedStyle(root);
    var count = parseFloat(style.getPropertyValue("--falling-count")) || 0;
    var time = parseFloat(style.getPropertyValue("--falling-time")) || 12;
    var big = parseFloat(style.getPropertyValue("--falling-big")) || 0;
    if (count <= 0) { return; }

    // the count is for a big screen (1440 x 900): fewer on smaller ones
    count *= Math.min(1, Math.max(0.35, window.innerWidth * window.innerHeight / (1440 * 900)));
    var nav = window.navigator;
    if ((nav.hardwareConcurrency && nav.hardwareConcurrency <= 2) || (nav.deviceMemory && nav.deviceMemory <= 2) ||
        (nav.connection && nav.connection.saveData)) {
      count *= 0.5;
    }
    count = Math.min(80, Math.round(count));

    var html = "";
    for (var i = 0; i < count; i++) {
      var isBig = Math.random() * 100 < big;
      var size = isBig ? 12 + Math.random() * 8 : 3 + Math.random() * 5;
      var duration = time * (0.75 + Math.random() * 0.6);
      html += '<i class="falling__item falling__item--' + (i % 3 + 1) + (isBig ? " falling__item--big" : "") + '" style="left:' +
        (Math.random() * 100).toFixed(1) + "%;width:" + size.toFixed(1) + "px;height:" + size.toFixed(1) + "px;opacity:" +
        (0.6 + Math.random() * 0.4).toFixed(2) + ";animation-duration:" + duration.toFixed(1) + "s;animation-delay:-" +
        (Math.random() * duration).toFixed(1) + 's"></i>';
    }
    var box = document.createElement("div");
    box.className = "falling";
    box.setAttribute("aria-hidden", "true");
    box.innerHTML = html;
    document.body.appendChild(box);
  }
})();
