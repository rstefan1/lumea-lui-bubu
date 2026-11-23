/* =====================================================================
   assets/js/scroll-hint.js – the "Vezi tot satul ↓" button at the bottom of the screen.
   It tells children, parents and grandparents that there are more buildings below:
     - shown only when part of the village is hidden below the screen and the page is at the top;
     - a tap scrolls to the first building that is not fully seen;
     - it goes away as soon as the page is scrolled (and comes back at the top).
   ===================================================================== */
(function () {
  "use strict";

  var hint = document.getElementById("scroll-hint");
  if (!hint) { return; }
  var places = Array.prototype.slice.call(document.querySelectorAll(".place"));
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // the first building whose bottom (with its button) is below the screen
  function firstHidden() {
    var h = window.innerHeight;
    for (var i = 0; i < places.length; i++) {
      if (places[i].getBoundingClientRect().bottom > h - 8) { return places[i]; }
    }
    return null;
  }

  function update() {
    var hidden = firstHidden();
    hint.hidden = !hidden && window.scrollY < 40;
    hint.classList.toggle("is-gone", !hidden || window.scrollY > 40);
  }

  hint.addEventListener("click", function () {
    var target = firstHidden();
    if (!target) { return; }
    var top = target.getBoundingClientRect().top + window.scrollY - 12;
    window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
  });

  var waiting = false;
  function later() {
    if (waiting) { return; }
    waiting = true;
    window.requestAnimationFrame(function () { waiting = false; update(); });
  }
  window.addEventListener("scroll", later, { passive: true });
  window.addEventListener("resize", later);
  window.addEventListener("load", update);   // after the fonts and the pictures, the sizes are final
  update();
})();
