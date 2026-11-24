/* =====================================================================
   assets/js/road.js – the COUNTRY ROAD that winds down through the middle of the village.

   It is drawn like the road of the landscape at the top (assets/img/landscape.svg), so the two look like one:
     - it starts exactly where the road of the landscape ends, just as wide (same numbers as in
       tools/draw-landscape.py), and winds down between the buildings (one on the left, one on the right);
     - it is packed earth with an uneven edge and a width that changes a little, like a real road;
     - the wheel tracks and the grass in the middle are there only here and there, as on a road in the village;
     - tufts of grass grow over its edges, a few pebbles lie on it;
     - a path with stones along it goes from the road to the door of every building, and at every crossing
       a wooden sign with an arrow in the color of the game points to it;
     - in the free places: the fields and the things of assets/js/scenery.js (only farm animals, fruit trees,
       haystacks and fir trees next to the games; the rest of the village under the last game).
   On phones held upright the road winds along the free side of the buildings.

   It is drawn again only when the screen changes (rotating the phone, another window size);
   nothing in it moves, so it costs nothing afterwards.
   ===================================================================== */
(function () {
  "use strict";

  var village = document.getElementById("village");
  if (!village) { return; }
  var landscape = document.querySelector(".landscape");
  var NS = "http://www.w3.org/2000/svg";

  // the end of the road of the landscape (tools/draw-landscape.py): picture 1600 x 420, shown with "cover"
  // centered at the bottom; the road ends at x = 800, 60 wide
  var PANO_W = 1600, PANO_H = 420, ROAD_END_X = 800, ROAD_END_W = 60;

  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "village-road");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  village.insertBefore(svg, village.firstChild);

  function r(v) { return Math.round(v * 10) / 10; }

  // a small random generator with a fixed start: the road looks the same at every visit
  function rng(seed) {
    return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  }

  /* ---------- The middle line of the road: a smooth curve through the points (Catmull-Rom) ---------- */
  function sample(points) {
    var out = [];
    for (var i = 0; i < points.length - 1; i++) {
      var p0 = points[i - 1] || points[i], p1 = points[i], p2 = points[i + 1], p3 = points[i + 2] || p2;
      var c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      var c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      var n = Math.max(4, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 6));
      for (var k = (i ? 1 : 0); k <= n; k++) {
        var t = k / n, u = 1 - t;
        out.push([
          u * u * u * p1[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p2[0],
          u * u * u * p1[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p2[1]
        ]);
      }
    }
    // distance along the road and the direction across it (the normal) at every point
    var s = 0;
    return out.map(function (p, i) {
      var a = out[Math.max(0, i - 1)], b = out[Math.min(out.length - 1, i + 1)];
      var dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
      if (i) { s += Math.hypot(p[0] - out[i - 1][0], p[1] - out[i - 1][1]); }
      return { x: p[0], y: p[1], s: s, nx: -dy / len, ny: dx / len };
    });
  }

  function line(pts) {
    return "M" + pts.map(function (p) { return r(p[0]) + " " + r(p[1]); }).join(" L");
  }

  // a smooth line through the points (the corners are rounded with curves through the middles)
  function smooth(pts, closed) {
    var d = "M" + r(pts[0][0]) + " " + r(pts[0][1]);
    for (var i = 1; i < pts.length - 1; i++) {
      d += " Q" + r(pts[i][0]) + " " + r(pts[i][1]) + " " + r((pts[i][0] + pts[i + 1][0]) / 2) + " " + r((pts[i][1] + pts[i + 1][1]) / 2);
    }
    var last = pts[pts.length - 1];
    return d + " L" + r(last[0]) + " " + r(last[1]) + (closed ? " Z" : "");
  }

  /* A piece of road (the main road or a path to a door), drawn like in a picture book:
     a soft shadow in the grass, the earth with a clean darker rim, a lighter middle (it looks rounded),
     two quiet wheel tracks, little stones along the edge here and there, small tufts of grass in groups. */
  function strip(pts, widthAt, opts, random) {
    var left = [], right = [], lightL = [], lightR = [], ruts = [[], []];
    pts.forEach(function (p) {
      var w = widthAt(p.s) / 2;
      var j = 0.03 * Math.min(1, p.s / 80);     // the uneven edge starts slowly (the road joins the one of the landscape)
      var wl = w * (1 + j * Math.sin(p.s / 13 + opts.phase)), wr = w * (1 + j * Math.sin(p.s / 17 + opts.phase * 2));
      left.push([p.x + p.nx * wl, p.y + p.ny * wl]);
      right.push([p.x - p.nx * wr, p.y - p.ny * wr]);
      lightL.push([p.x + p.nx * w * 0.5, p.y + p.ny * w * 0.5]);
      lightR.push([p.x - p.nx * w * 0.42, p.y - p.ny * w * 0.42]);
      ruts[0].push([p.x + p.nx * w * 0.3, p.y + p.ny * w * 0.3]);
      ruts[1].push([p.x - p.nx * w * 0.3, p.y - p.ny * w * 0.3]);
    });
    var shape = left.concat(right.slice().reverse());
    var light = lightL.concat(lightR.slice().reverse());
    var out = '<path d="' + smooth(shape, true) + '" class="vr-ground-shadow" transform="translate(0 3)"/>' +
      '<path d="' + smooth(shape, true) + '" class="vr-earth vr-earth--open"/>' +
      '<path d="' + smooth(light, true) + '" class="vr-light"/>' +
      // the darker rim only along the two edges, not across the ends (so the road joins the one of the landscape)
      '<path d="' + smooth(left) + '" class="vr-rim"/><path d="' + smooth(right) + '" class="vr-rim"/>';
    if (opts.ruts) {
      out += '<path d="' + smooth(ruts[0]) + '" class="vr-rut"/><path d="' + smooth(ruts[1]) + '" class="vr-rut"/>';
    }
    // little stones along the edges, only on some stretches of the road
    [left, right].forEach(function (edge, side) {
      for (var i = 0; i < edge.length; i += 2) {
        if (!opts.border && Math.sin(pts[i].s / 95 + opts.phase * 3 + side * 2) < 0.6) { continue; }   // the paths to the doors: stones all along
        var e = edge[i];
        out += '<ellipse cx="' + r(e[0]) + '" cy="' + r(e[1]) + '" rx="' + r(2.6 + random() * 1.6) + '" ry="' + r(2 + random()) + '" class="vr-border-stone"/>';
      }
    });
    // a few pebbles on the road
    for (var i = 0; i < pts.length; i += 11) {
      if (random() < 0.6) { continue; }
      var p = pts[i], o = (random() - 0.5) * widthAt(p.s) * 0.5;
      out += '<ellipse cx="' + r(p.x + p.nx * o) + '" cy="' + r(p.y + p.ny * o) + '" rx="' + r(1.5 + random() * 1.2) + '" ry="' + r(1.1 + random() * 0.7) + '" class="vr-pebble"/>';
    }
    // small groups of 2 or 3 tufts of grass on the edges, sometimes with a flower
    function tuft(x, y, h) {
      return '<path d="M' + r(x) + " " + r(y) + " q-2 -" + r(h * 0.5) + " -4 -" + r(h * 0.8) + " M" + r(x) + " " + r(y) + " q0 -" + r(h * 0.6) + " 0 -" + r(h) +
        " M" + r(x) + " " + r(y) + " q2 -" + r(h * 0.5) + " 4 -" + r(h * 0.75) + '" class="vr-tuft"/>';
    }
    [left, right].forEach(function (edge) {
      for (var j = 4 + Math.floor(random() * 6); j < edge.length - 4; j += 10 + Math.floor(random() * 10)) {
        var e = edge[j], n = 2 + Math.floor(random() * 2);
        for (var t = 0; t < n; t++) { out += tuft(e[0] + (t - 1) * 5, e[1] + 2 + (t % 2) * 2, 7 + random() * 5); }
        if (random() < 0.35) {
          out += '<circle cx="' + r(e[0] + 4) + '" cy="' + r(e[1] - 8) + '" r="2.4" class="vr-flower' + (random() < 0.5 ? "" : " vr-flower--2") + '"/>';
        }
      }
    });
    // and a tuft in the middle of the road, now and then (only on the main road)
    if (opts.ruts) {
      for (var m = 18; m < pts.length - 6; m += 22 + Math.floor(random() * 14)) { out += tuft(pts[m].x, pts[m].y + 3, 6 + random() * 3); }
    }
    return out;
  }

  // a wooden sign on a post: an arrow board (in the color of the game) pointing to its building
  function signpost(x, y, dir, color, k) {
    return '<g transform="translate(' + r(x) + " " + r(y) + ") scale(" + r(dir * k) + " " + k + ')">' +
      '<ellipse cx="0" cy="0" rx="8" ry="2.5" class="vr-shadow"/><rect x="-2.5" y="-44" width="5" height="44" rx="1.5" class="vr-sign-post"/>' +
      '<path d="M-14 -44 H10 L20 -36 L10 -28 H-14 Z" fill="' + color + '" class="vr-sign-board"/>' +
      (window.SEASON_SHAPES ? window.SEASON_SHAPES.line([[-14, -44], [10, -44], [16, -39]], 3) : "") +
      '<path d="M-6 -36 H8 M3 -40 L8 -36 L3 -32" class="vr-sign-arrow"/></g>';
  }
  /* ---------- Drawing everything ---------- */
  function draw() {
    var box = village.getBoundingClientRect();
    var width = box.width, height = village.scrollHeight;
    var phone = width < 641;
    var places = Array.prototype.slice.call(village.querySelectorAll(".place"));
    if (!places.length) { svg.innerHTML = ""; return; }
    var road = phone ? 34 : width < 1051 ? 42 : 50;     // usual width of the road
    var random = rng(7);

    // where the road of the landscape ends, and how wide it is there
    var land = landscape ? landscape.getBoundingClientRect() : null;
    var scale = land ? Math.max(land.width / PANO_W, land.height / PANO_H) : 0.8;
    var startX = land ? land.left + (land.width - PANO_W * scale) / 2 + ROAD_END_X * scale - box.left : width / 2;
    var startY = land ? land.bottom - box.top - 3 : 0;
    var startW = ROAD_END_W * scale;

    // the points the road goes through: next to every building, on the side towards the middle
    var points = [[startX, startY], [startX, startY + 30]];
    var doors = [];
    places.forEach(function (place) {
      var pr = place.getBoundingClientRect(), sc = place.querySelector(".place__scene").getBoundingClientRect();
      var onLeft = place.classList.contains("place--left");
      var base = sc.bottom - box.top + 6;                       // just under the building, at its door
      var x = (onLeft ? pr.right + road * 0.75 : pr.left - road * 0.75) - box.left;
      x = Math.max(road * 0.7, Math.min(width - road * 0.7, x));
      if (phone) {
        // phones: the road goes along the whole building, on its free side
        points.push([x, pr.top - box.top + sc.height * 0.45], [x, pr.bottom - box.top - 30]);
      } else {
        points.push([x, base]);
      }
      doors.push({ road: [x, base], door: [sc.left + sc.width / 2 - box.left, base - 4], onLeft: onLeft,
        color: getComputedStyle(place).getPropertyValue("--main").trim() || "#d9483b" });
    });
    var last = points[points.length - 1];
    points.push([last[0] + (width / 2 - last[0]) * 0.5, height + 30]);

    var pts = sample(points);
    function widthAt(s) {
      var t = Math.min(1, s / 260), ease = t * t * (3 - 2 * t);    // from the width of the landscape road to the usual one, slowly
      var w = startW + (road - startW) * ease;
      return w * (1 + ease * (0.08 * Math.sin(s / 53) + 0.05 * Math.sin(s / 17 + 1)));
    }

    // the places that are taken (the scenery must not cover them): the drawings of the buildings,
    // their names, lines and buttons, the road and the paths
    function rel(el, pad) {
      var b = el.getBoundingClientRect();
      return { x: b.left - box.left - pad, y: b.top - box.top - pad, w: b.width + 2 * pad, h: b.height + 2 * pad };
    }
    var blocks = [], lines = [{ pts: pts, half: function (p) { return widthAt(p.s) / 2; } }];
    places.forEach(function (place) {
      // a wide free space around every building and its name, so the games stand out
      blocks.push(rel(place.querySelector(".place__svg"), phone ? 14 : 34));
      Array.prototype.forEach.call(place.querySelectorAll(".place__info, .place__badge"), function (el) {
        blocks.push(rel(el, phone ? 10 : 22));
      });
    });

    // a light, soft "yard" under every building: the eye goes to the games first
    // (the classes of the stops let a mode of the page give it other colors)
    var html = '<defs><radialGradient id="vr-yard"><stop offset="0" stop-color="#e4f3c6" class="vr-yard-in"/>' +
      '<stop offset=".65" stop-color="#d6edb4" stop-opacity=".85" class="vr-yard-out"/>' +
      '<stop offset="1" stop-color="#d6edb4" stop-opacity="0" class="vr-yard-out"/></radialGradient></defs>';
    places.forEach(function (place) {
      var b = place.querySelector(".place__svg").getBoundingClientRect();
      html += '<ellipse cx="' + r(b.left + b.width / 2 - box.left) + '" cy="' + r(b.bottom - box.top - b.height * 0.18) + '" rx="' + r(b.width * 0.68) +
        '" ry="' + r(b.height * 0.5) + '" fill="url(#vr-yard)"/>';
    });
    // the paths to the doors (under the main road, which covers the place where they meet)
    doors.forEach(function (d, i) {
      // the path dips only a little, so it stays above the name of the game (.place__info, assets/css/buildings.css)
      var mx = (d.road[0] + d.door[0]) / 2, my = Math.max(d.road[1], d.door[1]) + road * 0.12;
      var pathPts = sample([d.road, [mx, my], d.door]);
      // a little trodden place in front of the door, then the path itself (wide, with stones along it)
      html += '<ellipse cx="' + r(d.door[0]) + '" cy="' + r(d.door[1] + 4) + '" rx="' + r(road * 0.75) + '" ry="' + r(road * 0.3) + '" class="vr-earth"/>';
      html += strip(pathPts, function () { return road * 0.62; }, { phase: i, ruts: false, border: true }, random);
      lines.push({ pts: pathPts, half: function () { return road * 0.31 + 6; } });
    });
    html += strip(pts, widthAt, { phase: 0.5, ruts: true }, random);

    // at every crossing: a wooden sign with an arrow in the color of the game, pointing to the building
    doors.forEach(function (d) {
      var dir = d.onLeft ? -1 : 1;                                   // the building is on this side of the road
      var sx = d.road[0] + dir * (road * 0.55 + 16), sy = d.road[1] - road * 0.31 - 6;
      html += signpost(sx, sy, dir, d.color, phone ? 0.8 : 1);
      blocks.push({ x: sx - 26, y: sy - 50, w: 52, h: 54 });
    });

    // the life of the village in the free places (assets/js/scenery.js): fields behind everything, things in front
    if (window.VILLAGE_SCENERY) {
      // where the games end: under it, the rest of the village (houses, the windmill, the ponds ...)
      var lastBottom = places[places.length - 1].getBoundingClientRect().bottom - box.top + 20;
      var scenery = window.VILLAGE_SCENERY.fill({ width: width, height: height, phone: phone, blocks: blocks, lines: lines,
        gamesEnd: lastBottom, random: rng(11) });
      html = scenery.back + html + '<g class="vr-scenery">' + scenery.front + "</g>";
    }

    svg.setAttribute("viewBox", "0 0 " + r(width) + " " + r(height));
    svg.style.height = height + "px";
    svg.innerHTML = html;
  }

  var waiting = false;
  function later() {
    if (waiting) { return; }
    waiting = true;
    window.requestAnimationFrame(function () { waiting = false; draw(); });
  }
  draw();
  window.addEventListener("resize", later);
  window.addEventListener("load", later);
  window.addEventListener("village-mode", later);               // the mode of the page is loaded (assets/js/modes.js)                       // the pictures and the fonts change the sizes
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(later); }
  if (window.ResizeObserver) { new ResizeObserver(later).observe(village); }
})();
