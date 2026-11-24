/* =====================================================================
   assets/js/scenery.js – the LIFE of the village in the empty places between the buildings.

   - strips of fields in slightly different greens (and a mowed, yellowish one), like on the hills at the top;
   - next to the games only hens, sheep, a few cows, fruit trees, haystacks and fir trees (the games stay the main thing);
   - under the last game, the rest of a village in Bucovina: trees, an apple tree, fir trees (alone or in groups
     of 3 and 5), small ponds, peasant houses, a windmill, a bench under a tree,
     a clothes line with traditional shirts, mushrooms, sheep, cows, hens, a pond, beehives, a cart with hay,
     a scarecrow, sunflowers, a wayside cross, a vegetable garden, a pile of wood, flowers.

   assets/js/road.js calls window.VILLAGE_SCENERY.fill(...) every time it draws the road, and gives it the
   places that are taken (the buildings with their names and buttons, the road, the paths) and where the games end. The free places
   are found on a grid of small squares, so nothing ever covers a building, a text, a button or the road.
   Every drawing stands with its feet at (0, 0); "w" and "h" are the room it needs.
   Nothing here moves.
   ===================================================================== */
(function () {
  "use strict";

  function r(v) { return Math.round(v * 10) / 10; }

  function shadow(rx) { return '<ellipse cx="0" cy="0" rx="' + rx + '" ry="4" class="sc-shadow"/>'; }
  // a fir tree standing at (x, y), h high: three layers of branches, the top one lighter
  function fir(x, y, h) {
    var w = h * 0.5;
    return '<rect x="' + r(x - 3) + '" y="' + r(y - h * 0.16) + '" width="6" height="' + r(h * 0.16) + '" class="sc-trunk"/>' +
      '<path d="M' + r(x - w / 2) + " " + r(y - h * 0.14) + " L" + r(x) + " " + r(y - h * 0.62) + " L" + r(x + w / 2) + " " + r(y - h * 0.14) + ' Z" class="sc-fir"/>' +
      '<path d="M' + r(x - w * 0.38) + " " + r(y - h * 0.42) + " L" + r(x) + " " + r(y - h * 0.84) + " L" + r(x + w * 0.38) + " " + r(y - h * 0.42) + ' Z" class="sc-fir"/>' +
      '<path d="M' + r(x - w * 0.25) + " " + r(y - h * 0.66) + " L" + r(x) + " " + r(y - h) + " L" + r(x + w * 0.25) + " " + r(y - h * 0.66) + ' Z" class="sc-fir-light"/>';
  }

  /* ---------- The drawings ---------- */
  var ITEMS = {
    tree: { w: 66, h: 80, draw: function () {
      return '<ellipse cx="0" cy="0" rx="22" ry="4" class="sc-shadow"/><rect x="-4" y="-32" width="8" height="32" rx="2" class="sc-trunk"/>' +
        '<circle cx="-15" cy="-42" r="16" class="sc-leaf"/><circle cx="15" cy="-44" r="15" class="sc-leaf"/><circle cx="0" cy="-58" r="20" class="sc-leaf-light"/>';
    } },
    apple: { w: 66, h: 80, draw: function () {
      return ITEMS.tree.draw() + '<g class="sc-apple"><circle cx="-12" cy="-48" r="3"/><circle cx="8" cy="-60" r="3"/><circle cx="16" cy="-42" r="3"/>' +
        '<circle cx="-2" cy="-44" r="3"/><circle cx="-18" cy="-36" r="3"/><circle cx="6" cy="-70" r="3"/></g>';
    } },
    fir:   { w: 40, h: 92, draw: function () { return shadow(16) + fir(0, 0, 88); } },
    firs3: { w: 76, h: 90, draw: function () { return shadow(32) + fir(-18, -4, 70) + fir(18, -2, 76) + fir(0, 2, 86); } },
    firs5: { w: 118, h: 96, draw: function () {
      return shadow(52) + fir(-38, -8, 62) + fir(36, -6, 66) + fir(-16, -12, 84) + fir(14, -10, 90) + fir(-2, 2, 72) + fir(-28, 4, 50) + fir(30, 4, 54);
    } },
    sheep: { w: 96, h: 34, draw: function () {
      function one(x, k, flip) {
        return '<g transform="translate(' + x + " 0) scale(" + (flip ? -k : k) + " " + k + ')">' +
          '<path d="M-9 0 V-8 M-3 0 V-8 M5 0 V-8 M10 0 V-8" class="sc-legs"/>' +
          '<g class="sc-wool"><circle cx="-8" cy="-14" r="7"/><circle cx="0" cy="-17" r="8"/><circle cx="8" cy="-14" r="7"/><circle cx="0" cy="-10" r="8"/></g>' +
          '<ellipse cx="15" cy="-15" rx="5" ry="4" class="sc-face"/><circle cx="16.5" cy="-16" r="1" class="sc-eye"/></g>';
      }
      return '<ellipse cx="0" cy="0" rx="44" ry="4" class="sc-shadow"/>' + one(-28, 1, false) + one(4, 0.85, true) + one(32, 1, false);
    } },
    cow: { w: 64, h: 44, draw: function () {
      return '<ellipse cx="0" cy="0" rx="28" ry="4" class="sc-shadow"/>' +
        '<path d="M-18 0 V-12 M-12 0 V-12 M10 0 V-12 M16 0 V-12" class="sc-legs-thick"/>' +
        '<rect x="-24" y="-30" width="44" height="20" rx="9" class="sc-cow"/>' +
        '<path d="M-14 -30 q6 8 0 14 q-8 -4 -8 -10 z M4 -24 q8 -2 10 6 q-6 4 -12 0 z" class="sc-spot"/>' +
        '<path d="M-24 -26 q-8 4 -6 14" class="sc-tail"/>' +
        '<rect x="16" y="-38" width="14" height="14" rx="5" class="sc-cow"/><rect x="18" y="-30" width="12" height="7" rx="3.5" class="sc-muzzle"/>' +
        '<path d="M17 -38 l-3 -4 M29 -38 l3 -4" class="sc-horn"/><circle cx="21" cy="-34" r="1.2" class="sc-eye"/><circle cx="26" cy="-34" r="1.2" class="sc-eye"/>';
    } },
    hens: { w: 56, h: 22, draw: function () {
      function hen(x, flip, cls) {
        return '<g transform="translate(' + x + " 0) scale(" + (flip ? -1 : 1) + ' 1)">' +
          '<path d="M-2 0 V-4 M2 0 V-4" class="sc-hen-leg"/><ellipse cx="0" cy="-9" rx="7" ry="5.5" class="' + cls + '"/>' +
          '<circle cx="6" cy="-14" r="3.5" class="' + cls + '"/><path d="M8.5 -14 l3 1 l-3 1 z" class="sc-beak"/><path d="M5 -17.5 q1.5 -2.5 3 0" class="sc-comb"/>' +
          '<path d="M-7 -10 l-4 -4 l1 5 z" class="' + cls + '"/></g>';
      }
      return hen(-18, false, "sc-hen") + hen(2, true, "sc-hen-brown") + hen(20, false, "sc-hen");
    } },
    pond: { w: 124, h: 52, draw: function () {
      return '<ellipse cx="0" cy="-20" rx="56" ry="20" class="sc-pond-edge"/><ellipse cx="0" cy="-20" rx="51" ry="16" class="sc-water"/>' +
        '<path d="M-30 -24 q10 -3 20 0 M8 -16 q10 -3 20 0" class="sc-ripple"/>' +
        '<path d="M44 -18 V-44 M48 -16 V-38 M52 -20 V-40 M-48 -16 V-36 M-44 -18 V-42" class="sc-reed"/>' +
        '<path d="M44 -44 v-8 M-44 -42 v-8" class="sc-cattail"/>';
    } },
    // small ponds: an uneven edge, the water, a light reflection, reeds and stones;
    // the water has the class "sc-water", so the winter mode can freeze it
    puddle: { w: 64, h: 26, draw: function () {
      return '<path d="M-28 -10 C-30 -20 -14 -24 0 -22 C14 -25 30 -20 29 -11 C30 -2 12 1 -2 0 C-16 1 -27 -2 -28 -10 Z" class="sc-pond-edge"/>' +
        '<path d="M-24 -10 C-25 -17 -12 -20 0 -18.5 C12 -21 25 -17 24 -10.5 C25 -4 10 -2.5 -2 -3.5 C-14 -2.5 -23 -4 -24 -10 Z" class="sc-water"/>' +
        '<path d="M-12 -13 q6 -2 12 0" class="sc-ripple"/>' +
        '<ellipse cx="24" cy="-4" rx="3.5" ry="2.5" class="sc-stone"/><path d="M-26 -12 V-26 M-23 -10 V-22" class="sc-reed"/>';
    } },
    lakelet: { w: 92, h: 36, draw: function () {
      return '<path d="M-42 -14 C-44 -28 -22 -34 -4 -31 C14 -36 40 -30 42 -17 C44 -4 24 1 4 0 C-18 2 -40 -1 -42 -14 Z" class="sc-pond-edge"/>' +
        '<path d="M-37 -14 C-38 -25 -20 -29 -4 -27 C13 -31 36 -26 37 -16 C38 -6 21 -3 4 -4 C-16 -2.5 -36 -5 -37 -14 Z" class="sc-water"/>' +
        '<path d="M-22 -18 q8 -2.5 16 0 M6 -12 q7 -2 14 0" class="sc-ripple"/>' +
        '<ellipse cx="-38" cy="-4" rx="4" ry="3" class="sc-stone"/><ellipse cx="-31" cy="-2" rx="2.6" ry="2" class="sc-stone"/>' +
        '<path d="M36 -16 V-36 M40 -14 V-30 M44 -18 V-32" class="sc-reed"/><path d="M36 -36 v-7" class="sc-cattail"/>';
    } },
    // a peasant house of Bucovina: white walls, a tall dark roof, blue window frames, a porch with posts
    house: { w: 96, h: 76, draw: function () {
      return shadow(44) +
        '<rect x="-38" y="-34" width="76" height="34" class="sc-house-wall"/>' +
        '<path d="M-46 -32 L-26 -70 H26 L46 -32 Z" class="sc-house-roof"/><path d="M-26 -70 H26" class="sc-house-ridge"/>' +
        '<rect x="-38" y="-8" width="76" height="8" class="sc-house-base"/>' +
        '<rect x="-30" y="-27" width="13" height="13" class="sc-house-window"/><path d="M-23.5 -27 V-14 M-30 -20.5 H-17" class="sc-house-cross"/>' +
        '<rect x="17" y="-27" width="13" height="13" class="sc-house-window"/><path d="M23.5 -27 V-14 M17 -20.5 H30" class="sc-house-cross"/>' +
        '<rect x="-6" y="-26" width="12" height="26" class="sc-house-door"/>' +
        '<path d="M-38 -34 H38" class="sc-house-band"/><path d="M-12 -34 V0 M12 -34 V0" class="sc-house-post"/>' +
        '<rect x="-12" y="-82" width="7" height="16" class="sc-chimney"/>';
    } },
    // a wooden windmill with four sails
    windmill: { w: 84, h: 104, draw: function () {
      var sails = "";
      for (var a = 0; a < 360; a += 90) {
        sails += '<g transform="rotate(' + (a + 20) + ' 0 -62)"><path d="M0 -62 V-100" class="sc-sail-arm"/><rect x="1" y="-100" width="11" height="32" class="sc-sail"/></g>';
      }
      return shadow(22) + '<path d="M-18 0 L-12 -58 H12 L18 0 Z" class="sc-mill"/><path d="M-16 -58 L0 -74 L16 -58 Z" class="sc-mill-roof"/>' +
        '<rect x="-5" y="-16" width="10" height="16" rx="1" class="sc-house-door"/><rect x="-4" y="-42" width="8" height="8" class="sc-house-window"/>' +
        sails + '<circle cx="0" cy="-62" r="3.5" class="sc-ink"/>';
    } },
    bench: { w: 86, h: 82, draw: function () {
      return ITEMS.tree.draw() + '<g transform="translate(26 0)"><path d="M-14 0 V-10 M14 0 V-10" class="sc-bench-leg"/>' +
        '<rect x="-17" y="-12" width="34" height="4" rx="1" class="sc-bench"/><rect x="-17" y="-22" width="34" height="4" rx="1" class="sc-bench"/>' +
        '<path d="M-14 -10 V-22 M14 -10 V-22" class="sc-bench-leg"/></g>';
    } },
    // a clothes line with traditional embroidered shirts and an embroidered towel
    clothes: { w: 104, h: 58, draw: function () {
      return '<path d="M-48 0 V-52 M48 0 V-52" class="sc-post"/><path d="M-48 -48 Q0 -40 48 -48" class="sc-line"/>' +
        '<g transform="translate(-26 -46)"><path d="M-12 0 H12 L16 8 L10 10 V28 H-10 V10 L-16 8 Z" class="sc-ie"/><path d="M-10 14 H10 M-6 4 V24 M6 4 V24" class="sc-embroidery"/></g>' +
        '<g transform="translate(4 -45)"><rect x="-6" y="0" width="12" height="30" class="sc-ie"/><path d="M-6 24 H6 M-6 27 H6" class="sc-embroidery"/></g>' +
        '<g transform="translate(30 -46)"><path d="M-12 0 H12 L16 8 L10 10 V28 H-10 V10 L-16 8 Z" class="sc-ie"/><path d="M-10 14 H10 M-6 4 V24 M6 4 V24" class="sc-embroidery sc-embroidery--2"/></g>';
    } },
    mushrooms: { w: 34, h: 18, draw: function () {
      function shroom(x, k) {
        return '<g transform="translate(' + x + " 0) scale(" + k + ')"><rect x="-2.5" y="-8" width="5" height="8" rx="2" class="sc-stalk"/>' +
          '<path d="M-8 -7 Q0 -18 8 -7 Z" class="sc-cap"/><circle cx="-3" cy="-11" r="1.3" class="sc-dot"/><circle cx="3" cy="-10" r="1.1" class="sc-dot"/></g>';
      }
      return shroom(-9, 1) + shroom(4, 1.25) + shroom(14, 0.8);
    } },
    haystacks: { w: 70, h: 56, draw: function () {
      function stack(x, h) {
        var w = h * 0.78;
        return '<path d="M' + x + " -" + (h + 8) + " V-" + (h - 3) + '" class="sc-pole"/>' +
          '<path d="M' + r(x - w / 2) + " 0 Q" + r(x - w * 0.52) + " -" + r(h * 0.62) + " " + x + " -" + h +
          " Q" + r(x + w * 0.52) + " -" + r(h * 0.62) + " " + r(x + w / 2) + ' 0 Z" class="sc-hay"/>' +
          '<path d="M' + x + " -" + h + " Q" + r(x + w * 0.52) + " -" + r(h * 0.62) + " " + r(x + w / 2) + " 0 L" + r(x + w * 0.12) + " 0 Q" +
          r(x + w * 0.22) + " -" + r(h * 0.6) + " " + x + " -" + h + ' Z" class="sc-hay-dark"/>' +
          '<path d="M' + r(x - w * 0.36) + " -" + r(h * 0.32) + " Q" + x + " -" + r(h * 0.4) + " " + r(x + w * 0.36) + " -" + r(h * 0.32) + '" class="sc-hay-line"/>';
      }
      return shadow(32) + stack(-12, 46) + stack(18, 34);
    } },
    hives: { w: 86, h: 34, draw: function () {
      var out = '<ellipse cx="0" cy="0" rx="40" ry="4" class="sc-shadow"/><rect x="-38" y="-6" width="76" height="5" rx="1" class="sc-plank"/>';
      ["sc-hive-yellow", "sc-hive-blue", "sc-hive-red"].forEach(function (cls, i) {
        var x = -26 + i * 26;
        out += '<rect x="' + (x - 9) + '" y="-24" width="18" height="18" rx="1.5" class="' + cls + '"/>' +
          '<path d="M' + (x - 12) + " -24 L" + x + " -31 L" + (x + 12) + ' -24 Z" class="sc-hive-roof"/>' +
          '<rect x="' + (x - 3) + '" y="-11" width="6" height="2" class="sc-ink"/>';
      });
      return out;
    } },
    cart: { w: 92, h: 60, draw: function () {
      return '<ellipse cx="0" cy="0" rx="40" ry="4" class="sc-shadow"/>' +
        '<path d="M-30 -30 Q-24 -60 2 -58 Q30 -60 34 -30 Z" class="sc-hay"/><path d="M-20 -40 q20 -6 44 0 M-14 -50 q16 -4 32 0" class="sc-hay-line"/>' +
        '<rect x="-34" y="-32" width="70" height="10" rx="2" class="sc-cart"/>' +
        '<path d="M36 -26 L54 -18" class="sc-shaft"/>' +
        '<circle cx="-20" cy="-12" r="12" class="sc-wheel"/><circle cx="-20" cy="-12" r="3" class="sc-cart"/>' +
        '<circle cx="22" cy="-12" r="12" class="sc-wheel"/><circle cx="22" cy="-12" r="3" class="sc-cart"/>' +
        '<path d="M-20 -24 V0 M-32 -12 H-8 M22 -24 V0 M10 -12 H34" class="sc-spoke"/>';
    } },
    scarecrow: { w: 44, h: 70, draw: function () {
      return '<ellipse cx="0" cy="0" rx="14" ry="3" class="sc-shadow"/><path d="M0 0 V-58 M-20 -40 H20" class="sc-post"/>' +
        '<path d="M-12 -46 H12 L10 -24 H-10 Z" class="sc-shirt"/><path d="M-20 -42 h9 M11 -42 h9" class="sc-straw"/>' +
        '<circle cx="0" cy="-54" r="7" class="sc-sack"/><path d="M-11 -58 H11 M-6 -58 L-4 -68 H4 L6 -58" class="sc-hat"/>' +
        '<circle cx="-2.5" cy="-55" r="1" class="sc-ink"/><circle cx="2.5" cy="-55" r="1" class="sc-ink"/>';
    } },
    sunflowers: { w: 64, h: 54, draw: function () {
      var out = "";
      [[-22, 40], [-10, 50], [2, 44], [14, 52], [24, 38]].forEach(function (f) {
        out += '<path d="M' + f[0] + " 0 V-" + f[1] + '" class="sc-stem"/><path d="M' + f[0] + " -" + (f[1] * 0.5) + " q6 -4 9 0 q-5 3 -9 0" + '" class="sc-leaf-small"/>' +
          '<circle cx="' + f[0] + '" cy="-' + f[1] + '" r="7" class="sc-petals"/><circle cx="' + f[0] + '" cy="-' + f[1] + '" r="3.5" class="sc-seeds"/>';
      });
      return out;
    } },
    waysideCross: { w: 36, h: 76, draw: function () {
      return '<ellipse cx="0" cy="0" rx="12" ry="3" class="sc-shadow"/><path d="M0 0 V-58 M-13 -42 H13" class="sc-cross"/>' +
        '<path d="M-16 -56 L0 -70 L16 -56 Z" class="sc-roof-small"/><rect x="-4" y="-50" width="8" height="10" rx="1" class="sc-icon"/>' +
        '<path d="M-6 -2 h12" class="sc-post"/>';
    } },
    garden: { w: 104, h: 40, draw: function () {
      var out = '<path d="M-50 -4 L-44 -36 H44 L50 -4 Z" class="sc-soil"/>';
      for (var row = 0; row < 4; row++) {
        var y = -10 - row * 7.5, half = 46 - row * 1.6;
        for (var x = -half + 4; x < half - 2; x += 9) {
          out += '<circle cx="' + r(x) + '" cy="' + r(y) + '" r="' + (row % 2 ? 3.2 : 2.6) + '" class="' + (row % 2 ? "sc-cabbage" : "sc-sprout") + '"/>';
        }
      }
      return out;
    } },
    woodpile: { w: 66, h: 34, draw: function () {
      var out = '<ellipse cx="0" cy="0" rx="30" ry="3" class="sc-shadow"/>';
      [[0, 4], [1, 3], [2, 2]].forEach(function (row) {
        for (var i = 0; i < row[1]; i++) {
          var x = -((row[1] - 1) * 13) / 2 + i * 13, y = -6 - row[0] * 11;
          out += '<circle cx="' + r(x) + '" cy="' + y + '" r="6" class="sc-log"/><circle cx="' + r(x) + '" cy="' + y + '" r="2.5" class="sc-log-ring"/>';
        }
      });
      return out;
    } },
    flowers: { w: 34, h: 16, draw: function () {
      return '<path d="M-12 0 q1 -6 0 -9 M-3 0 q-1 -7 0 -11 M6 0 q1 -6 0 -8 M13 0 q-1 -5 0 -7" class="sc-stem-thin"/>' +
        '<circle cx="-12" cy="-10" r="2.6" class="sc-flower-white"/><circle cx="-3" cy="-12" r="2.8" class="sc-flower-yellow"/>' +
        '<circle cx="6" cy="-9" r="2.6" class="sc-flower-pink"/><circle cx="13" cy="-8" r="2.4" class="sc-flower-blue"/>';
    } }
  };
  // things a village has only one of (or two)
  var MAX = { pond: 1, cart: 1, garden: 1, waysideCross: 1, scarecrow: 1, hives: 1, cow: 2,
    lakelet: 2, puddle: 3, woodpile: 2, sunflowers: 2,
    windmill: 1, clothes: 1, bench: 1, house: 2, mushrooms: 3 };
  // the big things first (they need more room), the small ones fill the rest
  // next to the games only hens, sheep, a few cows, fruit trees, haystacks and fir trees (the games stay the main thing);
  // the rest of the village comes under the last game
  var CENTER = ["firs3", "haystacks", "sheep", "apple", "fir", "cow", "hens", "firs5", "haystacks", "apple", "fir",
    "sheep", "firs3", "haystacks", "hens", "apple", "fir"];
  var ORDER = ["windmill", "house", "firs5", "pond", "cart", "lakelet", "clothes", "garden", "fir", "sheep", "puddle", "house", "apple",
    "firs3", "cow", "fir", "mushrooms", "lakelet", "hives", "bench", "tree", "waysideCross", "firs5", "puddle",
    "scarecrow", "sunflowers", "fir", "woodpile", "hens", "firs3", "puddle", "mushrooms", "haystacks", "tree", "sheep", "fir",
    "apple", "flowers"];

  /* ---------- The strips of fields (behind everything); the first one has the color of the field
     at the bottom of the landscape, so the village starts without a line ---------- */
  var FIELDS = ["#bfe29a", "#c4e3a1", "#b2d98b", "#cfe3a0", "#bddf98", "#d6dd98"];
  function fields(width, height, random) {
    var out = "", y = 0, i = 0;
    while (y < height) {
      var h = 150 + random() * 120, a = 10 + random() * 16, b = 10 + random() * 16;
      out += '<path d="M-20 ' + r(y) + " C" + r(width * 0.3) + " " + r(y - a) + " " + r(width * 0.7) + " " + r(y + b) + " " + r(width + 20) + " " + r(y) +
        " V" + r(y + h + 30) + " H-20 Z" + '" fill="' + FIELDS[i % FIELDS.length] + '"/>';
      y += h; i++;
    }
    return out;
  }

  /* ---------- Finding the free places ---------- */
  function fill(ctx) {
    var width = ctx.width, height = ctx.height, random = ctx.random;
    var CELL = 10, cols = Math.ceil(width / CELL) + 1, rows = Math.ceil(height / CELL) + 1;
    var taken = new Uint8Array(cols * rows);
    function mark(x, y, w, h) {
      var c0 = Math.max(0, Math.floor(x / CELL)), c1 = Math.min(cols - 1, Math.floor((x + w) / CELL));
      var r0 = Math.max(0, Math.floor(y / CELL)), r1 = Math.min(rows - 1, Math.floor((y + h) / CELL));
      for (var rr = r0; rr <= r1; rr++) { for (var cc = c0; cc <= c1; cc++) { taken[rr * cols + cc] = 1; } }
    }
    function free(x, y, w, h) {
      if (x < 4 || y < 4 || x + w > width - 4 || y + h > height - 70) { return false; }   // not under the fence
      var c0 = Math.floor(x / CELL), c1 = Math.floor((x + w) / CELL), r0 = Math.floor(y / CELL), r1 = Math.floor((y + h) / CELL);
      for (var rr = r0; rr <= r1; rr++) { for (var cc = c0; cc <= c1; cc++) { if (taken[rr * cols + cc]) { return false; } } }
      return true;
    }
    ctx.blocks.forEach(function (b) { mark(b.x, b.y, b.w, b.h); });
    ctx.lines.forEach(function (l) {
      l.pts.forEach(function (p) { var h = l.half(p) + 12; mark(p.x - h, p.y - h, 2 * h, 2 * h); });
    });

    var k = ctx.phone ? 0.75 : width < 1051 ? 0.85 : 1;       // smaller drawings on smaller screens
    var gap = ctx.phone ? 22 : 46;                             // room left around every drawing
    // not too many: the buildings of the games must stay the most visible things of the village
    var most = Math.round(width * height / (ctx.phone ? 60000 : 72000));
    var placed = [], n = 0, count = {}, tries = Math.round(width * height / (ctx.phone ? 900 : 1400));
    var turn = { center: 0, rest: 0 };
    for (var t = 0; t < tries && placed.length < most; t++) {
      // first a place, then a thing that may stand there
      var y0 = 20 + random() * (height - 80);
      var zone = y0 < ctx.gamesEnd ? "center" : "rest";
      var list = zone === "center" ? CENTER : ORDER;
      var name = list[turn[zone] % list.length], item = ITEMS[name];
      if ((count[name] || 0) >= (MAX[name] || 99)) { turn[zone]++; continue; }   // this one is already in the village
      var w = item.w * k, h = item.h * k;
      var x = random() * (width - w), y = y0;
      if (zone === "center" && y + h > ctx.gamesEnd + 40) { continue; }
      if (free(x - gap / 2, y - gap / 2, w + gap, h + gap)) {
        mark(x - gap / 2, y - gap / 2, w + gap, h + gap);
        placed.push({ x: x + w / 2, y: y + h, name: name, flip: random() < 0.5 });
        count[name] = (count[name] || 0) + 1;
        turn[zone]++;
      } else if (t % 25 === 24) {
        turn[zone]++;   // this one does not fit anywhere any more: try the next kind
      }
    }
    // drawn from the top down, so the lower ones stand in front
    placed.sort(function (a, b) { return a.y - b.y; });
    var front = placed.map(function (p) {
      var flip = p.flip && p.name !== "waysideCross" ? -1 : 1;
      return '<g transform="translate(' + r(p.x) + " " + r(p.y) + ") scale(" + r(k * flip) + " " + r(k) + ')">' + ITEMS[p.name].draw() + "</g>";
    }).join("");
    return { back: fields(width, height, random), front: front };
  }

  window.VILLAGE_SCENERY = { fill: fill };
})();
