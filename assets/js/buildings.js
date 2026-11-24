/* =====================================================================
   assets/js/buildings.js – draws the BUILDINGS of the village from data/places.js.

   Every building is one card in the street:
     .place__scene   the drawing (SVG, 320 x 240, the ground is at the bottom), and a ribbon ("Nou!")
     .place__info    the name of the game, one line about it and the "Intră" button
   With an url the whole card is a link (<a>); without one it is a <div> with "În curând".

   The drawings use these classes, so the color of the building (.place--<color>) and later
   the special modes can change them: b-main / b-dark / b-light (the color of the building),
   b-roof, b-wall, b-glass, b-wood ... (see assets/css/buildings.css).
   All the texts of the drawings (GARA, the numbers of the windows) are SVG text: they grow with the drawing.
   ===================================================================== */
(function () {
  "use strict";

  var holder = document.getElementById("village");
  if (!holder) { return; }

  var COLORS = ["red", "blue", "green", "yellow", "orange", "pink", "teal", "purple"];

  function esc(text) {
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // the word on the board of a building (SVG text, centered at x, y)
  function boardText(x, y, size, text, cls) {
    return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" class="b-board-text ' + (cls || "") + '" text-anchor="middle" dominant-baseline="central">' + esc(text) + "</text>";
  }

  // a fir tree standing at (x, base), h high
  function pine(x, base, h) {
    var w = h * 0.55;
    return '<rect x="' + (x - 3) + '" y="' + (base - h * 0.18) + '" width="6" height="' + (h * 0.18) + '" class="b-trunk"/>' +
      '<path d="M' + (x - w / 2) + " " + (base - h * 0.15) + " L" + x + " " + (base - h * 0.62) + " L" + (x + w / 2) + " " + (base - h * 0.15) + ' Z" class="b-pine"/>' +
      '<path d="M' + (x - w * 0.4) + " " + (base - h * 0.45) + " L" + x + " " + (base - h * 0.85) + " L" + (x + w * 0.4) + " " + (base - h * 0.45) + ' Z" class="b-pine"/>' +
      '<path d="M' + (x - w * 0.27) + " " + (base - h * 0.7) + " L" + x + " " + (base - h) + " L" + (x + w * 0.27) + " " + (base - h * 0.7) + ' Z" class="b-pine-light"/>';
  }

  // a round bush at (x, base)
  function bush(x, base, r) {
    return '<circle cx="' + (x - r * 0.6) + '" cy="' + (base - r * 0.6) + '" r="' + (r * 0.7) + '" class="b-bush"/>' +
      '<circle cx="' + (x + r * 0.6) + '" cy="' + (base - r * 0.6) + '" r="' + (r * 0.7) + '" class="b-bush"/>' +
      '<circle cx="' + x + '" cy="' + (base - r * 0.9) + '" r="' + r + '" class="b-bush-light"/>';
  }

  // a haystack (căpiță de fân) standing at (x, base), h high, with the pole sticking out at the top
  function haystack(x, base, h) {
    var w = h * 0.78;
    return '<path d="M' + x + ' ' + (base - h - 8) + ' V' + (base - h + 4) + '" class="b-hay-pole"/>' +
      '<path d="M' + (x - w / 2) + ' ' + base + ' Q' + (x - w * 0.52) + ' ' + (base - h * 0.62) + ' ' + x + ' ' + (base - h) +
      ' Q' + (x + w * 0.52) + ' ' + (base - h * 0.62) + ' ' + (x + w / 2) + ' ' + base + ' Z" class="b-hay"/>' +
      '<path d="M' + (x - w * 0.36) + ' ' + (base - h * 0.32) + ' Q' + x + ' ' + (base - h * 0.4) + ' ' + (x + w * 0.36) + ' ' + (base - h * 0.32) +
      ' M' + (x - w * 0.24) + ' ' + (base - h * 0.62) + ' Q' + x + ' ' + (base - h * 0.69) + ' ' + (x + w * 0.24) + ' ' + (base - h * 0.62) + '" class="b-hay-line"/>';
  }

  // a leafy tree at (x, base)
  function tree(x, base, h) {
    return '<rect x="' + (x - 4) + '" y="' + (base - h * 0.4) + '" width="8" height="' + (h * 0.4) + '" class="b-trunk"/>' +
      '<circle cx="' + (x - h * 0.16) + '" cy="' + (base - h * 0.55) + '" r="' + (h * 0.22) + '" class="b-bush"/>' +
      '<circle cx="' + (x + h * 0.17) + '" cy="' + (base - h * 0.58) + '" r="' + (h * 0.21) + '" class="b-bush"/>' +
      '<circle cx="' + x + '" cy="' + (base - h * 0.78) + '" r="' + (h * 0.24) + '" class="b-bush-light"/>';
  }

  /* ---------- The railway station, with a train in front of it ---------- */
  function station(p) {
    var sleepers = "";
    for (var x = 4; x < 320; x += 20) { sleepers += '<rect x="' + x + '" y="235" width="11" height="5" class="b-sleeper"/>'; }
    return haystack(300, 210, 40) +
      // platform
      '<rect x="0" y="208" width="320" height="24" class="b-platform"/>' +
      '<rect x="0" y="208" width="320" height="3" class="b-platform-edge"/>' +
      // the station: walls, roof, the tower with the clock
      '<rect x="44" y="118" width="232" height="92" class="b-wall"/>' +
      '<rect x="44" y="200" width="232" height="10" class="b-wall-base"/>' +
      '<path d="M30 122 L62 80 L258 80 L290 122 Z" class="b-roof"/>' +
      '<rect x="30" y="120" width="260" height="5" class="b-roof-edge"/>' +
      '<rect x="134" y="56" width="52" height="66" class="b-wall"/>' +
      '<path d="M126 60 L160 26 L194 60 Z" class="b-roof"/>' +
      '<circle cx="160" cy="86" r="14" class="b-clock"/>' +
      '<path d="M160 86 V76 M160 86 L167 90" class="b-clock-hands"/>' +
      // the board with the name
      '<rect x="98" y="128" width="124" height="22" rx="4" class="b-board-dark"/>' +
      boardText(160, 140, 15, p.sign || "GARA", "b-board-text--light") +
      // windows and the big door
      '<path d="M200 196 V170 A14 14 0 0 1 228 170 V196 Z" class="b-glass"/>' +
      '<path d="M238 196 V170 A14 14 0 0 1 266 170 V196 Z" class="b-glass"/>' +
      '<path d="M146 210 V170 A14 14 0 0 1 174 170 V210 Z" class="b-dark"/>' +
      '<path d="M58 196 V170 A14 14 0 0 1 86 170 V196 Z" class="b-glass"/>' +
      // track
      '<rect x="0" y="232" width="320" height="4" class="b-rail"/>' + sleepers +
      // the locomotive (front to the right): steam, chimney, boiler, cab, wheels
      '<circle cx="80" cy="128" r="11" class="b-steam"/><circle cx="96" cy="140" r="9" class="b-steam"/><circle cx="108" cy="153" r="7" class="b-steam"/>' +
      '<path d="M100 186 L102 168 L96 163 L118 163 L112 168 L114 186 Z" class="b-ink"/>' +
      '<path d="M74 186 Q83 172 92 186 Z" class="b-gold"/>' +
      '<rect x="52" y="184" width="72" height="30" rx="8" class="b-main"/>' +
      '<rect x="70" y="184" width="4" height="30" class="b-gold"/><rect x="96" y="184" width="4" height="30" class="b-gold"/>' +
      '<rect x="118" y="180" width="13" height="34" rx="4" class="b-ink"/>' +
      '<circle cx="132" cy="176" r="4.5" class="b-lamp"/>' +
      '<rect x="16" y="166" width="40" height="48" rx="4" class="b-main"/>' +
      '<rect x="10" y="160" width="52" height="9" rx="4" class="b-dark"/>' +
      '<rect x="24" y="176" width="24" height="18" rx="3" class="b-glass-light"/>' +
      '<rect x="12" y="211" width="124" height="7" rx="3" class="b-ink"/>' +
      '<path d="M131 211 L146 232 L131 232 Z" class="b-dark"/>' +
      [30, 56, 82].map(function (cx) {
        return '<circle cx="' + cx + '" cy="222" r="10" class="b-ink"/><circle cx="' + cx + '" cy="222" r="6" class="b-dark"/><circle cx="' + cx + '" cy="222" r="2.5" class="b-gold"/>';
      }).join("") +
      '<circle cx="112" cy="225" r="7" class="b-ink"/><circle cx="112" cy="225" r="2.5" class="b-gold"/>';
  }

  /* ---------- The Advent house: 24 numbered windows (in the mixed order of an Advent calendar) ---------- */
  var ADVENT_ORDER = [13, 4, 21, 8, 17, 1, 10, 24, 6, 15, 2, 19, 22, 11, 5, 18, 9, 14, 3, 20, 16, 7, 23, 12];
  function advent(p) {
    var windows = "";
    ADVENT_ORDER.forEach(function (n, i) {
      var x = 81 + (i % 6) * 27, y = 76 + Math.floor(i / 6) * 27;
      windows += '<rect x="' + x + '" y="' + y + '" width="23" height="22" rx="3" class="b-window-warm" data-day="' + n + '"/>' +
        '<text x="' + (x + 11.5) + '" y="' + (y + 11.5) + '" font-size="11" class="b-number" text-anchor="middle" dominant-baseline="central">' + n + "</text>";
    });
    return haystack(36, 232, 52) + bush(282, 232, 14) +
      '<rect x="68" y="64" width="184" height="168" class="b-main"/>' +
      '<rect x="68" y="64" width="12" height="168" class="b-dark" opacity=".35"/>' +
      '<rect x="202" y="20" width="18" height="34" class="b-chimney"/><rect x="198" y="16" width="26" height="7" class="b-chimney"/>' +
      '<path d="M56 70 L160 12 L264 70 Z" class="b-dark"/>' +
      '<rect x="56" y="66" width="208" height="6" class="b-roof-edge"/>' +
      '<circle cx="160" cy="46" r="12" class="b-window-warm"/>' +
      '<path d="M160 38 l2.4 5 l5.4 .6 l-4 3.7 l1.1 5.3 l-4.9 -2.7 l-4.9 2.7 l1.1 -5.3 l-4 -3.7 l5.4 -.6 Z" class="b-gold"/>' +
      windows +
      '<rect x="106" y="185" width="108" height="17" rx="4" class="b-board"/>' +
      boardText(160, 193.5, 11, p.sign || "CALENDAR") +
      '<path d="M146 232 V214 A14 14 0 0 1 174 214 V232 Z" class="b-door"/>' +
      '<circle cx="168" cy="222" r="1.8" class="b-gold"/>';
  }

  /* ---------- The mountain cabin, with fir trees, a trail sign and Bubu's backpack ---------- */
  function cabin(p) {
    var logs = "";
    for (var y = 146; y < 226; y += 10) { logs += '<path d="M86 ' + y + ' H234" class="b-log-line"/>'; }
    return '<path d="M48 160 L168 34 L288 160 Z" class="b-mountain"/>' +
      '<path d="M168 34 L194 62 L181 58 L168 68 L156 58 L142 62 Z" class="b-snowcap"/>' +
      '<path d="M206 160 L262 86 L320 160 Z" class="b-mountain-far"/>' +
      pine(26, 232, 96) + pine(58, 232, 66) + pine(296, 232, 84) +
      // smoke from the chimney (stands still)
      '<circle cx="207" cy="76" r="6" class="b-steam"/><circle cx="215" cy="63" r="8" class="b-steam"/><circle cx="228" cy="50" r="10" class="b-steam"/>' +
      '<rect x="200" y="84" width="14" height="36" class="b-chimney"/>' +
      // log walls, roof, gable with a round window
      '<rect x="86" y="138" width="148" height="94" class="b-logs"/>' + logs +
      '<path d="M104 140 L160 94 L216 140 Z" class="b-gable"/>' +
      '<circle cx="160" cy="120" r="10" class="b-window-warm b-frame-wood"/>' +
      '<path d="M68 144 L160 70 L252 144 L240 146 L160 82 L80 146 Z" class="b-roof-wood"/>' +
      '<rect x="118" y="146" width="84" height="17" rx="4" class="b-board"/>' +
      boardText(160, 154.5, 11.5, p.sign || "CABANA") +
      // windows with shutters, door
      '<rect x="98" y="174" width="30" height="26" class="b-window-warm"/><path d="M113 174 V200 M98 187 H128" class="b-window-bars"/>' +
      '<rect x="90" y="172" width="8" height="30" class="b-main"/><rect x="128" y="172" width="8" height="30" class="b-main"/>' +
      '<rect x="192" y="174" width="30" height="26" class="b-window-warm"/><path d="M207 174 V200 M192 187 H222" class="b-window-bars"/>' +
      '<rect x="184" y="172" width="8" height="30" class="b-main"/><rect x="222" y="172" width="8" height="30" class="b-main"/>' +
      '<rect x="146" y="180" width="28" height="52" rx="3" class="b-door-wood"/><circle cx="168" cy="208" r="2" class="b-gold"/>' +
      // the backpack leaning by the door
      '<rect x="178" y="210" width="16" height="22" rx="5" class="b-main"/><rect x="181" y="218" width="10" height="8" rx="2" class="b-dark"/>' +
      '<path d="M182 210 Q186 202 190 210" class="b-strap"/>' +
      // the trail sign: white board with a red stripe (a marked mountain trail)
      '<rect x="266" y="170" width="6" height="62" class="b-trunk"/>' +
      '<path d="M246 172 H290 L298 181 L290 190 H246 Z" class="b-trail"/>' +
      '<rect x="252" y="178" width="34" height="6" class="b-trail-mark"/>';
  }

  /* ---------- The post office, with a mailbox in front ---------- */
  function postOffice(p) {
    return haystack(298, 232, 44) +
      '<rect x="52" y="104" width="216" height="128" class="b-wall-post"/>' +
      '<path d="M40 108 L70 72 L250 72 L280 108 Z" class="b-dark"/>' +
      '<path d="M118 74 L160 40 L202 74 Z" class="b-dark"/>' +
      '<circle cx="160" cy="62" r="12" class="b-paper"/>' +
      '<rect x="151" y="56" width="18" height="12" rx="1.5" class="b-main"/><path d="M151 57 L160 63.5 L169 57" class="b-envelope-flap"/>' +
      '<rect x="44" y="104" width="232" height="7" class="b-cornice"/>' +
      '<rect x="102" y="118" width="116" height="22" rx="4" class="b-board"/>' +
      boardText(160, 129.5, 15, p.sign || "POȘTA") +
      '<rect x="72" y="150" width="36" height="44" rx="3" class="b-glass"/><path d="M90 150 V194 M72 170 H108" class="b-window-bars-light"/>' +
      '<rect x="212" y="150" width="36" height="44" rx="3" class="b-glass"/><path d="M230 150 V194 M212 170 H248" class="b-window-bars-light"/>' +
      '<rect x="138" y="150" width="44" height="70" rx="3" class="b-main"/><path d="M160 152 V218" class="b-door-line"/>' +
      '<circle cx="155" cy="188" r="2" class="b-gold"/><circle cx="165" cy="188" r="2" class="b-gold"/>' +
      '<rect x="130" y="220" width="60" height="6" class="b-step"/><rect x="124" y="226" width="72" height="6" class="b-step"/>' +
      // the mailbox on its post (Bubu's letters go here)
      '<rect x="30" y="196" width="7" height="36" class="b-post-pole"/>' +
      '<rect x="14" y="158" width="38" height="44" rx="9" class="b-mailbox"/>' +
      '<rect x="21" y="170" width="24" height="4" rx="2" class="b-ink"/>' +
      '<rect x="24" y="182" width="18" height="12" rx="1.5" class="b-paper"/><path d="M24 183 L33 189 L42 183" class="b-envelope-flap-dark"/>';
  }

  /* ---------- A simple house for any other game: an emoji in the round window, a word on the board ---------- */
  function house(p) {
    return bush(46, 232, 15) + bush(282, 232, 13) +
      '<rect x="84" y="132" width="152" height="100" class="b-light"/>' +
      '<path d="M68 138 L160 60 L252 138 Z" class="b-dark"/>' +
      '<rect x="68" y="134" width="184" height="6" class="b-roof-edge"/>' +
      '<circle cx="160" cy="108" r="17" class="b-paper"/>' +
      (p.icon ? '<text x="160" y="109" font-size="20" text-anchor="middle" dominant-baseline="central">' + esc(p.icon) + "</text>" : "") +
      '<rect x="116" y="146" width="88" height="17" rx="4" class="b-board"/>' +
      boardText(160, 154.5, 11.5, p.sign || "JOC") +
      '<rect x="100" y="174" width="30" height="28" class="b-glass"/><rect x="96" y="202" width="38" height="6" class="b-main"/>' +
      '<rect x="190" y="174" width="30" height="28" class="b-glass"/><rect x="186" y="202" width="38" height="6" class="b-main"/>' +
      '<rect x="146" y="178" width="28" height="54" rx="3" class="b-door"/><circle cx="168" cy="206" r="2" class="b-gold"/>';
  }

  /* ---------- The little forest: fir trees and leafy trees, a path with animal tracks on it ---------- */
  function forest(p) {
    // paw prints along the path: [x, y, size, angle]
    var prints = [[150, 228, 1, -8], [168, 218, 1, -4], [152, 207, 0.9, -10], [170, 197, 0.85, -6], [156, 188, 0.75, -12], [171, 180, 0.7, -8]];
    var tracks = prints.map(function (t) {
      return '<g transform="translate(' + t[0] + " " + t[1] + ") rotate(" + t[3] + ") scale(" + t[2] + ')" class="b-tracks">' +
        '<ellipse cx="0" cy="2" rx="4.2" ry="3.6"/><circle cx="-4.4" cy="-3.2" r="1.7"/><circle cx="-1.5" cy="-5.2" r="1.7"/>' +
        '<circle cx="1.6" cy="-5.2" r="1.7"/><circle cx="4.4" cy="-3.2" r="1.7"/></g>';
    }).join("");
    return pine(70, 160, 110) + pine(250, 160, 120) + pine(160, 150, 120) +
      tree(116, 172, 96) + tree(206, 170, 92) +
      // the path going into the forest
      '<path d="M120 240 C140 214 150 196 158 170 L170 170 C178 196 196 214 214 240 Z" class="b-path"/>' +
      tracks +
      pine(28, 236, 120) + pine(298, 236, 110) + pine(92, 238, 86) + pine(236, 238, 92) +
      bush(60, 240, 14) + bush(268, 240, 13) +
      // the board at the edge of the forest
      '<rect x="190" y="196" width="6" height="42" class="b-trunk"/>' +
      '<rect x="162" y="186" width="62" height="18" rx="4" class="b-board"/>' +
      boardText(193, 195, 10, p.sign || "PĂDUREA");
  }

  var DRAW = { station: station, advent: advent, cabin: cabin, "post-office": postOffice, house: house, forest: forest };

  function card(p, index) {
    var color = COLORS.indexOf(p.color) >= 0 ? p.color : "red";
    var draw = DRAW[p.type] || house;
    var open = !!p.url;
    var tag = open ? "a" : "div";
    // one on the right, the next one on the left ...: the country road winds between them (assets/js/road.js).
    // The first one is on the right, because the entrance sign of the village stands on the left.
    var side = index % 2 ? " place--left" : " place--right";
    return "<" + tag + ' class="place place--' + color + " place--" + (DRAW[p.type] ? p.type : "house") + side + (open ? "" : " place--soon") + '"' +
      (open ? ' href="' + esc(p.url) + '"' : "") + ">" +
      '<span class="place__scene">' +
        '<svg class="place__svg" viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' + draw(p) + "</svg>" +
        (p.badge ? '<span class="place__badge">' + esc(p.badge) + "</span>" : "") +
      "</span>" +
      '<span class="place__info">' +
        '<span class="place__title">' + esc(p.title) + "</span>" +
        (p.description ? '<span class="place__desc">' + esc(p.description) + "</span>" : "") +
        '<span class="place__btn">' + (open ? "Intră ➜" : "În curând") + "</span>" +
      "</span>" +
      "</" + tag + ">";
  }

  holder.innerHTML = (window.PLACES || []).filter(function (p) { return p && p.title; }).map(card).join("");
})();
