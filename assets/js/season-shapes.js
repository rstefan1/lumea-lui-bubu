/* =====================================================================
   assets/js/season-shapes.js – the SEASONAL SHAPES that the drawings of the village carry with them.

   The buildings (assets/js/buildings.js), the things of the village (assets/js/scenery.js) and the
   signposts (assets/js/road.js) draw these shapes together with themselves, but they are HIDDEN
   (assets/css/village.css); a mode of the page (modes/<name>/mode.css) only has to show them:
     .snow        snow lying on roofs, trees, haystacks, boards ...
     .lights      a string of colored light bulbs along a roof
     .ornaments   colored balls and a star on a fir tree
   The bulbs and the balls have the classes bulb--1 ... bulb--4, so a mode chooses their colors.
   Nothing here moves.
   ===================================================================== */
(function () {
  "use strict";

  function r(v) { return Math.round(v * 10) / 10; }

  // Snow lying along a line (pts: the top outline, from left to right, e.g. the two slopes of a roof),
  // t thick, with a wavy lower edge, as if it were about to drip down.
  function line(pts, t) {
    var first = pts[0], last = pts[pts.length - 1];
    var top = [[first[0] - 2, first[1]]].concat(pts.slice(1, -1), [[last[0] + 2, last[1]]]);
    var d = "M" + top.map(function (p) { return r(p[0]) + " " + r(p[1] - 1.5); }).join(" L");
    d += " L" + r(last[0] + 2) + " " + r(last[1] + t * 0.7);
    for (var i = pts.length - 1; i > 0; i--) {
      var a = pts[i], b = pts[i - 1];
      var n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 15));
      for (var k = 1; k <= n; k++) {
        var x = a[0] + (b[0] - a[0]) * k / n, y = a[1] + (b[1] - a[1]) * k / n;
        var cx = a[0] + (b[0] - a[0]) * (k - 0.5) / n, cy = a[1] + (b[1] - a[1]) * (k - 0.5) / n;
        var drop = (k + i) % 3 === 0 ? 1.9 : 1.3;          // now and then a longer drip
        d += " Q" + r(cx) + " " + r(cy + t * drop) + " " + r(x) + " " + r(y + t * 0.7);
      }
    }
    return '<path d="' + d + ' Z" class="snow"/>';
  }

  // Snow on the top of a triangle (a fir tree layer, a small roof): apex (x, y), half width w at h lower,
  // the snow covers the top part (f = 0.4: the top 40 %)
  function peak(x, y, w, h, f) {
    f = f || 0.4;
    var lx = x - w * f - 1, rx = x + w * f + 1, by = y + h * f;
    return '<path d="M' + r(lx) + " " + r(by) + " L" + r(x) + " " + r(y - 1.5) + " L" + r(rx) + " " + r(by) +
      " Q" + r(x + w * f * 0.5) + " " + r(by + h * 0.12) + " " + r(x + w * f * 0.15) + " " + r(by) +
      " Q" + r(x - w * f * 0.3) + " " + r(by + h * 0.16) + " " + r(lx) + " " + r(by) + ' Z" class="snow"/>';
  }

  // Snow on the top of a round crown (a bush, a leafy tree): the circle (cx, cy, rad)
  function dome(cx, cy, rad) {
    var dx = rad * 0.87, y = cy - rad * 0.45, R = rad + 1;
    return '<path d="M' + r(cx - dx) + " " + r(y) + " A" + r(R) + " " + r(R) + " 0 0 1 " + r(cx + dx) + " " + r(y) +
      " Q" + r(cx + dx * 0.5) + " " + r(y + rad * 0.32) + " " + r(cx + dx * 0.1) + " " + r(y + rad * 0.08) +
      " Q" + r(cx - dx * 0.45) + " " + r(y + rad * 0.4) + " " + r(cx - dx) + " " + r(y) + ' Z" class="snow"/>';
  }

  // A string of light bulbs hanging a little under a line (pts, from left to right), one bulb every "gap"
  function lights(pts, gap, size) {
    gap = gap || 13; size = size || 2.6;
    var wire = "", bulbs = "", n = 0;
    for (var i = 0; i < pts.length - 1; i++) {
      var a = pts[i], b = pts[i + 1];
      var count = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / gap));
      for (var k = 0; k < count; k++) {
        var x0 = a[0] + (b[0] - a[0]) * k / count, y0 = a[1] + (b[1] - a[1]) * k / count + 3;
        var x1 = a[0] + (b[0] - a[0]) * (k + 1) / count, y1 = a[1] + (b[1] - a[1]) * (k + 1) / count + 3;
        var mx = (x0 + x1) / 2, my = (y0 + y1) / 2 + size * 1.6;
        wire += (wire ? " " : "M" + r(x0) + " " + r(y0)) + " Q" + r(mx) + " " + r(my + size) + " " + r(x1) + " " + r(y1);
        bulbs += '<circle cx="' + r(mx) + '" cy="' + r(my + size * 0.9) + '" r="' + size + '" class="bulb bulb--' + (n % 4 + 1) + '"/>';
        n++;
      }
    }
    return '<g class="lights"><path d="' + wire + '" class="lights__wire"/>' + bulbs + "</g>";
  }

  // A fir tree standing at (x, base), h high and w wide: colored balls on its branches and a star on top
  function ornaments(x, base, h, w) {
    var size = Math.max(1.8, h * 0.035), out = "";
    [[-0.26, 0.22], [0.2, 0.26], [-0.05, 0.36], [-0.15, 0.5], [0.14, 0.53], [0.03, 0.7]].forEach(function (p, i) {
      out += '<circle cx="' + r(x + p[0] * w) + '" cy="' + r(base - p[1] * h) + '" r="' + r(size) + '" class="bulb bulb--' + (i % 4 + 1) + '"/>';
    });
    var s = Math.max(3, h * 0.075), cy = base - h, star = "";
    for (var k = 0; k < 10; k++) {
      var ang = -Math.PI / 2 + k * Math.PI / 5, rad = k % 2 ? s * 0.45 : s;
      star += (k ? " L" : "M") + r(x + Math.cos(ang) * rad) + " " + r(cy + Math.sin(ang) * rad);
    }
    return '<g class="ornaments">' + out + '<path d="' + star + ' Z" class="tree-star"/></g>';
  }

  window.SEASON_SHAPES = { line: line, peak: peak, dome: dome, lights: lights, ornaments: ornaments };
})();
